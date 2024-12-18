"use strict";
const dotenv = require("dotenv");
dotenv.config();

const DEFAULT_CONFIG_DB = {
  DB_DATABASE: "db_badminton_web",
  DB_USERNAME: "root",
  DB_PASSWORD: "password",
  DB_HOST: "localhost",
  DB_PORT: "3306",
  DB_DIALECT: "mysql",
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME || DEFAULT_CONFIG_DB.DB_USERNAME,
    password: process.env.DB_PASSWORD || DEFAULT_CONFIG_DB.DB_PASSWORD,
    database: process.env.DB_DATABASE || DEFAULT_CONFIG_DB.DB_DATABASE,
    host: process.env.DB_HOST || DEFAULT_CONFIG_DB.DB_HOST,
    dialect: process.env.DB_DIALECT || DEFAULT_CONFIG_DB.DB_DIALECT,
    dialectOptions:
      process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    logging: false,
    query: {
      raw: true,
    },
    timezone: "+07:00",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
