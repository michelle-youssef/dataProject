const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();


// REGISTER
// POST /api/auth/register

router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    user_type
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  try {
    // Hashing password before storing
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO users
      (name, email, password_hash, user_type)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        email,
        password_hash,
        user_type || 'customer'
      ]
    );

    res.status(201).json({
      message: 'Account created successfully',
      userId: result.insertId
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: 'Email already registered'
      });
    }

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});


// LOGIN
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    let restaurant_id = null;

    // If restaurant user → get restaurant ID
    if (user.user_type === 'restaurant') {
      const [restaurantRows] = await db.execute(
        `SELECT id
         FROM restaurants
         WHERE user_id = ?`,
        [user.id]
      );

      if (restaurantRows.length > 0) {
        restaurant_id = restaurantRows[0].id;
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        restaurant_id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      token,
      user_type: user.user_type,
      name: user.name
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

module.exports = router;