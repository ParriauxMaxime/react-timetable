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

const flexP = {
    display: 'flex',
    padding: '0 10px'
}

const defaultStyle = {
    container      : {
        ...flexP,
        flexDirection: 'row'
    },
    dateContainer  : {
        ...flexP,
    },
    eventsContainer: {
        ...flexP,
        flexDirection: ' column'
    },
    eventContainer : {
        display        : 'flex',
        backgroundColor: 'rgba(0.3, 0.3, 0.3, 0.2)',
        borderRadius   : '10px',
        justifyContent : 'space-between'
    },
    hourLimit : {
        padding: '0 16px',
    },
    creator : {
        padding: '0 16px',
    },
    title : {
        padding: '0 16px',
        fontWeight: 'bold',
    }
}

export class List extends Parent {
    constructor(props) {
        super(props)
    }

    renderDay({date, events}) {
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
                            const key = e._id || i;
                            return (
                                <div key={key} style={defaultStyle.eventContainer}>
                                    <div role='hour-limit' style={defaultStyle.hourLimit}>
                                        {`${moment(e.start).format('hh:mm')} - ${moment(e.end).format('hh:mm')}`}
                                    </div>
                                    <div role='creator' style={defaultStyle.creator}>
                                        {e.creator}
                                    </div>
                                    <div role='title' style={defaultStyle.title}>
                                        {e.title}
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
        function getMonday(d) {
            const day = d.getDay(),
                diff = d.getDate() - day + (day === 0 ? -6:1);
            return new Date(new Date(d).setDate(diff));
        }
        const monday = getMonday(date)
        let days = []
        for (let i = 0; i < 7; i++) {
            const Day = this.renderDay.bind(this)
            const d = new Date(new Date(monday).setDate(monday.getDate() + i))
            const day = d.getDate()
            const isToday = (e) => (e.start.getDate() === day || e.end.getDate() === day)
            days.push(<Day {...{date: d, events: events.filter(isToday)}} key={moment(d).format('DDDD dd MMMM YYYY')}/>)
        }
        return days
    }

    renderMonth({date, events}) {
        function getFirstDayOfTheMonth(d) {
            const date = d.getDate(),
                diff = (d.getDate() - date) + 1
            return new Date(new Date(d).setDate(diff));
        }
        function getLastDayOfTheMonth(d) {
            const date = d.getDate(),
                diff = (d.getDate() - date) + 1,
                month = d.getMonth(),
                next_month = d.getMonth() + 1,
                first = new Date(new Date(d).setDate(diff)),
                firstNextMonth = new Date(first.setMonth(next_month)),
                lastDayOfLastMonth = new Date(firstNextMonth.setDate(firstNextMonth.getDate() - 1));
            return lastDayOfLastMonth
        }
        const first = getFirstDayOfTheMonth(date)
        const last = getLastDayOfTheMonth(date);
        let weeks = []
        for (let i = 0; i <= last.getDate() - first.getDate(); i += 7) {
            const Week = this.renderWeek.bind(this)
            const d = new Date(new Date(first).setDate(first.getDate() + i))
            const week = moment(d).week();
            const isWeek = (e) => (moment(e.start).week() === week || moment(e.end).week() === week)
            weeks.push(<Week {...{date: d, events: events.filter(isWeek)}} key={moment(d).format('DDDD dd MMMM YYYY')} />)
        }
        return weeks;
    }

    render() {
        return super.render()
    }
}