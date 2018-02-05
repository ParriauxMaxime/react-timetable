// @flow

import * as React from 'react'
import {Pagination} from './Pagination'
import {List} from './View/List'
import {Table} from './View/Table'
import moment from 'moment'
import {DURATION, VIEW} from './api'
import type {IListTimeEvent, IView, ViewProps} from './View'
import {AbstractView} from './View'


type Map = { name: string, View: AbstractView }
type ViewMap = Array<Map>

type Props = ViewProps & {
    view: string,
    viewMap: ViewMap,
    timeStart: number,
    timeEnd: number,
    timeDivision: number,
    onNavigationEvent(Event: any): null,
    onChange(Event: any): null,
}

type State = {
    date: Date,
    view: string,
    duration: string,
};

export class TimeTable extends React.Component<Props, State> {
    static defaultProps = {
        date    : new Date(),
        duration: DURATION.month,
        events  : [],
        view    : VIEW.list,
        viewMap : [{
            name: VIEW.list,
            View: List
        }, {
            name: VIEW.table,
            View: Table
        }],
        timeStart: 8,
        timeEnd: 20,
        timeDivision: 4
    }

    state: State

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
        this.setState({[Event.type]: Event.value}, () => {
            console.log('Register new state', {[Event.type]: Event.value})
        })
    }

    renderView(): ?AbstractView {
        const {view} = this.state
        const views = (this.props.viewMap: ViewMap)
            .filter((e: Map) => e.name === view)
            .map((e: Map) => e.View);
        console.log(views);
        if (views.length > 0) {
            return views[0]
        }
        return null
    }


    render() {
        const {timeStart, timeEnd, timeDivision} = this.props
        const props = ({
            duration: this.state.duration,
            events  : (this.props.events: IListTimeEvent),
            date    : this.state.date,
            timeStart,
            timeDivision,
            timeEnd
        }: ViewProps)
        const View : ?AbstractView = this.renderView();
        return (
            <React.Fragment>
                <Pagination {...{
                    onNavigationEvent: this.onNavigationEvent.bind(this),
                    onChange         : this.onChange.bind(this),
                    duration         : this.state.duration,
                    date             : this.state.date,
                    view             : this.state.view,
                    viewMap          : this.props.viewMap
                }}/>
                <hr/>
                {
                    // $FlowFixMe: Flow should implement better comprenhension on abstract structure
                        <View {...props}/>
                }
            </React.Fragment>
        )
    }
}
