'use strict'

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const generify = require('generify');

const log = require('../utils/log');
const args = require('../utils/args')();
const { getAdminMigrationsFolder, getTenantMigrationsFolder,
    getMultitenantSubject, MULTITENANT_SUBJECT } = require('../utils/utils');

//const PACKAGE_NAME = require('../package.json').name;

function cli() {
    const subject = getMultitenantSubject();

    generateMigrationFor({ subject, name: args.migrationName });
}

function generateMigrationFor({ subject = null, name = '' }) {
    // Create migration folder
    createMigrationsFolder();

    // Create empty file
    const date = getFormattedDate();

    const migrationName = name.length > 0
        ? `${date}_${name}`
        : `${date}`;

    const fileName = `${migrationName}.js`;

    const file = MULTITENANT_SUBJECT.admin === subject
        ? path.join(getAdminMigrationsFolder(), fileName)
        : path.join(getTenantMigrationsFolder(), fileName);

    const data = {
        migrationName: migrationName,
    };

    generate(data, file).catch(function (err) {
        if (err) {
            log('error', err.message);
            process.exit(1);
        }
    });
}

function createMigrationsFolder() {
    mkdir(getAdminMigrationsFolder());
    mkdir(getTenantMigrationsFolder());
}

function mkdir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function getFormattedDate() {
    let d = new Date(),
        day = '' + d.getDate(),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hours.toString().length < 2)
        hours = '0' + hours.toString();
    if (minutes.toString().length < 2)
        minutes = '0' + minutes.toString();
    if (seconds.toString().length < 2)
        seconds = '0' + seconds.toString();

    return [year, month, day, hours, minutes, seconds].join('');
}

async function generate(data, filePath) {
    const generifyPromise = promisify(generify);
    const templatePath = path.join(__dirname, '..', 'templates', 'migration', 'migration.js');

    return await generifyPromise(templatePath, filePath, data);
}

module.exports = {
    cli,
}

if (require.main === module) {
    cli(process.argv.slice(2))
}