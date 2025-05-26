// Update with your config settings.

import { connectionSettings } from "./src/db/connectionSettings.js";

const knexConnectionSettings = {
  ...connectionSettings,
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "mysql2",
    connection: knexConnectionSettings,
    migrations: {
      tableName: "knex_migrations",
    },
  },

  staging: {
    client: "mysql2",
    connection: knexConnectionSettings,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "migrations",
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "mysql2",
    connection: knexConnectionSettings,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
