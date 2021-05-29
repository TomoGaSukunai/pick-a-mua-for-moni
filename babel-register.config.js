const babelConfig = require('./babel.config')

module.exports = {
  ...babelConfig,
  extensions: ['.jsx'],
  cache: false,
}
