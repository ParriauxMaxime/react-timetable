/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/

import React from 'react'
import Parent from './index'
import moment from 'moment'
import {getToday} from '../util'

const flexP = {
    display: 'flex',
    padding: '0 10px'
}

const minWidth = 32

const defaultStyle = {
    container      : {
        ...flexP,
        flexDirection: 'row',
        margin       : '4px 0',
        padding      : '8px',
    },
    dateContainer  : {
        ...flexP,
        minWidth: 200,
        width   : '20%',
    },
    eventsContainer: {
        ...flexP,
        flexDirection: ' column',
        minWidth     : 400,
        width        : '60%',
    },
    eventContainer : (i) => ({
        display        : 'flex',
        backgroundColor: !(i % 2) ? 'rgba(10, 10, 10, 0.2)' : 'transparent',
        justifyContent : 'flex-start'
    }),
    hourLimit      : {
        minWidth,
        marginRight: 4,
    },
    creator        : {
        minWidth
    },
    title          : {
        minWidth,
        fontWeight: 'bold',
    },
    weekContainer  : {},
    monthContainer : {}
}

export class List extends Parent {
    constructor(props) {
        super(props)
    }

    renderDay({date, events}) {
        if (this.props.renderDay)
            return this.props.renderDay({date, events})
        return (
            <div style={defaultStyle.container}>
                <div style={defaultStyle.dateContainer}>
                    {moment(date).format('dddd DD MMMM YYYY')}
                </div>
                <div style={defaultStyle.eventsContainer}>
                    {
                        events.slice().sort(function (a, b) {
                            a = new Date(a.start)
                            b = new Date(b.start)
                            return a < b ? -1 : a > b ? 1 : 0
                        }).map((e, i) => {
                            const key = e._id || i
                            return (
                                <div key={key} style={defaultStyle.eventContainer(i)}>
                                    <div role='hour-limit' style={defaultStyle.hourLimit}>
                                        {`${moment(e.start).format('HH:mm')} - ${moment(e.end).format('HH:mm')}`}
                                    </div>
                                    <div role='creator' style={defaultStyle.creator}>
                                        {e.creator}
                                    </div>
                                    <div role='module' style={defaultStyle.title}>
                                        {e.module}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    renderWeek({date, events}) {
        if (this.props.renderWeek)
            return this.props.renderWeek({date, events})


        const monday = this.getMonday(date)
        let days = []
        for (let i = 0; i < 7; i++) {
            const Day = this.renderDay.bind(this)
            const d = new Date(new Date(monday).setDate(monday.getDate() + i))
            const [date, month, year] = [d.getDate(), d.getMonth(), d.getFullYear()]
            const isToday = (e) => {
                const [s, f] = [moment(e.start), moment(e.end)]
                return (s.date() === date && s.month() === month && s.year() === year) ||
                    (f.date() === date && f.month() === month && f.year() === year)
            }
            days.push(
                <Day {...{date: d, events: events.filter(isToday)}}
                     key={`${moment(d).format('DD MM YYYY')}-${i}`}/>
            )
            days.push(<hr key={`sorryBadDesignPattern-${i}`}/>)
        }
        return (
            <div style={defaultStyle.weekContainer}>
                {days}
            </div>
        )
    }

    renderMonth({date, events}) {
        if (this.props.renderMonth)
            return this.props.renderMonth({date, events})


        const first = this.getFirstDayOfTheMonth(date)
        const last = this.getLastDayOfTheMonth(date)
        let days = []
        for (let i = 0; i <= last.getDate() - first.getDate(); i++) {
            const Day = this.renderDay.bind(this)
            const d = new Date(new Date(first).setDate(first.getDate() + i))
            days.push(
                <Day {...{date: d, events: getToday(events, d)}}
                      key={`${moment(d).format('MM YYYY')}-${i}`}/>
            )
            days.push(<hr key={`hr-${moment(d).format('MM YYYY')}-${i}`}/>)
        }
        return (
            <div style={defaultStyle.weekContainer}>
                {days}
            </div>
        )
    }

    render() {
        return super.render()
    }
}