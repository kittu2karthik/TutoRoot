const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

pg.types.setTypeParser(1114, (str) => new Date(str + 'Z'));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    useUTC: true,
  },
  timezone: '+00:00',
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;
