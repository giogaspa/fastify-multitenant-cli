# :construction: @giogaspa/fastify-multitenant-cli :construction:

Command line tools for Fastify Multitenant Plugin.

## Status

Pre-alpha.

This is a work in progress, please look at the develop branch for ongoing development.

## Install

Using npm:

```shell
npm install @giogaspa/fastify-multitenant-cli --global
```

Using yarn:

``` shell
yarn global add @giogaspa/fastify-multitenant-cli
```

## Usage

`@giogaspa/fastify-multitenant-cli` offers a command line interface for your Fastify multitenant project 
based on `@giogaspa/fastify-multitenant` package. In order to use this package also intall [@giogaspa/fastify-multitenant](https://github.com/giogaspa/fastify-multitenant)


```shell
$ multitenant
```

Will print an help:

```shell
Multitenant command line interface, available commands are:

  * setup:admin                                  create admin migrations table and tenants table
  * setup:tenant                                 create tenant 
  * create:admin                                 create an admin migration
  * create:tenant                                create a tenant migration
  * list                                         list all registered tenant
  * migrate:admin                                run all admin missing migrations
  * migrate:tenant                               run all tenant missing migrations
  * version                                      the current fastify-multitenant-cli version
  * help                                         help about commands

```

Launch `multitenant help [command]` to know more about the commands.

## ENV

Set these environment variables to customize how the CLI works.

```
FASTIFY_MULTITENANT_DB_CONNECTION_URL="mysql://janedoe:mypassword@localhost:3306/mydb"
FASTIFY_MULTITENANT_FOLDER="migrations"
FASTIFY_MULTITENANT_ADMIN_FOLDER="admin"
FASTIFY_MULTITENANT_TENANT_FOLDER="tenants"
```

| property                              | description                      | default value |
|---------------------------------------|----------------------------------|---------------|
| FASTIFY_MULTITENANT_DB_CONNECTION_URL | Admin database connection string |               |
| FASTIFY_MULTITENANT_FOLDER            | Migrations folder name           | `migrations`  |
| FASTIFY_MULTITENANT_ADMIN_FOLDER      | Admin migrations folder name     | `admin`       |
| FASTIFY_MULTITENANT_TENANT_FOLDER     | Tenant migrations folder name    | `tenant`      |

## Customize .env path and FASTIFY_MULTITENANT_DB_CONNECTION_URL env variable from multitenant.js file

If `.env` file is outside the root folder you can create `multitenant.js` to customize env path and admin db connection env var.


```js

module.exports = {
    envPath: './config/.env',
    adminDBConnectionEnvVar: 'DATABASE_URL'
}

```

## Setup

### Admin Setup

This command create `migrations` table and `tenants` table for admin database:

```shell
multitenant setup:admin
```

### Tenant setup

This command add new tenant to the `tenants` table of admin database and also creates `migrations` table to the tenant database:

```shell
multitenant setup:tenant --tenant-hostname "tenant.host.tld" --tenant-connection-url "postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample"
```

for detailed options run:

```shell
multitenant help setup:tenant
```

## Migration 

Migration file is structured as code below.
`db` is an instance of (`knex`)[https://knexjs.org/] library.

```js
const MIGRATION_NAME = 'M__migrationName__';

async function up(db) {

}

async function down(db) {

}

module.exports = {
    name: MIGRATION_NAME,
    up,
    down
}
```

### Admin migration

Create migration

```shell
multitenant create:admin
```

Run all admin missing migrations
```shell
multitenant migrate:admin
```

### Tenant migration

Create migration
```shell
multitenant create:tenant
```

Run all tenant missing migrations
```shell
multitenant migrate:tenant --tenant-id xxxxxxxx
```

Use the `--tenant-id "*"` option to run all missing migrations for all tenants registered in the admin table.

## List

Show all tenants inside the admin database
```shell
multitenant migrate:admin
```