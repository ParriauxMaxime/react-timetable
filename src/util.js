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


export const getToday = (events, date) => {
    const mo = moment(date)
    const [d, m, y] = [mo.date(), mo.month(), mo.year()]
    const T = (e) => {
        const [s, f] = [moment(e.start), moment(e.end)]
        return (s.date() === d && s.month() === m && s.year() === y) ||
            (f.date() === d && f.month() === m && f.year() === y)
    }
    return events.filter(T)
};

export const getWeek = (events, date) => {
    const mo = moment(date)
    const [d, m, y, w] = [mo.date(), mo.month(), mo.year(), mo.week()]
    const W = (e) => {
        const [s, f] = [moment(e.start), moment(e.end)]
        return (s.week() === w && s.year() === y) ||
            (f.week() === w && f.year() === y)
    }
    return events.filter(W)
};

export const getMonth = (events, date) => {
    const mo = moment(date)
    const [d, m, y, w] = [mo.date(), mo.month(), mo.year(), mo.week()]
    const M = (e) => {
        const [s, f] = [moment(e.start), moment(e.end)]
        return (s.month() === m && s.year() === y) ||
            (f.week() === m && f.year() === y)
    }
    return events.filter(M)
};