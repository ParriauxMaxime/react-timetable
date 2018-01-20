import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

function TimeEvent({creator, start, end, title, description, place, participants}) {
  this.creator = creator;
  this.start = start;
  this.end = end;
  this.title = title;
  this.description = description;
  this.place = place;
  this.participants = participants;
}

const creator = "God";
const title = "";
const description = ""


const start2 = new Date(2018, 0, 20, 21);
const end2 = new Date(2018, 0, 20, 22);

const randomDate = [15, 16, 17, 19, 20, 20, 20, 20, 21, 22].map(e => {
    const randomHour = Math.floor(Math.random() * 23)
  return {start: new Date(2018, 0, e, randomHour), end: new Date(2018, 0, e, randomHour + 1)}
})

const events = randomDate.map((e, i) => new TimeEvent({...e, creator, title: `event number ${i}`, description}))


class Demo extends Component {
  render() {
    return <div>
      <h1>react-timetable Demo</h1>
      <Example events={events}/>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
