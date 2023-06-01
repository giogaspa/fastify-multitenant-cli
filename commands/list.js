'use strict'

const log = require('../utils/log');
const { getAllTenants } = require('../services/dbClientFactory');

async function cli() {
    log('info', 'List al tenants');

    try {

        const tenants = await getAllTenants();

        tenants.forEach(tenant => {
            log('info', `[${tenant.id}] - ${tenant.hostname} - ${tenant.connection_string}`);
        });

    } catch (e) {
        log('error', e);
    }
}

module.exports = {
    cli,
}

if (require.main === module) {
    cli(process.argv.slice(2))
}