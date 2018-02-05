import {defaultStyleList} from '../styles'
import type {ITimeEvent, Renderable} from './ITimeEvent'
import moment from 'moment'

const Style = {
    list: defaultStyleList
}

export class TimeEvent<T: ITimeEvent> implements Renderable {
    static instanceCount = 0
    creator: string = ''
    title: string = ''
    start: Date
    end: Date
    collisions: Array<TimeEvent<T>> = []
    _id: string = ''
    index: number = TimeEvent.instanceCount

    constructor(props: T) {
        const propsArray: Array<Object> = Object.keys(props)
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

    renderList = <T>(i: number): React.Node => {
        const c = i
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

    renderTable = <T>(defaultStyle): React.Node => {
        const style = {
            position       : 'absolute',
            backgroundColor: 'rgba(50,50,200,0.9)',
            color          : 'white',
            border         : '1px solid rgba(0, 0, 0, 0.3)',
            boxSizing      : 'border-box',
        }

        return (
            <div key={`event-${this.getKey()}`}
                 style={{...defaultStyle, ...style}}>
                <div>
                    {this.title}
                </div>
            </div>
        )
    }
}