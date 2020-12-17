require('@babel/register')({
  ignore: [/node_modules/],
  // extensions: [ '.tsx', '.ts', , '.js' ],
})

module.exports = require('../src/index.js')
