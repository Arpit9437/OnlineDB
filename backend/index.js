const express = require('express');
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const dbRoutes = require('./routes/db.routes')
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/db', dbRoutes);

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);
})();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
