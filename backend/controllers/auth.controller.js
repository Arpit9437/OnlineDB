const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

module.exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObj = await pool.query(
      'INSERT INTO public.users (username, password_hash) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );

    const userId = userObj.rows[0].id;

    await pool.query(`CREATE SCHEMA IF NOT EXISTS user_${userId};`);

    const token = jwt.sign({ user_id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user_id: userId });
  } catch (err) {
    console.error('Signup error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  try {
    const userObj = await pool.query(
      'SELECT * FROM public.users WHERE username = $1',
      [username]
    );
    const user = userObj.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password." });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user_id: user.id });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


