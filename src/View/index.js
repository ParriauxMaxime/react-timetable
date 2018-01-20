/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/

import React from 'react'
import moment from 'moment'
import {DURATION} from '../index'

export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    getDaily(events) {
        const d = moment(this.props.date)
        const date = d.date()
        const month = d.month()
        const year = d.year()
        const isToday = (e) => {
            const [s, f] = [moment(e.start), moment(e.end)]
            return (s.date() === date && s.month() === month && s.year() === year) ||
                (f.date() === date && f.month() === month && f.year() === year)
        };
        return events.filter(isToday)
    }

    getWeekly(events) {
        const d = moment(this.props.date);
        const week = d.week();
        const year = d.year();
        const isWeek = (e) => {
            const [s, f] = [moment(e.start), moment(e.end)]
            return (s.week() === week && s.year() === year) ||
                (f.week() === week && f.year() === year)
        };
        return events.filter(isWeek)
    }

    getMonthly(events) {
        const d = moment(this.props.date);
        const month = d.month()
        const year = d.year()
        const isMonth = (e) => {
            const [s, f] = [moment(e.start), moment(e.end)]
            return (s.month() === month && s.year() === year) ||
                (f.month() === month && f.year() === year)
        };
        return events.filter(isMonth)
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