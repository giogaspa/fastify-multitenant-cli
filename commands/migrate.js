'use strict'

const log = require('../utils/log');
const args = require('../utils/args')();
const { getMultitenantSubject, MULTITENANT_SUBJECT } = require('../utils/utils');
const { getTenant, getAllTenants } = require('../services/dbClientFactory');
const { runMissingMigrationsForAdmin, runMissingMigrationsForTenant } = require('../services/migrationManager');

const ALL_TENANTS = '*';

async function cli() {

    const tenantId = args.tenantId;

    switch (getMultitenantSubject()) {
        case MULTITENANT_SUBJECT.admin:

            log('info', `Execute admin missing migrations`);
            runMissingMigrationsForAdmin();

            break;

        case MULTITENANT_SUBJECT.tenant:

            if (ALL_TENANTS === tenantId) {
                const tenantList = await getAllTenants();
                for (let idx = 0; idx < tenantList.length; idx++) {
                    log('info', `Execute tenant "${tenantList[idx].id}" missing migrations`);
                    await runMissingMigrationsForTenant(tenantList[idx]);
                    log('info', `=========================================================`);
                }
            } else {
                log('info', `Execute tenant "${tenantId}" missing migrations`);
                const tenant = await getTenant(tenantId);
                await runMissingMigrationsForTenant(tenant);
            }

            break;
    }

}

module.exports = {
    cli,
}

if (require.main === module) {
    cli(process.argv.slice(2))
}