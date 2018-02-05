import * as React from 'react'

export type ITimeEvent = {
    start: Date,
    end: Date,
    creator?: string,
    title?: string,
    _id?: string,
}

export interface Renderable {
    renderList: (index: number) => React.Node
    renderTable: (defaultStyle: any) => React.Node
}