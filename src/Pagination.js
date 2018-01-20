/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 17:53
 ** Pagination.js
 ** 2017 - All rights reserved
 ***************************************/

import React from 'react'
import {DURATION, VIEW} from './index'
import {Table} from './View/Table'
import {List} from './View/List'
const notImplemented = () => console.warn('onNavigationEvent props is not implemented')

export class Pagination extends React.Component {
    constructor(props) {
        super(props)
        this.onNavigationEvent = props.onNavigationEvent || notImplemented;
        this.onChange = props.onChange || notImplemented;
    }

    goBack(event) {
        this.onNavigationEvent({type: 'navigation', value: 'back', event})
    }

    goNext(event) {
        this.onNavigationEvent({type: 'navigation', value: 'next', event})
    }

    onChangeView(event) {
        this.onChange({type: 'view', value: event.target.value, event})
    }

    onChangeDuration(event) {
        this.onChange({type: 'duration', value: event.target.value, event})
    }

    render() {
        const selectMapping = v => <option key={v}>{v}</option>;
        return (
            <div>
                <button onClick={this.goBack.bind(this)}>
                    {'<<'}
                </button>
                <select onChange={this.onChangeView.bind(this)}
                        value={this.props.view}>
                    {
                        Object.values(VIEW).map(selectMapping)
                    }
                </select>
                <select onChange={this.onChangeDuration.bind(this)}
                        value={this.props.duration}>
                    {
                        Object.values(DURATION).map(selectMapping)
                    }
                </select>
                <button onClick={this.goNext.bind(this)}>
                    {'>>'}
                </button>
            </div>
        )
    }
}

