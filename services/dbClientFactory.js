const { URL } = require('node:url');

const knex = require('knex');

const args = require('../utils/args')();
const log = require('../utils/log');

function createKnexConfiguration(url) {

    const connectionURL = new URL(url);
    const dbClient = connectionURL.protocol.replace(':', '');

    switch (dbClient) {
        case 'mysql':
            return {
                client: 'mysql',
                connection: {
                    host: connectionURL.hostname,
                    port: connectionURL.port,
                    user: connectionURL.username,
                    password: connectionURL.password,
                    database: connectionURL.pathname.replace('/', '')
                }
            }
        case 'postgresql':
            return {
                client: 'pg',
                connection: url
            }
        default:
            throw new Error('Unsupported database');
    }

}

function dbClientFactory(connectionURL) {
    return knex(createKnexConfiguration(connectionURL ? connectionURL : args.dbConnectionUrl));
};

// Retrieve tenant with ID
async function getTenant(tenantId) {
    const adminDB = dbClientFactory();

    const tenant = await adminDB
        .select()
        .from(args.tenantsTableName)
        .where({ id: tenantId })
        .first();

    await adminDB.destroy();

    return tenant;
}

async function getAllTenants() {
    const adminDB = dbClientFactory();

    const tenant = await adminDB
        .select()
        .from(args.tenantsTableName);

    await adminDB.destroy();

    return tenant;
}

async function createMigrationsTable(db) {
    if (!db) {
        db = dbClientFactory();
    }

    if (await db.schema.hasTable(args.migrationsTableName)) {
        log('info', 'Migrations table is already installed!');

        await db.destroy();

        return true;
    }

    await db.schema.createTable(args.migrationsTableName, function (table) {
        table.increments('id');
        table.string('name');
        table.timestamp('created_at').defaultTo(db.fn.now());
    });

    await db.destroy();

    log('info', 'Created migrations table!');
}

async function createTenantTable() {
    const adminDB = dbClientFactory();

    if (await adminDB.schema.hasTable(args.tenantsTableName)) {
        log('info', 'Tenants table is already installed!');

        await adminDB.destroy();

        return true;
    }

    // TODO how can i move the table definition inside plugin?
    await adminDB.schema.createTable(args.tenantsTableName, function (table) {
        table.string('id', 36).primary();
        table.string('hostname').unique();
        table.string('connection_string'); //Database connection URL
        table.timestamps(true, true);
        table.index(['hostname'], 'idx_hostname');
    });

    await adminDB.destroy();

    log('info', 'Created tenants table!');
}

async function addTenantToAdmin(tenant) {
    const adminDB = dbClientFactory();

    await adminDB(args.tenantsTableName).insert({
        id: tenant.id,
        hostname: tenant.hostname,
        connection_string: tenant.connectionString
    });

    await adminDB.destroy();
}

module.exports = {
    dbClientFactory,
    getTenant,
    getAllTenants,
    createMigrationsTable,
    createTenantTable,
    addTenantToAdmin
};