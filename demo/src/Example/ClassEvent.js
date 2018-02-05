import {defaultStyleList} from '../../../src/styles'
import {TimeEvent} from '../../../src/Event/TimeEvent'
import * as React from 'react'
import moment from 'moment/moment'
import type {ITimeEvent} from '../../../src/Event/ITimeEvent'

const Style = {
    list: defaultStyleList
}

type IClassEvent = ITimeEvent & {
    module: string,
    place?: any,
}

export class ClassEvent extends TimeEvent<IClassEvent> {
    constructor(props: IClassEvent) {
        super(props)
    }

    renderList = <T>(i: number): React.Node => {
        const format = 'HH:mm'
        const {start, end, creator, module} = this
        const [s, e] = [moment(start).format(format), moment(end).format(format)]
        return (
            <div key={this.getKey()}
                 style={Style.list.eventContainer(i)}>
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
                    {this.module}
                </div>
            </div>
        )
    }
}