module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'react_timetable',
      externals: {
        react: 'React'
      }
    }
  }
}
