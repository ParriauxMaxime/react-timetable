import moment from 'moment/moment'
import {ClassEvent} from '../../src/ClassEvent'

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