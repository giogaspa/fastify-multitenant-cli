#!/usr/bin/env node

'use strict'

const path = require('path');

const commist = require('commist')();
const args = require('./utils/args')(process.argv);
const log = require('./utils/log');
const help = require('help-me')({ dir: path.join(path.dirname(require.main.filename), 'help') });
const { checkMandatoryDependency } = require('./utils/utils');

try {
    checkMandatoryDependency();
} catch (e) {
    log('error', e);
    return;
}

/** Command root scripts */
const setup = require('./commands/setup');
const create = require('./commands/create');
const migrate = require('./commands/migrate');
const list = require('./commands/list');
const version = require('./commands/version');

commist.register('setup:admin', setup.cli);
commist.register('setup:tenant', setup.cli);
commist.register('create:admin', create.cli);
commist.register('create:tenant', create.cli);
commist.register('migrate:admin', migrate.cli);
commist.register('migrate:tenant', migrate.cli);
commist.register('list', list.cli);
commist.register('version', version.cli);
commist.register('help', help.toStdout);


if (args.help) {
    const command = argv._.splice(2)[0]

    help.toStdout(command)
} else {
    const res = commist.parse(process.argv.splice(2))

    if (res) {
        // no command was recognized
        help.toStdout(res)
    }
}