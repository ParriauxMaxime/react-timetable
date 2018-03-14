/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import type {ViewProps} from './index'
import {AbstractView} from './index'
import moment from 'moment'
import {sortDate} from '../util/util'
import {DefaultDay, DefaultListEvent, defaultStyleList} from '../styles'
import type {ITimeEvent} from '../Event/ITimeEvent'
import {VIEW} from '../util/api'
import {TimeEvent} from '../Event/TimeEvent'

const defaultStyle = defaultStyleList

//TODO : Remove useless day

export class List extends AbstractView {
    static view = VIEW.list

    renderDay(props: ViewProps): React.Node {
        return (
            <div style={defaultStyle.container}>
                <div style={defaultStyle.dateContainer}>
                    {moment(props.date).format('dddd DD MMMM')}
                </div>
                <div style={defaultStyle.eventsContainer}>
                    {
                        [...props.events].sort(sortDate)

                            .map((p: TimeEvent<ITimeEvent>, i: number) => {
                                return p.renderList(i)
                            })
                    }
                </div>
            </div>
        )
    }

    renderWeek(props: ViewProps): React.Node {
        const monday = AbstractView.getMonday(props.date)
        let days = []
        for (let i = 0; i < 7; i++) {
            const Day = this.renderDay.bind(this)
            const d = moment(monday).add(i, 'd')
            days.push(
                <Day {...{
                    date  : new Date(d),
                    events: AbstractView.getToday(props.events, d)
                }} key={`${moment(d).format('DD MM YYYY')}-${i}`}/>
            )
            days.push(<hr key={`hrWeek-${i}`}/>)
        }

        return (

            <div style={defaultStyle.weekContainer}>
                {days}
            </div>
        )
    }

    renderMonth(props: ViewProps): React.Node {
        const {date, events} = props
        const first = AbstractView.getFirstDayOfTheMonth(date)
        const last = AbstractView.getLastDayOfTheMonth(date)
        let days = []
        for (let i = 0; i <= last.getDate() - first.getDate(); i++) {
            const Day = this.renderDay.bind(this)
            const d = new Date(new Date(first).setDate(first.getDate() + i))
            days.push(
                <Day {...{date: d, events: AbstractView.getToday(events, d)}}
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
}
