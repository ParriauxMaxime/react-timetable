import type {ITimeEvent} from '../../../src/ITimeEvent'
import {TimeEvent} from '../../../src/TimeEvent'

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