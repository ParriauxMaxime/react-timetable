import React, {Component} from 'react'
import {render} from 'react-dom'
import {TimeTable} from '../../src'
import {eventsCreator} from './eventsCreator'

const events = eventsCreator()

class Demo extends Component{
    render() {
        return (
            <div style={{position: 'relative'}}>
                <h1>
                    {'react-timetable Demo'}
                </h1>
                <TimeTable events={events}
                           duration={'day'}
                           view={'table'}
                           duration={"week"}
                           date={new Date()}/>
            </div>
        )
    }
}

render(<Demo/>, document.querySelector('#demo'))
