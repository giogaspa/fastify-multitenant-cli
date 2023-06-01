'use strict'

const { readdirSync, lstatSync } = require('fs');
const path = require('path');

const log = require('../utils/log');
const args = require('../utils/args')();
const { getAdminMigrationsFolder, getTenantMigrationsFolder } = require('../utils/utils');
const { dbClientFactory } = require('../services/dbClientFactory');

async function makeMigrationManagerFor(db, folder) {

    async function runMissingMigrations() {
        const missingMigrationsFile = await getMissingMigrationsFrom(folder, db);

        if (missingMigrationsFile.length === 0) {
            log('info', 'No migration to execute');
            return;
        }

        for (const migrationFile of missingMigrationsFile) {
            const migration = require(migrationFile);
            await execute(migration, db);
        }

        log('info', `Executed ${missingMigrationsFile.length} ${missingMigrationsFile.length > 1 ? 'migrations' : 'migration'}`);
    }

    async function getMissingMigrationsFrom() {
        const allMigrations = readdirSync(folder)
            .map(filename => path.join(process.cwd(), folder, filename))
            .filter(file => lstatSync(file).isFile()) //keep only files
            .map(filename => filename.replace('.js', '')); //remove file extension

        const executedMigrations = (await db.select()
            .from(args.migrationsTableName))
            .map(m => m.name);

        const migrations = allMigrations.filter(migrationFile => {
            const migrationClass = require(migrationFile);

            return !executedMigrations.includes(migrationClass.name);
        });

        return migrations;
    }

    async function execute(migration) {
        log('info', `Execute ${migration.name} migration`);

        try {
            await migration.up(db);
            await save(migration, db);
        } catch (error) {
            log('error', { error });
        }
    }

    async function save(migration) {
        await db(args.migrationsTableName)
            .insert({ name: migration.name });
    }

    return {
        run: runMissingMigrations,
    }
}

async function runMissingMigrationsForTenant(tenant) {
    const tenantDB = dbClientFactory(tenant.connection_string);
    const tenantMigrationManager = await makeMigrationManagerFor(tenantDB, getTenantMigrationsFolder());
    await tenantMigrationManager.run();
    tenantDB.destroy();
}

async function runMissingMigrationsForAdmin() {
    const adminDB = dbClientFactory();
    const adminMigrationManager = await makeMigrationManagerFor(adminDB, getAdminMigrationsFolder());
    await adminMigrationManager.run();
    adminDB.destroy();
}

module.exports = {
    runMissingMigrationsForAdmin,
    runMissingMigrationsForTenant,
}