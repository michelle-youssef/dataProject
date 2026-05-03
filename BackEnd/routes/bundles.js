const express = require('express');
const db = require('../db');

const router = express.Router();


// GET ALL ACTIVE BUNDLES
// Supports: city and type filters

router.get('/', async (req, res) => {
  try {
    let sql = `
      SELECT
        b.*,
        r.name AS restaurant_name,
        r.type AS restaurant_type,
        r.location,
        r.city,
        r.image_url,
        r.rating
      FROM bundles b
      JOIN restaurants r
        ON b.restaurant_id = r.id
      WHERE
        b.is_active = 1
        AND b.quantity > 0
    `;

    const params = [];

    if (req.query.city) {
      sql += ` AND r.city = ?`;
      params.push(req.query.city);
    }

    if (req.query.type) {
      sql += ` AND r.type = ?`;
      params.push(req.query.type);
    }

    const [rows] = await db.execute(sql, params);

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});


// GET SINGLE BUNDLE by ID

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `
      SELECT
        b.*,
        r.name AS restaurant_name,
        r.location,
        r.city
      FROM bundles b
      JOIN restaurants r
        ON b.restaurant_id = r.id
      WHERE b.id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Bundle not found'
      });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
});

module.exports = router;