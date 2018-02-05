import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import {TimeTable} from 'src/index'

describe('Component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(React.createElement(TimeTable, {date: new Date(), events: []}), node, () => {
    })
  })
})
