const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl : {
        rejectUnauthorized : false
    }
});

module.exports = pool;