import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

export class TimeEvent {
    static requiredProps = ['start', 'end', 'creator'];

    constructor(props) {
        const p = this._initCheck(props, TimeEvent.requiredProps)
        Object.assign(this, ...p)
    }

    _initCheck(props, requiredProps) {
        const checkEventError = (props, e) => new Error({
            function: 'TimeEvent._initCheck',
            package : 'react-timetable',
            text    : `No ${e} value in event: ${e}`
        })
        requiredProps.forEach(e => {
            if (Object.keys(props).indexOf(e) === -1) throw checkEventError(props, e)
        })
        return {
            description: '',
            title: '',
            place: null,
            participants: [],
            creationDate: new Date(),
            ...props,
        }
    }

}

export class ClassEvent extends TimeEvent {
    static requiredProps = ['place', 'module']
    constructor(props) {
        super(props)
        const p = super._initCheck(props, ClassEvent.requiredProps)
        Object.assign(this, ...p);
    }
}

export class MeetingEvent extends TimeEvent {
    static requiredProps = ['participants', 'place']
    constructor(props) {
        super(props)
        const p = super._initCheck(props, MeetingEvent.requiredProps)
        Object.assign(this, ...p);
    }
}

export class AdministrationEvent extends TimeEvent {
    static requiredProps = ['place', 'participants']
    constructor(props) {
        super(props)
        const p = super._initCheck(props, AdministrationEvent.requiredProps)
        Object.assign(this, ...p);
    }
}


const eventsCreator = () => {
    const today = new Date()
    const twoMonthAgo = new Date(new Date(today).setMonth(today.getMonth() - 2));
    const twoMonthAfter = new Date(new Date(today).setMonth(today.getMonth() + 2));
    const creator = 'god';
    let events = [];

    for (let i = twoMonthAgo; i < twoMonthAfter; i = new Date(i.setDate(i.getDate() + 1))) {
        const createStartDate = (date, hours = Math.random()* 12 + 8, minutes = 0) => {
            return new Date(new Date(new Date(date).setHours(hours)).setMinutes(minutes))
        }
        const createEndDate = (date, duration = 60) => {
            return new Date(new Date(date).setMinutes(date.getMinutes() + duration))
        }
        const mathClassCreator = () => {
            const start = createStartDate(i)
            return new ClassEvent({
                start,
                end: createEndDate(start, 90),
                creator,
                place: 'Math classroom',
                module: 'Math 101'
            })
        }
        const physicsClassCreator = () => {
            const start = createStartDate(i)
            return new ClassEvent({
                start,
                end: createEndDate(start, 60),
                creator,
                place: 'Physics classroom',
                module: 'Physics 101'
            })
        }
        const csClassCreator = () => {
            const start = createStartDate(i)
            return new ClassEvent({
                start,
                end: createEndDate(start, 120),
                creator,
                place: 'cs classroom',
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
                events.push(csClassCreator())
                events.push(csClassCreator())
                break
            }
            case 3: { // Wednesday
                break;
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
                break;
            }

        }
    }
    return events
}

const events = eventsCreator()


class Demo extends Component {
    render() {
        return <div>
            <h1>react-timetable Demo</h1>
            <Example events={events}/>
        </div>
    }
}

render(<Demo/>, document.querySelector('#demo'))
