'use strict'

const log = require('../utils/log');

function cli(args) {
    log('info', require('../package.json').version);
}

module.exports = {
    cli,
}

if (require.main === module) {
    cli(process.argv.slice(2))
}