// @flow

import * as React from 'react'
import {Pagination as PaginationDefault} from './Pagination'
import {List} from './View/List'
import {Table} from './View/Table'
import moment from 'moment'
import {DURATION, VIEW} from './util/api'
import type {IListTimeEvent, ViewProps} from './View'
import {AbstractView} from './View'
import {TimeEvent} from './Event/TimeEvent'


type Map = { name: string, View: AbstractView }
type ViewMap = Array<Map>

type Props = ViewProps & {
    view: string,
    viewMap: ViewMap,
    onNavigationEvent(Event: any): null,
    onChange(Event: any): null,
    viewLifeCycle?: Object,
    pagination: { component: any, props: any},
    className?: string
}

type State = {
    date: Date,
    view: string,
    duration: string,
};

class TimeTable extends React.Component<Props, State> {
    static defaultProps = {
        date        : new Date(),
        duration    : DURATION.week,
        events      : [],
        view        : VIEW.table,
        pagination : {
            component: PaginationDefault,
            props: {}
        },
        viewMap     : [{
            name: VIEW.list,
            View: List
        }, {
            name: VIEW.table,
            View: Table
        }],
        timeStart   : 8,
        timeEnd     : 20,
        timeDivision: 4
    }

    state: State

    constructor(props: Props) {
        super(props)
        const {view, duration, date} = this.props
        this.viewLifeCycle = this.props.viewLifeCycle || null
        this.state = {
            progress: false,
            view,
            duration,
            date
        }
    }



    onNavigationEvent(Event: any) {
        const {duration, date} = this.state
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
                    return new Date(moment(date).add(increment, 'M'))
                }
                default:
                    return date
            }
        }
        this.setState({date: newDate(duration, date)})
    }

    onChange(Event: any) {
        this.setState({[Event.type]: Event.value})
    }

    renderView(): ?AbstractView {
        const {view} = this.state
        const views = (this.props.viewMap: ViewMap)
            .filter((e: Map) => e.name === view)
            .map((e: Map) => e.View)
        if (views.length > 0) {
            return views[0]
        }
        return null
    }


    render() {
        const paginationProps = {...{
            onNavigationEvent: this.onNavigationEvent.bind(this),
                onChange         : this.onChange.bind(this),
                duration         : this.state.duration,
                date             : this.state.date,
                view             : this.state.view,
                viewMap          : this.props.viewMap,
                className        : this.props.className || ''
        }, ...this.props.pagination.props}
        const {timeStart, timeEnd, timeDivision} = this.props
        const props = ({
            duration: this.state.duration,
            events  : (this.props.events: IListTimeEvent),
            date    : this.state.date,
            timeStart,
            timeDivision,
            timeEnd
        }: ViewProps)
        const View: ?AbstractView = this.renderView()
        const Pagination = this.props.pagination.component
        return (
            <React.Fragment>
                <Pagination {...paginationProps} />
                <hr/>
                {
                    // $FlowFixMe: Flow should implement better comprenhension on abstract structure
                    <View {...{...props, lifeCycle: this.viewLifeCycle}} />
                }
            </React.Fragment>
        )
    }
}

export {
    TimeEvent,
    AbstractView,
    List,
    Table,
    TimeTable,
    DURATION,
    VIEW,
    PaginationDefault
}

