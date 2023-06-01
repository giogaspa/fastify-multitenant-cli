'use strict'

const fs = require('fs');
const { join } = require('path');

const argv = require('yargs-parser');
const dotenv = require('dotenv');
const log = require('./log');

const DEFAULT_ARGUMENTS = {
  folder: 'migrations',
  adminFolder: 'admin',
  tenantFolder: 'tenant',
  dbConnectionUrl: '',
  migrationsTableName: 'migration',
  tenantsTableName: 'tenant',
  name: '', //Migration name
  tenantId: '',
  tenantHostname: '',
  tenantConnectionUrl: '',
};

const DEFAULT_MULTITENANT_CONFIG = {
  env: '.env',
  adminDBConnectionEnvVar: 'FASTIFY_MULTITENANT_DB_CONNECTION_URL',
}

function getMultitenantConfigurationFile() {
  return join(process.cwd(), 'multitenant.js');
}

function existMultitenantConfigurationFile() {
  return fs.existsSync(getMultitenantConfigurationFile());
}

function parseArgs(args) {

  let cliConfiguration = null;
  if (existMultitenantConfigurationFile()) {
    cliConfiguration = { ...DEFAULT_MULTITENANT_CONFIG, ...require(getMultitenantConfigurationFile()) };
    dotenv.config({ path: cliConfiguration.envPath });

  } else {
    dotenv.config();
  }

  const commandLineArguments = argv(args, {
    configuration: {
      'populate--': true
    },
    string: ['folder', 'admin-folder', 'tenant-folder', 'db-connection-url', 'migrations-table-name', 'tenants-table-name', 'name', 'tenant-id', 'tenant-hostname', 'tenant-connection-url'],
    envPrefix: 'FASTIFY_MULTITENANT_',
  });

  // Merge objects from lower to higher priority
  const parsedArgs = { ...DEFAULT_ARGUMENTS, ...commandLineArguments };

  const migrationName = parsedArgs.name.length > 0
    ? parsedArgs.name
    : args[3] && args[3].toString().startsWith('-')
      ? ''
      : args[3];

  return {
    _: args,
    command: args[2],
    folder: parsedArgs.folder,
    adminFolder: parsedArgs.adminFolder,
    tenantFolder: parsedArgs.tenantFolder,
    dbConnectionUrl: cliConfiguration
      ? process.env[cliConfiguration.adminDBConnectionEnvVar]
      : parsedArgs.dbConnectionUrl,
    migrationsTableName: parsedArgs.migrationsTableName,
    migrationName: migrationName,
    tenantsTableName: parsedArgs.tenantsTableName,
    tenantId: parsedArgs.tenantId,
    tenantHostname: parsedArgs.tenantHostname,
    tenantConnectionUrl: parsedArgs.tenantConnectionUrl,
  };
}

let _args = null;

module.exports = function (args) {
  if (_args === null) {
    _args = parseArgs(args);
  }

  return _args;
}