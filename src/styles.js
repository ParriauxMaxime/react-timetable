import moment from 'moment/moment'
import React from 'react'
import {sortDate} from './util'
import {TimeEvent} from './api'

/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/26/18 - 01:30
 ** styles.js
 ** 2017 - All rights reserved
 ***************************************/

const flexP = {
    display: 'flex',
    padding: '0 10px'
}

const minWidth = 32;

export const defaultStyleList = {
    container      : {
        ...flexP,
        flexDirection: 'row',
        margin       : '4px 0',
        padding      : '8px',
    },
    dateContainer  : {
        ...flexP,
        minWidth: 200,
        width   : '20%',
    },
    eventsContainer: {
        ...flexP,
        flexDirection: ' column',
        minWidth     : 400,
        width        : '60%',
    },
    eventContainer : (i) => ({
        display        : 'flex',
        backgroundColor: !(i % 2) ? 'rgba(10, 10, 10, 0.2)' : 'transparent',
        justifyContent : 'flex-start'
    }),
    hourLimit      : {
        minWidth,
        marginRight: 4,
    },
    creator        : {
        minWidth
    },
    title          : {
        minWidth,
        fontWeight: 'bold',
    },
    weekContainer  : {},
    monthContainer : {}
}

export const defaultStyleTable = {
    border    : (color = 'black') => ({border: `${color} 1px solid`}),
    flex      : {display: 'flex'},
    flexR     : {display: 'flex', flexDirection: 'row'},
    flexC     : {display: 'flex', flexDirection: 'column'},
    flexCenter: {display: 'flex', justifyContent: 'center'},
    padding   : (v = '8px') => ({padding: v}),
    height    : (v = '100%') => ({height: v}),
    width     : (v = '100%') => ({width: v}),
}

let defaultStyle = defaultStyleList;



interface IListTimeEvent {
    [index: number]: ITimeEvent
}

interface DayProps {
    date: Date,
    events: IListTimeEvent,
    defaultStyle: ?Object,
    dateFormat: ?string,
}



export class DefaultDay extends React.Component {
    constructor(props: DayProps) {
        super(props);
    }

    render() {
        console.log(this.props.events)

    }

}
