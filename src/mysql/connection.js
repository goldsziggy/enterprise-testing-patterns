/**
 * The goal of this file is to create a single point our mysql createConnections will come from.
 * This allows us to easily use jestMock to replace this file and have an outlet for writing tests.
 */

const mysql = require('mysql2')

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'example.org',
  user: process.env.MYSQL_USER || 'bob',
  password: process.env.MYSQL_PW || 'secret',
  database: process.env.MYSQL_DB || 'test',
})

module.exports = pool.promise()
