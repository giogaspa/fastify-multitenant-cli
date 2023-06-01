'use strict'

const { nanoid } = require('nanoid');

const log = require('../utils/log');
const args = require('../utils/args')();
const { getMultitenantSubject, MULTITENANT_SUBJECT } = require('../utils/utils');
const { addTenantToAdmin, createMigrationsTable, createTenantTable, dbClientFactory } = require('../services/dbClientFactory');

async function cli() {
    log('info', 'Installing...');

    await install();
}

async function install() {
    const subject = getMultitenantSubject();

    if (MULTITENANT_SUBJECT.admin === subject) {
        log('info', 'Create admin migrations table');

        await createMigrationsTable();
        await createTenantTable();

        return;
    }

    if (MULTITENANT_SUBJECT.tenant === subject) {
        const tenant = {
            id: args.tenantId ? args.tenantId : nanoid(),
            hostname: args.tenantHostname,
            connectionString: args.tenantConnectionUrl,
        }

        log('info', `Create tenant`);

        const tenantDB = dbClientFactory(tenant.connectionString);

        await addTenantToAdmin(tenant);
        await createMigrationsTable(tenantDB);

        tenantDB.destroy();
        return;
    }
}

module.exports = {
    cli,
}

if (require.main === module) {
    cli(process.argv.slice(2))
}