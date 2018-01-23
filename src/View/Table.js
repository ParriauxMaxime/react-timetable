/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/19/18 - 19:59
 ** Table.js
 ** 2017 - All rights reserved
 ***************************************/

import Parent from './index'
import React from 'react'
import moment from 'moment'

const style = {
    border    : (color = 'black') => ({border: `${color} 1px solid`}),
    flex      : {display: 'flex'},
    flexR     : {display: 'flex', flexDirection: 'row'},
    flexC     : {display: 'flex', flexDirection: 'column'},
    flexCenter: {display: 'flex', justifyContent: 'center'},
    padding   : (v = '8px') => ({padding: v}),
    height    : (v = '100%') => ({height: v}),
    width     : (v = '100%') => ({width: v}),
}

const HOUR_COLUMNS_WIDTH = 60
const HCW = HOUR_COLUMNS_WIDTH

export class Table extends Parent {
    constructor(props) {
        super(props)
        this.timeStart = props.timeStart || 8
        this.timeEnd = props.timeStart || 20
        this.timeDivision = props.timeDivision || 4
    }

    renderHours(e, i) {
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
        return <div key={`h-${i}`} style={{
            minWidth    : HCW,
            boxSizing   : 'border-box',
            borderRight : '1px' +
            ' solid black', ...style.flexCenter,
            borderBottom: `1px rgba(10, 10, 10, 0.3) ${e.minute === lastOne ? 'solid' : 'none'}`
        }}>
            {e.minute === 0 ? moment(Date.now()).hours(e.hour).minutes(0).format('HH:mm') : ''}
            &nbsp;
        </div>
    }

    renderColumn(e, i) {
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
        return (
            <div key={`c-${i}`}
                 style={{
                     ...style.width('100%'),
                     minHeight   : 18,
                     ...style.flexR,
                     borderBottom: `1px rgba(10, 10, 10, 0.3) ${e.minute === lastOne ? 'solid' : 'none'}`
                 }}>
                <div style={{
                    ...style.width('100%'),
                    borderBottom: `1px black ${e.minute === lastOne ? 'solid' : 'dashed'}`
                }}>
                </div>
            </div>
        )
    }

    _hoursArray() {
        let hours = []
        for (let i = 0; i <= ((this.timeEnd - this.timeStart) * this.timeDivision) + this.timeDivision - 1; i++) {
            hours.push({
                hour  : this.timeStart + Math.floor(i / this.timeDivision),
                minute: Math.floor(60 / this.timeDivision) * (i % this.timeDivision)
            })
        }
        return hours
    }


    renderDay({date, events, index = 0, independent = true}) {
        const hoursArray = this._hoursArray()
        return (
            <div style={independent ? {...style.border(), ...style.padding()} : {width: '100%'}}>
                <div role="header" style={style.flexCenter}>
                    {moment(date).format('dddd DD/MM')}
                </div>
                <hr/>
                <div role="content"
                     style={{...style.flexCenter, ...style.border(), ...style.flexC, ...style.padding('0')}}>
                    {
                        hoursArray.map((e, i) => {
                            return (
                                <div key={`k-${i}`} style={{...style.flexR}}>
                                    {independent ? this.renderHours(e, i) : null}
                                    {this.renderColumn(e, i)}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    renderWeek({date, events}) {
        const monday = this.getMonday(date)
        let days = []
        days.push(
            <div style={{minWidth: HCW}}>
                <div role="header" style={style.flexCenter}>
                    &nbsp;
                </div>
                <hr/>
                <div role="content"
                     style={{...style.flexCenter, ...style.border(), ...style.flexC, ...style.padding('0')}}>
                    {this._hoursArray().map(this.renderHours.bind(this))}
                </div>
            </div>
        )
        for (let i = 0; i < 7; i++) {
            const d = new Date(new Date(monday).setDate(monday.getDate() + i))
            const Day = this.renderDay.bind(this)
            days.push(<Day date={d} events={events} index={i} independent={false}/>)
        }
        const lastOne = (60 / this.timeDivision * (this.timeDivision - 1))
        const hoursArray = this._hoursArray()
        return (
            <div style={{...style.border(), ...style.padding()}}>
                <div role="content"
                     style={{...style.flexCenter, ...style.border(), ...style.flexR, ...style.padding('0')}}>
                    {
                        days
                    }
                </div>
            </div>
        )
    }

    renderMonth({date, events}) {
        return null
    }

    render() {
        return super.render()
    }
}