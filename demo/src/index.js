import React, {Component} from 'react'
import {render} from 'react-dom'
import {TimeTable} from '../../src'
import {eventsCreator} from '../../src/api'

const events = eventsCreator()

class Demo extends Component{
    render() {
        return (
            <div>
                <h1>
                    {'react-timetable Demo'}
                </h1>
                <TimeTable events={events} date={new Date(new Date().setDate(new Date().getDate() + 1))}/>
            </div>
        )
    }
}

render(<Demo/>, document.querySelector('#demo'))
