/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import type {ITimeEvent, TimeEvent} from '../api'
import {DURATION} from '../api'
import {getMonth, getToday, getWeek} from '../util'


export type IListTimeEvent = Array<TimeEvent<ITimeEvent>>

export type ViewProps = {
    date: Date,
    duration: string,
    events: IListTimeEvent,
}

export type NullableComponent = React.Node

type Props = ViewProps

export interface IView {
    renderDay: (props: ViewProps) => NullableComponent,
    renderWeek: (props: ViewProps) => NullableComponent,
    renderMonth: (props: ViewProps) => NullableComponent,
}


export class AbstractView extends React.Component<Props> implements IView {
    static defaultProps = {
        date    : new Date(),
        events  : [],
        duration: DURATION.day,
    }

    __IsNotImplemented(name) {
        console.log();
        throw new Error([
        `render${name} is not implemented on ${this.constructor.displayName}.
        You're actually trying to call a non implemented function on an Abstract component.
        You should extends the existing AbstractView component and implement render${name}.`
        ])
    }

    renderDay() {
        this.__IsNotImplemented('Day')
        return null
    }

    renderWeek() {
        this.__IsNotImplemented('Week')
        return null
    }

    renderMonth() {
        this.__IsNotImplemented('Month')
        return null
    }

    static getDaily(props: ViewProps): IListTimeEvent {
        return getToday(props.events, props.date)
    }

    static getWeekly(props: ViewProps): IListTimeEvent {
        return getWeek(props.events, props.date)
    }

    static getMonthly(props: ViewProps): IListTimeEvent {
        return getMonth(props.events, props.date)
    }

    isColliding(a: TimeEvent<ITimeEvent>, b: TimeEvent<ITimeEvent>): boolean {
        return (a.start < b.end && a.end > b.start)
    }

    getCollisions(event: TimeEvent<ITimeEvent>, events: IListTimeEvent): IListTimeEvent {
        return events.filter((e) => {
            return this.isColliding(e, event)
        })
    }

    static getEvents(props: ViewProps): IListTimeEvent {
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

    staticRender(): React.Node {
        const events = AbstractView.getEvents(this.props)
        const p: ViewProps = ({
            date    : (this.props.date: Date),
            duration: (this.props.duration: string),
            events  : (events: IListTimeEvent)
        }: ViewProps)
        switch (this.props.duration) {
            case DURATION.day: {
                return this.renderDay(p)
            }
            case DURATION.week: {
                return this.props.renderWeek(p)
            }
            case DURATION.month: {
                return this.props.renderMonth(p)
            }
            default:
                return null
        }
    }

    render() {
        return this.staticRender()
    }
}