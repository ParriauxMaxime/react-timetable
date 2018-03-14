/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:58
 ** List.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import type {TimeEvent} from '../Event/TimeEvent'
import moment from 'moment'
import {DURATION} from '../util/api'
import {getMonth, getToday, getWeek} from '../util/util'
import type {ITimeEvent} from '../Event/ITimeEvent'

export type IListTimeEvent = Array<TimeEvent<ITimeEvent>>

export type ViewProps = {
    date: Date,
    duration: string,
    events: IListTimeEvent,
    timeStart: number,
    timeEnd: number,
    timeDivision: number,
}

export interface IView {
    renderDay(props: ViewProps): React.Node,
    renderWeek(props: ViewProps): React.Node,
    renderMonth(props: ViewProps):React.Node,
}

//TODO : Implement progress

export class AbstractView extends React.Component<ViewProps> implements IView {
    static defaultProps = {
        date    : new Date(),
        events  : [],
        duration: DURATION.day,
    }

    constructor(props: ViewProps) {
        super(props);
        const {lifeCycle} = this.props
        if (lifeCycle) {
            this.lifeCycle = lifeCycle
        }
    }

    __IsNotImplemented(name: string): React.Node {
        const n : string = this.constructor.displayName || '';
        throw new Error([
        `render${name} is not implemented on ${n}.
        You're actually trying to call a non implemented function on an Abstract component.
        You should extends the existing AbstractView component and implement render${name}.`
        ]);
    }

    renderDay(props: ViewProps): React.Node {
        this.__IsNotImplemented('Day')
        return <div>Failed</div>
    }

    renderWeek(props: ViewProps): React.Node {
        this.__IsNotImplemented('Week')
        return <div>Failed</div>
    }

    renderMonth(props: ViewProps): React.Node {
        this.__IsNotImplemented('Month')
        return <div>Failed</div>
    }

    static getMonday(d: Date) : Date {
        const day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(new Date(d).setDate(diff))
    }

    static getSunday(d: Date) : Date {
        const day = d.getDay(),
            diff = d.getDate() + (day === 0 ? 0 : 7 - day)
        return new Date(new Date(d).setDate(diff))
    }

    static getToday(events: IListTimeEvent, d: Date) : IListTimeEvent {
        const format = 'DD MM YYYY'
        const v = moment(d).format(format)
        return events.filter(e => moment(e.start).format(format) === v ||
            moment(e.end).format(format) === v)
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

    static isColliding(a: TimeEvent<ITimeEvent>, b: TimeEvent<ITimeEvent>): boolean {
        return (a.start < b.end && a.end > b.start)
    }

    static getCollisions(event: TimeEvent<ITimeEvent>, events: IListTimeEvent): IListTimeEvent {
        return events.filter((e) => {
            return AbstractView.isColliding(e, event)
        })
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

    render(): React.Node {
        const events = AbstractView.getEvents(this.props)
        const p: ViewProps = ({
            ...this.props,
            date    : (this.props.date: Date),
            duration: (this.props.duration: string),
            events  : (events: IListTimeEvent)
        }: ViewProps)
        switch (this.props.duration) {
            case DURATION.day: {
                return this.renderDay(p)
            }
            case DURATION.week: {
                return this.renderWeek(p)
            }
            case DURATION.month: {
                return this.renderMonth(p)
            }
            default:
                return null
        }
    }
}