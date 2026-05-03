const express = require('express');
const db = require('../db');
const {
  verifyToken,
  restaurantOnly
} = require('../middleware/auth');

const router = express.Router();


// GET /api/restaurant/bundles
// Get restaurant's own bundles

router.get(
  '/bundles',
  verifyToken,
  restaurantOnly,
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        `
        SELECT *
        FROM bundles
        WHERE restaurant_id = ?
        `,
        [req.user.restaurant_id]
      );

      res.json(rows);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Server error'
      });
    }
  }
);


// POST /api/restaurant/bundles
// Add new bundle

router.post(
  '/bundles',
  verifyToken,
  restaurantOnly,
  async (req, res) => {
    const {
      title,
      price,
      original_price,
      quantity,
      pickup_time,
      items,
      description
    } = req.body;

    try {
      const [result] = await db.execute(
        `
        INSERT INTO bundles
        (
          restaurant_id,
          title,
          price,
          original_price,
          quantity,
          pickup_time,
          items,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          req.user.restaurant_id,
          title,
          price,
          original_price,
          quantity,
          pickup_time,
          items,
          description
        ]
      );

      res.status(201).json({
        message: 'Bundle added successfully',
        bundleId: result.insertId
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Server error'
      });
    }
  }
);


// DELETE /api/restaurant/bundles/:id
// Soft delete bundle

router.delete(
  '/bundles/:id',
  verifyToken,
  restaurantOnly,
  async (req, res) => {
    try {
      await db.execute(
        `
        UPDATE bundles
        SET is_active = 0
        WHERE id = ?
        AND restaurant_id = ?
        `,
        [
          req.params.id,
          req.user.restaurant_id
        ]
      );

      res.json({
        message: 'Bundle removed successfully'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Server error'
      });
    }
  }
);


// PATCH /api/restaurant/bundles/:id
// Update quantity or pickup time

router.patch(
  '/bundles/:id',
  verifyToken,
  restaurantOnly,
  async (req, res) => {
    const {
      quantity,
      pickup_time
    } = req.body;

    try {
      await db.execute(
        `
        UPDATE bundles
        SET quantity = ?, pickup_time = ?
        WHERE id = ?
        AND restaurant_id = ?
        `,
        [
          quantity,
          pickup_time,
          req.params.id,
          req.user.restaurant_id
        ]
      );

      res.json({
        message: 'Bundle updated successfully'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: 'Server error'
      });
    }
  }
);

module.exports = router;