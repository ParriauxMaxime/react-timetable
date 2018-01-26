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
import {getToday, sortDate} from '../util'
import {DefaultDay, DefaultListEvent, defaultStyleList} from '../styles'
import {TimeEvent, VIEW} from '../api'

const defaultStyle = defaultStyleList;

export class List extends Parent {
    static defaultProps = {
        view: VIEW.list
    }

    constructor(props) {
        super(props)
    }

    renderDay(props) {
        if (this.props.renderDay)
            return this.props.renderDay(props)
        const {duration, view} = this.props
        return (
            <div style={defaultStyle.container}>
                <div style={defaultStyle.dateContainer}>
                    { moment(props.date).format('dddd DD MMMM YYYY') }
                </div>
                <div style={defaultStyle.eventsContainer}>
                    {
                        [...props.events].sort(sortDate)
                            .map((p, i) => (
                                <TimeEvent {...p.props}
                                           duration={duration}
                                           view={view}
                                           index={i} />
                            ))
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
            const d = moment(monday).add(i, 'd')
            days.push(
                <Day {...{date: new Date(d), events: getToday(events, d)}}
                     key={`${moment(d).format('DD MM YYYY')}-${i}`}/>
            )
            days.push(<hr key={`hrWeek-${i}`}/>)
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