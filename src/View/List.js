/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import {AbstractView} from './index'
import moment from 'moment'
import {getToday, sortDate} from '../util'
import {DefaultDay, DefaultListEvent, defaultStyleList} from '../styles'
import {TimeEvent, VIEW} from '../api'
import type {ViewProps} from './index'

const defaultStyle = defaultStyleList;

export class List extends AbstractView {
    static defaultProps = {
        ...AbstractView.defaultProps,
        renderDay: (props: ViewProps): React.Node => {
            const {duration, view} = props
            return (
                <div style={defaultStyle.container}>
                    <div style={defaultStyle.dateContainer}>
                        {moment(props.date).format('dddd DD MMMM YYYY')}
                    </div>
                    <div style={defaultStyle.eventsContainer}>
                        {
                            [...props.events].sort(sortDate)
                                .map((p, i) => (
                                    <TimeEvent {...p.props}
                                               duration={duration}
                                               view={view}
                                               index={i}/>
                                ))
                        }
                    </div>
                </div>
            )
        },
    }
   /*     renderWeek: (props: ViewProps): React.Node => {
            const monday = Parent.getMonday(props.date)
            let days = []
            for (let i = 0; i < 7; i++) {
                const Day = props.renderDay.bind(this)
                const d = moment(monday).add(i, 'd')
                days.push(
                    <Day {...{
                        date: new Date(d),
                        events: getToday(props.events, d)
                    }} key={`${moment(d).format('DD MM YYYY')}-${i}`}/>
                )
                days.push(<hr key={`hrWeek-${i}`}/>)
            }
            return (
                <div style={defaultStyle.weekContainer}>
                    {days}
                </div>
            )
        },
        renderMonth: (props: ViewProps): React.Node => {
            const {date, events} = props;
            const first = Parent.getFirstDayOfTheMonth(date)
            const last = Parent.getLastDayOfTheMonth(date)
            let days = []
            for (let i = 0; i <= last.getDate() - first.getDate(); i++) {
                const Day = props.renderDay.bind(this)
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
    }
    */
}