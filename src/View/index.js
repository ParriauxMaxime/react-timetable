/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import {DURATION} from '../api'
import {getMonth, getToday, getWeek} from '../util'
import moment from 'moment'
import type {ITimeEvent} from '../api'


type IListTimeEvent = Array<ITimeEvent>

export type ViewProps = {
    date: Date,
    duration: string,
    events: IListTimeEvent,
  /*defaultStyle?: Object,
    dateFormat?: string,*/
}

type Props = ViewProps & {
    events: IListTimeEvent,
    renderDay(props: ViewProps): React.Node,
    renderWeek(props: ViewProps): React.Node,
    renderMonth(props: ViewProps): React.Node,
}


export class AbstractView extends React.Component<Props> {
    static defaultProps = {
        date: new Date(),
        events: [],
        duration: DURATION.day,
        renderDay: (props: ViewProps) => null,
        renderWeek: (props: ViewProps) => null,
        renderMonth: (props: ViewProps) => null,
    }

    getDaily(events: IListTimeEvent) : IListTimeEvent {
        return getToday(events, this.props.date)
    }

    getWeekly(events: IListTimeEvent) : IListTimeEvent {
        return getWeek(events, this.props.date)
    }

    getMonthly(events: IListTimeEvent) : IListTimeEvent {
        return getMonth(events, this.props.date)
    }

    static getMonday(d: Date) : Date {
        const day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(new Date(d).setDate(diff))
    }

    getSunday(d: Date) : Date {
        const day = d.getDay(),
            diff = d.getDate() + (7 - day)
        return new Date(new Date(d).setDate(diff))
    }

    static getFirstDayOfTheMonth(d: Date) : Date {
        const date = d.getDate(),
            diff = (d.getDate() - date) + 1
        return new Date(new Date(d).setDate(diff))
    }

    static getLastDayOfTheMonth(d: Date) : Date {
        const date = d.getDate(),
            diff = (d.getDate() - date) + 1,
            next_month = d.getMonth() + 1,
            first = new Date(new Date(d).setDate(diff)),
            firstNextMonth = new Date(first.setMonth(next_month))
        return new Date(firstNextMonth.setDate(firstNextMonth.getDate() - 1))
    }

    isColliding(a: ITimeEvent, b: ITimeEvent) : boolean {
        return (a.start < b.end && a.end > b.start)
    }

    getCollisions(event: ITimeEvent, events: IListTimeEvent) : IListTimeEvent {
        return events.filter((e) => {
            return this.isColliding(e, event)
        })
    }

    getEvents({events, duration, date}: Props) : ?IListTimeEvent {
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
        console.log(moment(this.props.date).format())
        const events = this.getEvents(this.props)
        const Day = this.props.renderDay(this.props)
        const Week = this.props.renderWeek(this.props)
        const Month = this.props.renderMonth(this.props)
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