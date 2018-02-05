/***************************************
 ** O-rizon development
 ** Created by Maxime Parriaux
 ** 1/21/18 - 17:48
 ** util.js.js
 ** 2017 - All rights reserved
 ***************************************/

import moment from 'moment'

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
})

export const sortDate = (a, b) => {
    a = new Date(a.start)
    b = new Date(b.start)
    return a < b ? -1 : a > b ? 1 : 0
}

export const getToday = (events, date) => {
    return events.filter(e => e.isToday(date))
};

export const getWeek = (events, date) => {
    const d = moment(date)
    const format = "WW YYYY"
    const W = (e) => {
        const [s, f] = [moment(e.start), moment(e.end)]
        return  (s.format(format) ===  d.format(format) ||
            f.format(format) === d.format(format))
    }
    return events.filter(W)
};

export const getMonth = (events, date) => {
    const d = moment(date)
    const format = 'MM YYYY'
    const M = (e) => {
        const [s, f] = [moment(e.start), moment(e.end)]
        return (s.format(format) ===  d.format(format) ||
            f.format(format) === d.format(format))
    }
    return events.filter(M)
};