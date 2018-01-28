// @flow

import * as React from 'react'
import {Pagination} from './Pagination'
import {List} from './View/List'
import {Table} from './View/Table'
import moment from 'moment'
import {DURATION, VIEW} from './api'
import type {ITimeEvent} from './api'


type State = {
    date: Date,
    view: string,
    duration: string,
};

type Props = State & {
    events: Array<ITimeEvent>,
    onNavigationEvent(Event): null,
    onChange(Event): null,
}

export class TimeTable extends React.Component<Props, State> {
    static defaultProps = {
        date    : new Date(),
        view    : VIEW.list,
        duration: DURATION.day,
        events: [],
    }

    constructor(props: Props) {
        super(props)
        const {view, duration, date} = this.props
        this.state = {
            view,
            duration,
            date
        }
    }

    onNavigationEvent(Event: any) {
        const {duration, date} = this.state
      /*  if (this.props.onNavigationEvent) {
            this.props.onNavigationEvent({event: Event, duration, date})
        }
        else {*/
            const increment = Event.value === 'next' ? 1 : -1
            const newDate = (duration, date) => {
                switch (duration) {
                    case DURATION.day: {
                        return new Date(moment(date).add(increment, 'd'))
                    }
                    case DURATION.week: {
                        return new Date(moment(date).add(increment * 7, 'd'))
                    }
                    case DURATION.month: {
                        return new Date(moment(date).add(increment, 'm'))
                    }
                    default:
                        return date
                }
            }
            this.setState({date: newDate(duration, date)})
        //}
    }

    onChange(Event: any) {
        this.setState({[Event.type]: Event.value}, () => {
            console.log('Register new state', {[Event.type]: Event.value})
        })
    }


    render() {
        const events = this.props.events
        const Body = (p) => {
            const props = {
                duration: this.state.duration,
                events,
                date    : this.state.date,
                ...p
            }
            switch (this.state.view) {
                case VIEW.list:
                    return <List {...props}/>
                case VIEW.table:
                    return <Table {...props}/>
                default:
                    return null
            }
        }
        return (
            <div>
                <Pagination {...{
                    onNavigationEvent: this.onNavigationEvent.bind(this),
                    onChange         : this.onChange.bind(this),
                    duration         : this.state.duration,
                    date             : this.state.date,
                    view             : this.state.view,
                }}/>
                <hr/>
                <Body/>
            </div>
        )
    }
}

export default TimeTable