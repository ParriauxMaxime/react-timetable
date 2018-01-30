/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/26/18 - 21:05
 ** api.js
 ** 2017 - All rights reserved
 ***************************************/
// @flow
import * as React from 'react'
import moment from 'moment'
import {defaultStyleList} from './styles'
import {List} from './View/List'
import {Table} from './View/Table'

const Style = {
    list: defaultStyleList
}

export const VIEW = {
    list : 'list',
    table: 'table'
}

export const DURATION = {
    day  : 'day',
    week : 'week',
    month: 'month'
}

export const defaultViewMap = [{
        name: VIEW.list,
        component: List
    }, {
        name: VIEW.table,
        component: Table
    }
]

interface Renderable {
    renderList: () => React.Node
}

export type ITimeEvent = {
    start: Date,
    end: Date,
    creator?: string,
    title?: string,
    _id?: string,
}

export class TimeEvent<T: ITimeEvent> implements Renderable {
    static instanceCount = 0
    creator: string = ''
    title: string = ''
    start: Date
    end: Date
    _id: string = ''
    index: number = TimeEvent.instanceCount
    renderList = <T>() : React.Node => {
        const c = this.index
        const format = 'HH:mm'
        const [s, e] = [moment(this.start).format(format),
            moment(this.end).format(format)]
        return (
            <div key={this.getKey()}
                 style={Style.list.eventContainer(c)}>
                <div role='hour-limit'
                     style={Style.list.hourLimit}>
                    {`${s} - ${e}`}
                </div>
                <div role='creator'
                     style={Style.list.creator}>
                    {this.creator}
                </div>
                <div role='module'
                     style={Style.list.title}>
                    {this.title}
                </div>
            </div>
        )
    }

    constructor(props: T) {
        const propsArray : Array<Object> = Object.keys(props)
            .map(e => ({[e]: props[e]}))
        Object.assign(this, ...propsArray)
        TimeEvent.instanceCount++

    }

    getKey(): string {
        const {_id} = this
        const c = this.index
        return _id ? `event_${c}__${_id}` : `event_${c}`
    }

    isToday(today: Date): boolean {
        const d = moment(today)
        const format = 'DD MM YYYY'
        const {start, end} = this
        return moment(start).format(format) === d.format(format) ||
            moment(end).format(format) === d.format(format)
    }

    static renderTable() {
        return null
    }
}

type IClassEvent =
    ITimeEvent & {
    module: string,
    place?: any,
}

export class ClassEvent extends TimeEvent<IClassEvent> {
    module: string = ''
    renderList = () : React.Node => {
        const c = this.index
        console.log(c, this)
        const format = 'HH:mm'
        const {start, end, creator, module} = this
        const [s, e] = [moment(start).format(format), moment(end).format(format)]
        return (
            <div key={this.getKey()}
                 style={Style.list.eventContainer(c)}>
                <div role='hour-limit'
                     style={Style.list.hourLimit}>
                    {`${s} - ${e}`}
                </div>
                <div role='creator'
                     style={Style.list.creator}>
                    {creator}
                </div>
                <div role='module'
                     style={Style.list.module}>
                    {module}
                </div>
            </div>
        )
    }
}


type IMeetingEvent = ITimeEvent & {
    participants?: Array<any>,
    place?: any,
}

export class MeetingEvent extends TimeEvent<IMeetingEvent> {
}

type IAdministrationEvent = ITimeEvent & {
    participants?: Array<any>,
    place?: any,
}

export class AdministrationEvent extends TimeEvent<IAdministrationEvent> {
}

export const eventsCreator = () => {
    const today = new Date()
    const twoMonthAgo = new Date(new Date(today).setMonth(today.getMonth() - 2))
    const twoMonthAfter = new Date(new Date(today).setMonth(today.getMonth() + 2))
    const creator = 'god'
    let events = []

    for (let i = twoMonthAgo; i < twoMonthAfter; i = new Date(i.setDate(i.getDate() + 1))) {
        const createStartDate = (date, hours = Math.random() * 11 + 8, minutes = 0) => {
            return new Date(new Date(new Date(date).setHours(hours)).setMinutes(minutes))
        }
        const createEndDate = (date, duration = 60) => {
            return new Date(new Date(date).setMinutes(date.getMinutes() + duration))
        }
        const mathClassCreator = (hour) => {
            const start = createStartDate(i)
            const s = hour ? new Date(moment(start).hour(hour)._d) : start
            return new ClassEvent({
                start : s,
                end   : createEndDate(s, 90),
                creator,
                place : 'Math classroom',
                module: 'Math 101'
            })
        }
        const physicsClassCreator = (hour) => {
            const start = createStartDate(i)
            const s = hour ? new Date(moment(start).hour(hour)._d) : start
            return new ClassEvent({
                start : s,
                end   : createEndDate(s, 60),
                creator,
                place : 'Physics classroom',
                module: 'Physics 101'
            })
        }
        const csClassCreator = (hour) => {
            const start = createStartDate(i)
            const s = hour ? new Date(moment(start).hour(hour)._d) : start
            return new ClassEvent({
                start : s,
                end   : createEndDate(s, 120),
                creator,
                place : 'cs classroom',
                module: 'CS 101'
            })
        }
        switch (i.getDay()) {
            case 1: { // Monday
                events.push(mathClassCreator())
                events.push(physicsClassCreator())
                events.push(csClassCreator())
                break
            }
            case 2: { // Tuesday
                events.push(csClassCreator())
                events.push(mathClassCreator())
                events.push(csClassCreator())
                events.push(mathClassCreator())
                events.push(csClassCreator())
                break
            }
            case 3: { // Wednesday
                break
            }
            case 4: { // Thursday
                events.push(mathClassCreator())
                events.push(physicsClassCreator())
                events.push(csClassCreator())
                break
            }
            case 5: { // Friday
                events.push(mathClassCreator())
                events.push(physicsClassCreator())
                events.push(physicsClassCreator())
                events.push(csClassCreator())
                break
            }
            default: {
                break
            }

        }
    }
    return events
}
