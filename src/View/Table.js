/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:59
 ** Table.js
 ** 2017 - All rights reserved
 ***************************************/

import React from 'react'
import type {ViewProps} from './index'
import {AbstractView} from './index'
import moment from 'moment'
import {VIEW} from '../util/api'
import {defaultStyleTable} from '../styles'
import {sortDate} from '../util/util'

const style = defaultStyleTable

const HOUR_COLUMNS_WIDTH = 60
const HCW = HOUR_COLUMNS_WIDTH


export class Table extends AbstractView {
    static defaultProps = {
        view: VIEW.table
    }

    constructor(props) {
        super(props)
        window.scrollTo(0, 0)
        this.columns = []
        this.state = {
            renderDayEvent: () => <span>loading</span>,
            columns       : []
        }
        this.resizeListener = window.addEventListener('resize', () => {
            this.columns = []
            this.forceUpdate(() => {
                this.setState({
                    renderDayEvent: this.renderDayEvent.bind(this),
                    columns       : this.columns.slice(this.columns.length / 2)
                })
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener)
    }

    componentDidMount() {
        const cpy = this.columns.slice()
        this.setState({renderDayEvent: this.renderDayEvent.bind(this), columns: cpy})
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.duration !== nextProps.duration || this.props.date !== nextProps.date) {
            this.columns = []
            this.setState({renderDayEvent: () => null}, () => {
                const cpy = this.columns.slice().filter(e => e)
                this.setState({
                    renderDayEvent: this.renderDayEvent.bind(this),
                    columns       : cpy
                })
            })
        }
    }

    renderHours(e, i) {
        const {timeDivision} = this.props
        const lastOne = (60 / timeDivision * (timeDivision - 1))
        return <div key={`h-${i}`} style={{
            minWidth    : HCW,
            boxSizing   : 'border-box',
            borderRight : '1px' +
            ' solid black', ...style.flexCenter,
            borderBottom: `1px rgba(10, 10, 10, 0.3) ${e.minute === lastOne ? 'solid' : 'none'}`
        }}>
            {e.minute === 0 ? moment(Date.now()).hours(e.hour).minutes(0).format('HH:mm') : ''}
            &nbsp;
        </div>
    }

    renderColumn(e, i, index = 0) {
        const {timeDivision} = this.props
        const lastOne = (60 / timeDivision * (timeDivision - 1))
        return (
            <div key={`c-${i}-${index}`} ref={(f) => {this.columns.push(f)}}
                 style={{
                     ...style.width('100%'),
                     minHeight   : 18,
                     ...style.flexR,
                     borderBottom: `1px rgba(10, 10, 10, 0.3) ${e.minute === lastOne ? 'solid' : 'none'}`
                 }}>
                <div style={{
                    ...style.width('100%'),
                    borderBottom: `1px black ${e.minute === lastOne ? 'solid' : 'dashed'}`
                }}>
                </div>
            </div>
        )
    }

    _hoursArray() {
        const {timeStart, timeEnd, timeDivision} = this.props
        let hours = []
        for (let i = 0; i <= ((timeEnd - timeStart) * timeDivision) + timeDivision - 1; i++) {
            hours.push({
                hour  : timeStart + Math.floor(i / timeDivision),
                minute: Math.floor(60 / timeDivision) * (i % timeDivision)
            })
        }
        return hours
    }

    static _dayGraph(sortedEvent: Array): Array {
        return sortedEvent.map((e, i, t) => {
            const collisions = AbstractView.getCollisions(e, t)
            return {
                event: e,
                collisions,
            }
        })
    }

    renderDayEvent({date, events, index}) {
        const {timeStart, timeEnd, timeDivision} = this.props
        let overlay = this.state.columns
        if (!overlay.length)
            return null
        const nbRowPerDay = (timeEnd - timeStart + 1) * timeDivision
        const first = overlay[nbRowPerDay * index]
        const last = overlay[nbRowPerDay * (index + 1) - 1]
        const filterWantedEvents = e => moment(e.start).hour() >= timeStart && moment(e.end).hour() >= timeStart &&
            moment(e.end).hour() <= timeEnd && moment(e.start).hour() <= timeEnd
        const sortedEvent = events
            .sort(sortDate)
            .filter(filterWantedEvents)


        /**
         * Really.
         * Please know that I ashamed of what is coming,
         * The next 70 lines are the products of long sleepless nights
         * and bad choices.
         * "This is 100% working", said no honest developer ever.
         *
         * If you're really decided to implement a Table view inherited from this class :
         * - I take advantage of ref React element.
         * At render time : The component should first render ref elements, because we need to know
         *                  how to dispose our event on the DOM.
         * ComponentDidMount:
         *          Once the DOM mounted, you should place your elements on an *Overlay grid*
         *          Basically, an overlay grid, (as this.state.columns) is composed of
         *          timeDivision * (timeEnd - timeStart) elements.
         *          (e.g : with timeEnd = 20, timeStart = 8 and timeDivision = 4,
         *           an overlay would be composed of (((20 - 8)  + 1) * 4)) = 52 refs in the overlay
         *           Grid
         *
         *          There should be one Overlay grid per day.
         * Collisions in timetable is and will be root of all evil
         *
         **/
        let CURRENT_NODE = null
        return (
            <div style={{
                width          : first.getBoundingClientRect().width,
                height         : last.getBoundingClientRect().bottom - first.getBoundingClientRect().top,
                left           : first.getBoundingClientRect().left,
                top            : window.top + first.getBoundingClientRect().top,
                position       : 'absolute',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            }}>
                {
                    Table._dayGraph(AbstractView.getToday(sortedEvent, date)).map((e, i) => {
                        const {start, end} = e.event
                        const [hs, ms] = [moment(start).hour(), moment(start).minute()]
                        const [he, me] = [moment(end).hour(), moment(end).minute()]
                        const [s, d] = [
                            overlay[nbRowPerDay * index + ((hs - timeStart) * timeDivision + (ms / (60 / timeDivision)))],
                            overlay[nbRowPerDay * index + ((he - timeStart) * timeDivision + (me / (60 / timeDivision)))],
                        ]
                        let width
                        let left
                        if (CURRENT_NODE === null && e.collisions.length !== 1) {
                            CURRENT_NODE = e
                            width = CURRENT_NODE.collisions.length !== 0 ? Math.floor(100 / (CURRENT_NODE.collisions.length)) : 100
                            left = 0
                        }
                        else if (CURRENT_NODE === null) {
                            width = 100
                            left = 0
                        }
                        else {
                            const getPastEvent = (node) => {
                                return node.collisions.indexOf(node.event)
                            }
                            width = CURRENT_NODE.collisions.length !== 0 ? Math.floor(100 / (CURRENT_NODE.collisions.length)) : 100
                            let tmp = CURRENT_NODE.collisions.slice(getPastEvent(CURRENT_NODE)).indexOf(e.event)
                            if (tmp === -1) {
                                CURRENT_NODE = e
                                tmp = CURRENT_NODE.collisions.slice(getPastEvent(CURRENT_NODE)).indexOf(e.event)
                                width = CURRENT_NODE.collisions.length !== 0 ? Math.floor(100 / (CURRENT_NODE.collisions.length)) : 100
                            }
                            left = tmp * width
                            if (CURRENT_NODE.collisions.indexOf(e.event) === CURRENT_NODE.collisions.length - 1) {
                                CURRENT_NODE = null
                            }
                        }
                        const firstRow = overlay[0]
                        const lastRow = overlay[overlay.length]
                        const height = (d ? d.getBoundingClientRect().top : lastRow.getBoundingClientRect().top) -
                            (s ? s.getBoundingClientRect().top : firstRow.getBoundingClientRect().top)
                        const defaultStyle = {
                            height,
                            width: `${width}%`,
                            left : `${left}%`,
                            top  : s.getBoundingClientRect().top - firstRow.getBoundingClientRect().top,
                        }
                        return e.event.renderTable(defaultStyle)
                    })
                }
            </div>
        )
    }


    renderDay({date, events, index = 0, independent = true}: ViewProps) {
        const hoursArray = this._hoursArray()
        const tmp = (
            <div style={independent ? {...style.border(), ...style.padding()} : {width: '100%'}}>
                <div role="header" style={{...style.flexCenter}}>
                    {moment(date).format('dddd DD/MM')}
                </div>
                <hr/>
                <div role="content"
                     style={{...style.flexCenter, ...style.border(), ...style.flexC, ...style.padding('0')}}>
                    {
                        hoursArray.map((e, i) => {
                            return (
                                <div key={`k-${i}`} style={{...style.flexR}}>
                                    {independent ? this.renderHours(e, i) : null}
                                    {this.renderColumn(e, i, index)}
                                </div>
                            )
                        })
                    }
                    {this.state.renderDayEvent({date, events, index})}
                </div>
            </div>
        )
        return tmp
    }

    renderWeek({date, events}) {
        const monday = AbstractView.getMonday(date)
        let days = []
        days.push(
            <div key={'hours-col'} style={{minWidth: HCW, justifyContent: 'flex-end'}}>
                <div role="header" style={style.flexCenter}>
                    &nbsp;
                </div>
                <hr/>
                <div role="content"
                     style={{...style.flexCenter, ...style.border(), ...style.flexC, ...style.padding('0')}}>
                    {this._hoursArray().map(this.renderHours.bind(this))}
                </div>
            </div>
        )
        for (let i = 0; i < 7; i++) {
            const d = new Date(new Date(monday).setDate(monday.getDate() + i))
            const Day = this.renderDay.bind(this)
            days.push(<Day key={`d-${i}`}
                           date={d}
                           events={events}
                           index={i}
                           independent={false}/>)
        }
        return (
            <div role="content"
                 style={{...style.flexCenter, ...style.border(), ...style.flexR, ...style.padding('0')}}>
                {
                    days
                }
            </div>
        )
    }

    renderMonth({date, events}) {
        const minHeight = 100
        const mfirst = moment(AbstractView.getMonday(AbstractView.getFirstDayOfTheMonth(date)))
        const mlast = moment(AbstractView.getSunday(AbstractView.getLastDayOfTheMonth(date)))
        let days = []
        let dayNames = []
        let j = 0
        for (let i = mfirst.clone(); (i.date() <= mlast.date()) || (i.month() !== mlast.month());) {
            j++
            if (j <= 7) {
                dayNames.push(i.format('dddd'))
            }
            days.push(i)
            i = i.clone().add(1, 'd')
        }
        const Day = (date: moment, i: number) => {
            return (
                <React.Fragment key={`day-${date.date()}-${i}`}>
                    <div style={{
                        borderBottom: '',
                        borderRight : i === 6 ? 'none' : 'solid rgba(0,0,0,0.5) 1px',
                        width       :
                            '100%',
                        height      : '100%',
                        minWidth    : '100px',
                        minHeight,
                    }}>
                        <div style={{
                            ...style.width(),
                            textAlign      : 'end',
                            alignItems     : 'center',
                            padding        : '0 2px',
                            boxSizing      : 'border-box',
                            backgroundColor: 'rgba(140, 100, 100, 0.5)',
                            borderTop      : '1px solid black',
                            borderBottom   : '1px solid black',
                        }}>
                            {date.date()}
                        </div>
                        <div className={'content'}
                             style={{
                                 minHeight,
                                 width        : '100%',
                                 display      : 'flex',
                                 flexDirection: 'column'
                             }}
                             ref={(ref) => {this.columns.push(ref)}}>
                            {
                                AbstractView.getToday(this.props.events, date).map((e, i) => {
                                    return e.renderList()
                                })
                            }

                        </div>
                    </div>
                </React.Fragment>
            )
        }
        const Week = (dates: Array, i: number) => {
            return (
                <div key={`week-${dates[0].week()}-${i}`}
                     style={{
                         ...style.flexR,
                         ...style.height(),
                     }}>
                    {
                        dates.map(Day)
                    }
                </div>
            )
        }
        const d = [...days]
        let weeks = []
        while (d.length) weeks.push(d.splice(0, 7))
        return (
            <div style={{...style.height(), ...style.flexC, border: '1px solid black'}}>
                <div style={{...style.flexR, ...style.height()}}>
                    {
                        dayNames.map((e, i) => {
                            return <div key={`name-${e}`}
                                        style={{...style.flexCenter, ...style.width()}}>{e}</div>
                        })
                    }
                </div>
                {
                    weeks.map(Week)
                }
            </div>
        )
    }

    render() {
        return super.render()
    }
}