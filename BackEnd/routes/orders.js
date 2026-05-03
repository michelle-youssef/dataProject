const express = require('express');
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();


// POST /api/orders
// Claim a bundle (customer only)

router.post('/', verifyToken, async (req, res) => {
  const { bundle_id } = req.body;
  const user_id = req.user.id;

  if (!bundle_id) {
    return res.status(400).json({
      error: 'bundle_id is required'
    });
  }

  try {
    // Checking if bundle exists and has stock
    const [bundles] = await db.execute(
      `
      SELECT *
      FROM bundles
      WHERE id = ?
      AND quantity > 0
      AND is_active = 1
      `,
      [bundle_id]
    );

    if (bundles.length === 0) {
      return res.status(400).json({
        error: 'Bundle unavailable or sold out'
      });
    }

    const bundle = bundles[0];

    // Transaction to ensure atomicity of order placement and stock update
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // place order
      const [orderResult] = await connection.execute(
        `
        INSERT INTO orders
        (user_id, bundle_id, restaurant_id, price_paid)
        VALUES (?, ?, ?, ?)
        `,
        [
          user_id,
          bundle_id,
          bundle.restaurant_id,
          bundle.price
        ]
      );

      // Decrease quantity by 1 after placing order
      await connection.execute(
        `
        UPDATE bundles
        SET quantity = quantity - 1
        WHERE id = ?
        `,
        [bundle_id]
      );

      await connection.commit();

      res.status(201).json({
        message: 'Bundle claimed successfully!',
        orderId: orderResult.insertId
      });

    } catch (error) {
      await connection.rollback();

      console.error(error);

      res.status(500).json({
        error: 'Could not complete claim'
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});


// GET /api/orders/mine
// User order history

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        o.*,
        b.title AS bundle_title,
        r.name AS restaurant_name
      FROM orders o
      JOIN bundles b
        ON o.bundle_id = b.id
      JOIN restaurants r
        ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.claimed_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

module.exports = router;