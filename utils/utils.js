'use strict'

const path = require('path');
const args = require('./args')();
const log = require('./log');

const SUBJECT = Object.freeze({
  admin: 'admin',
  tenant: 'tenant'
});

const DEPENDENCY = '@giogaspa/fastify-multitenant';

function getMultitenantSubject() {
  return args.command.includes(SUBJECT.admin)
    ? SUBJECT.admin
    : SUBJECT.tenant;
}

function getAdminMigrationsFolder() {
  return path.join(args.folder, args.adminFolder);
}

function getTenantMigrationsFolder() {
  return path.join(args.folder, args.tenantFolder);
}

function checkMandatoryDependency() {
  const dependencies = require(path.join(process.cwd(), 'package.json')).dependencies;

  if (typeof (dependencies[DEPENDENCY]) === 'undefined') {
    throw new Error(`The "${DEPENDENCY}" dependency is missing. Please install it!`);
  }
}

module.exports = {
  MULTITENANT_SUBJECT: SUBJECT,
  checkMandatoryDependency,
  getMultitenantSubject,
  getAdminMigrationsFolder,
  getTenantMigrationsFolder,
}