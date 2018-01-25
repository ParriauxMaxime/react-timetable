/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:59
 ** Table.js
 ** 2017 - All rights reserved
 ***************************************/

import Parent from './index'
import React from 'react'
import moment from 'moment'
import {DURATION} from '../index'

const style = {
    border    : (color = 'black') => ({border: `${color} 1px solid`}),
    flex      : {display: 'flex'},
    flexR     : {display: 'flex', flexDirection: 'row'},
    flexC     : {display: 'flex', flexDirection: 'column'},
    flexCenter: {display: 'flex', justifyContent: 'center'},
    padding   : (v = '8px') => ({padding: v}),
    height    : (v = '100%') => ({height: v}),
    width     : (v = '100%') => ({width: v}),
}

const HOUR_COLUMNS_WIDTH = 60
const HCW = HOUR_COLUMNS_WIDTH

export class Table extends Parent {
    constructor(props) {
        super(props)
        this.columns = []
        this.timeStart = props.timeStart || 8
        this.timeEnd = props.timeStart || 20
        this.timeDivision = props.timeDivision || 4
        this.state = {
            renderDayEvent: () => <span>loading</span>,
            columns       : []
        }
        this.resizeListener = window.addEventListener('resize', () => {
            this.columns = []
            this.forceUpdate(() => {
                this.setState({renderDayEvent: this.renderDayEvent.bind(this), columns: this.columns.slice(this.columns.length / 2)})
            })
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    renderHours(e, i) {
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
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

    componentDidMount() {
        this.setState({renderDayEvent: this.renderDayEvent.bind(this), columns: this.columns})
    }

    renderColumn(e, i) {
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
        return (
            <div key={`c-${i}`} ref={(e) => {this.columns.push(e)}}
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
        let hours = []
        for (let i = 0; i <= ((this.timeEnd - this.timeStart) * this.timeDivision) + this.timeDivision - 1; i++) {
            hours.push({
                hour  : this.timeStart + Math.floor(i / this.timeDivision),
                minute: Math.floor(60 / this.timeDivision) * (i % this.timeDivision)
            })
        }
        return hours
    }

    _dayGraph(sortedEvent: Array): Array {
        const tab = sortedEvent.map((e, i, t) => {
            const collisions = this.getCollisions(e, t)
            return {
                event: e,
                collisions,
            }
        })
        return tab
    }

    renderDayEvent({date, events, index}) {
        if (!this.state.columns.length)
            return null
        const forWeek = (this.timeEnd - this.timeStart + 1) * this.timeDivision;
        const [f, l] = [this.state.columns[forWeek * index], this.state.columns[forWeek * (index + 1) -1]]
        const sortedEvent = events.sort((a, b) => a.start === b.start ? 0 : a.start < b.start ? -1 : 1)
            .filter(e => moment(e.start).hour() >= this.timeStart && moment(e.end).hour() >= this.timeStart &&
                moment(e.end).hour() <= this.timeEnd && moment(e.start).hour() <= this.timeEnd)
        let CURRENT_NODE = null;
        return (
            <div style={{
                width          : f.getBoundingClientRect().width,
                height         : l.getBoundingClientRect().bottom - f.getBoundingClientRect().top,
                left           : f.getBoundingClientRect().left,
                top            : f.getBoundingClientRect().top,
                position       : 'absolute',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
            }}>
                {
                    this._dayGraph(this.getDaily(sortedEvent, date)).map((e, i, tab) => {
                        const {start, end} = e.event
                        const [hs, ms] = [moment(start).hour(), moment(start).minute()]
                        const [he, me] = [moment(end).hour(), moment(end).minute()]
                        const [s, d] = [
                            this.state.columns[forWeek * index + ((hs - this.timeStart) * this.timeDivision + (ms / (60 / this.timeDivision)))],
                            this.state.columns[forWeek * index + ((he - this.timeStart) * this.timeDivision + (me / (60 / this.timeDivision)))],
                        ]
                        let w;
                        let left;
                        if (CURRENT_NODE === null && e.collisions.length !== 1) {
                            CURRENT_NODE = e;
                            w = CURRENT_NODE.collisions.length !== 0 ? Math.floor(100 / (CURRENT_NODE.collisions.length)) : 100
                            left = 0;
                        }
                        else if (CURRENT_NODE === null) {
                            w = 100;
                            left = 0;
                        }
                        else {
                            const getPastEvent = (node) => {
                                return node.collisions.indexOf(node.event)
                            }
                            w = CURRENT_NODE.collisions.length !== 0 ? Math.floor(100 / (CURRENT_NODE.collisions.length)) : 100
                            const tmp = CURRENT_NODE.collisions.slice(getPastEvent(CURRENT_NODE)).indexOf(e.event)
                            left = tmp === - 1 ?
                                100 :
                                tmp *  w;
                            if (CURRENT_NODE.collisions.indexOf(e.event) === CURRENT_NODE.collisions.length - 1) {
                                CURRENT_NODE = null;
                            }
                        }
                        const lastRow = this.state.columns[this.state.columns.length]
                        const st = {
                            height         : (d ? d.getBoundingClientRect().top : lastRow.getBoundingClientRect().top) -
                            (s ? s.getBoundingClientRect().top : this.state.columns[0].getBoundingClientRect().top),
                            width          : `${w}%`,
                            left           : `${left}%`,
                            top            : s.getBoundingClientRect().top - this.state.columns[0].getBoundingClientRect().top,
                            position       : 'absolute',
                            backgroundColor: 'rgba(50,50,200,0.9)',
                            color          : 'white',
                            border         : '1px solid rgba(0, 0, 0, 0.3)',
                            boxSizing      : 'border-box'
                        }
                        return (
                            <div key={`event-${i}`} style={st}>
                                <div style={{}}>
                                    {e.event.module}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }


    renderDay({date, events, index = 0, independent = true}) {
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
                                    {this.renderColumn(e, i)}
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
        const monday = this.getMonday(date)
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
            days.push(<Day key={`d-${i}`} date={d} events={events} index={i} independent={false}/>)
        }
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
        const hoursArray = this._hoursArray()
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
        const first = this.getMonday(this.getFirstDayOfTheMonth(date))
        const mfirst = moment(first)
        const last = this.getSunday(this.getLastDayOfTheMonth(date))
        const mlast = moment(last)
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
        const nbWeeks = mlast.week() - mfirst.week() + 1

        const Day = (date: moment, i: number) => {
            return (
                <div key={`day-${date.date()}-${i}`} style={{
                    borderBottom: '',
                    borderRight : i === 6 ? 'none' : 'solid rgba(0,0,0,0.5) 1px',
                    width       :
                        '100%',
                    height      : '100%',
                    minWidth    : '100px',
                    minHeight   : '100px'
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
                </div>
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