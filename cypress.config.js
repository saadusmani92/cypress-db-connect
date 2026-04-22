require("dotenv").config();
const { defineConfig } = require("cypress");
const pg = require("pg");

const DB_CONFIG = {
  user: process.env.db_User,
  host: process.env.db_Host,
  database: process.env.db_Database,
  password: process.env.db_Password,
  port: 5432,
  max: 10,
  query_timeout: 300000,
  connectionTimeoutMillis: 300000,
  idleTimeoutMillis: 300000,
  statement_timeout: 300000,
};

const dbPool = new pg.Pool(DB_CONFIG);

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        READFROMDB({ sql }) {
          return dbPool.query(sql);
        },
      });

      on("after:run", async () => {
        await dbPool.end();
      });

      return config;
    },
  },
});
