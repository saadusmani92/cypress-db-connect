# Cypress PostgreSQL Setup Guide

This project connects Cypress to a PostgreSQL database and exposes a custom Cypress task called `READFROMDB` for SQL queries in tests.

## What this project uses

- `cypress`: Runs end-to-end tests.
- `dotenv`: Loads values from a `.env` file into `process.env`.
- `pg`: PostgreSQL client for Node.js.

Install dependencies:

```bash
npm install
```

## Where database credentials are defined

Database credentials are read from environment variables in `cypress.config.js`:

- `db_User`
- `db_Host`
- `db_Database`
- `db_Password`

The config is mapped into a `pg.Pool` object:

- File: `cypress.config.js`
- Object: `DB_CONFIG`
- Pool: `const dbPool = new pg.Pool(DB_CONFIG)`

## Create your `.env` file

Create a `.env` file in the project root (same level as `package.json`):

```env
db_User=your_postgres_username
db_Host=localhost
db_Database=your_database_name
db_Password=your_password
```

`dotenv` is loaded at the top of `cypress.config.js` with:

```js
require("dotenv").config();
```

## Where the Cypress database task is defined

In `cypress.config.js`, the `READFROMDB` task is registered inside `setupNodeEvents`:

```js
on("task", {
  READFROMDB({ sql }) {
    return dbPool.query(sql);
  },
});
```

This allows Cypress tests to execute SQL by calling `cy.task("READFROMDB", { sql })`.

## Where test query is written

Example DB query test:

- File: `cypress/e2e/queryUsers.cy.js`
- Task call:

```js
cy.task("READFROMDB", {
  sql: `Select * from Users`,
});
```

## Run tests

Interactive mode:

```bash
npx cypress open
```

Headless mode:

```bash
npx cypress run
```

## Notes

- Make sure PostgreSQL is running before Cypress tests start.
- Ensure the target table (`Users`) exists in the configured database.
- The pool is closed after test execution using `after:run` in `cypress.config.js`.
