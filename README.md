# react-timetable

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

React component that implement timetable logic.

# Notice
**PROJECT IN PROGRESS**
Actual release is more or less stable.
This is not production ready yet.

## Installation
##### NPM
```
npm install --save @maximeparriaux/react-timetable
```
##### Yarn
```
yarn add @maximeparriaux/react-timetable
```

## API
This component is based on templated inheritance.

```javascript
// @flow

export {
    TimeTable : React.Component<ViewProps>,
    TimeEvent<T: ITimeEvent> implements Renderable,
    AbstractView : React.Component<ViewProps> implements IView,
    List : AbstractView,
    Table : AbstractView,
    Pagination : React.Component<>
};


// An event is just an object containing 'start' and 'end'

type ITimeEvent = {
    start: Date,
    end: Date,
    creator?: string,
    title?: string,
    _id?: string,
}

interface Renderable {
    renderList: (index: number) => React.Node
    renderTable: (defaultStyle: Object<Style>) => React.Node
}

export type ViewProps = {
    date: Date,
    duration: string,
    events: IListTimeEvent,
    timeStart: number,
    timeEnd: number,
    timeDivision: number
}

type IListTimeEvent = Array<TimeEvent<ITimeEvent>>

export interface IView {
    renderDay(props: ViewProps): React.Node,
    renderWeek(props: ViewProps): React.Node,
    renderMonth(props: ViewProps):React.Node,
}
```

## Examples
Coming soon

## FAQ

## License
This project is licensed under the terms of the MIT license.


[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

