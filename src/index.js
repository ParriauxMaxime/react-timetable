import React, {Component} from 'react'
import {Pagination} from './Pagination'
import {List} from './View/List'
import {Table} from './View/Table'
import moment from 'moment'
import {DURATION, VIEW} from './api'


export class TimeTable extends Component {
    constructor(props) {
        super(props)
        const today = new Date()
        const view = props.view || VIEW.list
        const duration = props.duration || DURATION.day
        const date = props.date || today
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
                        return new Date(moment(date).add(1, 'd'));
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

export default TimeTable