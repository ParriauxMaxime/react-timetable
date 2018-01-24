/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/

import React from 'react'
import {DURATION} from '../index'
import {getMonth, getToday, getWeek} from '../util'


export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    getDaily(events) {
        return getToday(events, this.props.date)
    }

    getWeekly(events) {
        return getWeek(events, this.props.date)
    }

    getMonthly(events) {
        return getMonth(events, this.props.date)
    }

    getMonday(d) {
        const day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(new Date(d).setDate(diff))
    }

    getSunday(d) {
        const day = d.getDay(),
            diff = d.getDate() + (7 - day)
        return new Date(new Date(d).setDate(diff))
    }

    getFirstDayOfTheMonth(d) {
        const date = d.getDate(),
            diff = (d.getDate() - date) + 1
        return new Date(new Date(d).setDate(diff))
    }

    getLastDayOfTheMonth(d) {
        //DUUUH
        const date = d.getDate(),
            diff = (d.getDate() - date) + 1,
            next_month = d.getMonth() + 1,
            first = new Date(new Date(d).setDate(diff)),
            firstNextMonth = new Date(first.setMonth(next_month))
        return new Date(firstNextMonth.setDate(firstNextMonth.getDate() - 1))
    }

    getEvents({events, duration}) {
        switch (duration) {
            case DURATION.month:
                return this.getMonthly(events)
            case DURATION.week:
                return this.getWeekly(events)
            case DURATION.day:
                return this.getDaily(events)
            default:
                return null
        }
    }

    render() {
        const events = this.getEvents(this.props)
        const Day = this.renderDay.bind(this)
        const Week = this.renderWeek.bind(this)
        const Month = this.renderMonth.bind(this)
        switch (this.props.duration) {
            case DURATION.day: {
                return <Day {...this.props} events={events}/>
            }
            case DURATION.week: {
                return <Week {...this.props} events={events}/>
            }
            case DURATION.month: {
                return <Month {...this.props} events={events}/>
            }
            default:
                return null
        }
    }
}