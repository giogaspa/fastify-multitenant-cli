# :construction: fastify-multitenant-cli :construction:

Command line tools for Fastify Multitenant Plugin.

---
**NOTE**

This is a work in progress, please look at the develop branch for ongoing development.

---

## Install
```bash
npm install @giogaspa/fastify-multitenant-cli --global
```

## Usage

`@giogaspa/fastify-multitenant-cli` offers a single command line interface for your Fastify multitenant project 
based on `@giogaspa/fastify-multitenant` package:

```bash
$ multitenant
```

Will print an help:

```
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

## ENV vars from .env file or multitenant.js file

#FASTIFY_MULTITENANT_FOLDER="migrations"
#FASTIFY_MULTITENANT_ADMIN_FOLDER="admin"
#FASTIFY_MULTITENANT_TENANT_FOLDER="tenants"
#FASTIFY_MULTITENANT_DB_CONNECTION_URL="mysql://janedoe:mypassword@localhost:3306/mydb"