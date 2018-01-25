import React, {Component} from 'react'
import {Pagination} from './Pagination'
import {List} from './View/List'
import {Table} from './View/Table'

export const VIEW = {
    list : 'list',
    table: 'table'
}

export const DURATION = {
    day  : 'day',
    week : 'week',
    month: 'month'
}

export const EVENT_TYPE = {
    class         : 'class',
    meeting       : 'meeting',
    administration: 'administration',
}

export default class extends Component {
    constructor(props) {
        super(props)
        const today = new Date()
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        const YYesterday = new Date(new Date().setDate(new Date().getDate() - 2))
        const tomorrow = new Date().setDate(today.getDate() + 1)
        const view = props.view || VIEW.table
        const duration = props.duration || DURATION.day
        const date = props.date || YYesterday
        this.state = {
            view,
            duration,
            date
        }
    }

    onNavigationEvent(Event) {
        const {duration, date} = this.state
        if (this.props.onNavigationEvent) {
            this.props.onNavigationEvent({event: Event, duration, date})
        }
        else {
            const increment = Event.value === 'next' ? 1 : - 1
            const newDate = (duration, date) => {
                switch (duration) {
                    case DURATION.day: {
                        return new Date(new Date(date).setDate(date.getDate() + increment))
                    }
                    case DURATION.week: {
                        return new Date(new Date(date).setDate(date.getDate() + (increment * 7)))
                    }
                    case DURATION.month: {
                        return new Date(new Date(date).setMonth(date.getMonth() + increment))
                    }
                    default: return date;
                }
            }
            this.setState({date: newDate(duration, date)})
        }
    }

    onChange(Event) {
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
