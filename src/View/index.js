/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/

import React, {Component} from 'react'
import moment from 'moment'
import {DURATION} from '../index'

export default class extends React.Component {
    constructor(props) {
        super(props)
    }

    getDaily(events) {
        const date = this.props.date.getDate();
        const isToday = (e) => (e.start.getDate() === date || e.end.getDate() === date)
        return events.filter(isToday)
    }

    getWeekly(events) {
        const week = moment(this.props.date).week();
        const isWeek = (e) => (moment(e.start).week() === week || moment(e.end).week() === week)
        return events.filter(isWeek)
    }

    getMonthly(events) {
        const month = moment(this.props.date).month();
        const isMonth = (e) => (moment(e.start).month() === month || moment(e.end).month() === month);
        return events.filter(isMonth);
    }

    getEvents({events, duration}) {
        switch (duration) {
            case DURATION.month: return this.getMonthly(events);
            case DURATION.week: return this.getWeekly(events);
            case DURATION.day: return this.getDaily(events);
            default: return null;
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
            default: return null;
        }
    }
}