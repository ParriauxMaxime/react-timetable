module.exports = {
  type: 'react-component',
  babel: {
    presets: ['react', 'flow']
  },
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
