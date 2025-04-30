const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'TeamHealthDashboard',
    password: 'Luke5341',
    port: 5433,
  });

  module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
  };