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
import type {ITimeEvent, TimeEvent} from '../api'


type IListTimeEvent = Array<TimeEvent<ITimeEvent>>

export type ViewProps = {
    date: Date,
    duration: string,
    events: IListTimeEvent,
  /*defaultStyle?: Object,
    dateFormat?: string,*/
}

export type NullableComponent = React.Node

type Props = ViewProps & {
    events: IListTimeEvent,
    renderDay:(props: ViewProps) => NullableComponent,
    renderWeek:(props: ViewProps) => NullableComponent,
    renderMonth: (props: ViewProps) => NullableComponent,
}


export class AbstractView extends React.Component<Props> {
    static defaultProps = {
        date: new Date(),
        events: [],
        duration: DURATION.day,
    }

    static getDaily(props: ViewProps) : IListTimeEvent {
        return getToday(props.events, props.date)
    }

    static getWeekly(props: ViewProps) : IListTimeEvent {
        return getWeek(props.events, props.date)
    }

    static getMonthly(props: ViewProps) : IListTimeEvent {
        return getMonth(props.events, props.date)
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

    isColliding(a: TimeEvent<ITimeEvent>, b: TimeEvent<ITimeEvent>) : boolean {
        return (a.start < b.end && a.end > b.start)
    }

    getCollisions(event: TimeEvent<ITimeEvent>, events: IListTimeEvent) : IListTimeEvent {
        return events.filter((e) => {
            return this.isColliding(e, event)
        })
    }

    static getEvents(props: ViewProps) : IListTimeEvent {
        switch (props.duration) {
            case DURATION.month:
                return AbstractView.getMonthly(props)
            case DURATION.week:
                return AbstractView.getWeekly(props)
            case DURATION.day:
                return AbstractView.getDaily(props)
            default:
                return []
        }
    }

    static staticRender(props: Props) : React.Node {
        const events = AbstractView.getEvents(props);
        const p: ViewProps = ({
            date    : (props.date : Date) ,
            duration: (props.duration: string),
            events  : (events: IListTimeEvent)
        }: ViewProps);
        switch (props.duration) {
            case DURATION.day: {
                return props.renderDay(p)
            }
            case DURATION.week: {
                return props.renderWeek(p)
            }
            case DURATION.month: {
                return props.renderMonth(p)
            }
            default:
                return null
        }
    }

    render() {
        return AbstractView.staticRender(this.props)
    }
}