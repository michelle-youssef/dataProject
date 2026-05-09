const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'toogoodtogo'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }

  console.log('Connected to database!');
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../frontend/images/'));
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'restaurant-' + Date.now() + ext);
  }
});

const upload = multer({ storage });

// ── Status updater ──────────────────────────────────────────
function updateOfferStatuses() {
  const now = new Date();

  const currentTime =
    now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0') + ':' +
    now.getSeconds().toString().padStart(2, '0');

  console.log('Checking offer statuses at:', currentTime);

  // 1. Sold out
  db.query(
    `UPDATE offers SET status_id = 2 WHERE available_quantity <= 0`,
    (err) => {
      if (err) console.error('Sold out sync error:', err);
    }
  );

  // 2. Available
  db.query(
    `UPDATE offers 
     SET status_id = 1
     WHERE available_quantity > 0
     AND pickup_start IS NOT NULL
     AND pickup_end IS NOT NULL
     AND ? >= pickup_start
     AND ? <= pickup_end`,
    [currentTime, currentTime],
    (err) => {
      if (err) console.error('Available sync error:', err);
    }
  );

  // 3. Expired
  db.query(
    `UPDATE offers 
     SET status_id = 3
     WHERE available_quantity > 0
     AND pickup_start IS NOT NULL
     AND pickup_end IS NOT NULL
     AND (? < pickup_start OR ? > pickup_end)`,
    [currentTime, currentTime],
    (err) => {
      if (err) console.error('Expiry sync error:', err);
    }
  );
}

updateOfferStatuses();
setInterval(updateOfferStatuses, 30000);

// ── Login ───────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    let passwordMatches = false;

    try {
      passwordMatches = await bcrypt.compare(password, user.password);
    } catch (compareErr) {
      console.error('Password compare error:', compareErr);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userPayload = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      roleId: user.role_id
    };

    // Restaurant owner
    if (Number(user.role_id) === 3) {
      db.query(
        `SELECT id
         FROM restaurants
         WHERE contact_person = ? OR phone = ?
         ORDER BY id DESC
         LIMIT 1`,
        [`${user.first_name} ${user.last_name}`, user.phone],
        (restErr, restResults) => {
          if (restErr) return res.status(500).json({ message: 'Server error' });

          userPayload.restaurantId = restResults.length ? restResults[0].id : null;

          return res.json({
            success: true,
            user: userPayload
          });
        }
      );
    } else {
      return res.json({
        success: true,
        user: userPayload
      });
    }
  });
});

// ── Signup ──────────────────────────────────────────────────
app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  if (parseInt(role) === 3) {
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Phone number is required for Restaurant accounts' });
    }
  }

  db.query('SELECT id FROM users WHERE email = ?', [email], (err, emailResults) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (emailResults.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    if (parseInt(role) === 3) {
      db.query('SELECT id FROM users WHERE phone = ?', [phone], (err, phoneResults) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        if (phoneResults.length > 0) {
          return res.status(409).json({
            message: 'This phone number is already registered to another restaurant.'
          });
        }

        createAccount();
      });
    } else {
      createAccount();
    }
  });

  function createAccount() {
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Password hash error:', hashErr);
        return res.status(500).json({ message: 'Could not secure password' });
      }

      db.query(
        'INSERT INTO users (first_name, last_name, email, password, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, phone || null, role || 2],
        (err, result) => {
          if (err) {
            console.error('Signup DB Error:', err);
            return res.status(500).json({ message: 'Could not create account' });
          }

          res.json({
            success: true,
            user: {
              id: result.insertId,
              firstName,
              lastName,
              email,
              roleId: role || 2
            }
          });
        }
      );
    });
  }
});

// ── Get all offers ──────────────────────────────────────────
app.get('/api/offers', (req, res) => {
  const sql = `
    SELECT 
      o.*, 
      r.name AS restaurant_name, 
      r.address, 
      r.image, 
      r.description AS restaurant_description
    FROM offers o
    JOIN restaurants r ON o.restaurant_id = r.id
    ORDER BY o.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Get offers error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
});

// ── Create new offer from restaurant dashboard ──────────────
app.post('/api/offers', (req, res) => {
  const {
    restaurant_id,
    restaurantId,
    title,
    description,
    original_price,
    discounted_price,
    available_quantity,
    pickup_start,
    pickup_end
  } = req.body;

  const finalRestaurantId = restaurant_id || restaurantId;
  const qty = Number(available_quantity);

  if (!finalRestaurantId || !title || !original_price || !discounted_price || Number.isNaN(qty)) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const statusId = qty <= 0 ? 2 : 1;

  const formattedStart = pickup_start ? pickup_start.substring(0, 5) : null;
  const formattedEnd = pickup_end ? pickup_end.substring(0, 5) : null;

  const sql = `
    INSERT INTO offers
    (restaurant_id, status_id, title, description, original_price, discounted_price, available_quantity, pickup_start, pickup_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      finalRestaurantId,
      statusId,
      title,
      description || null,
      original_price,
      discounted_price,
      qty,
      formattedStart,
      formattedEnd
    ],
    (err, result) => {
      if (err) {
        console.error('Create offer error:', err);
        return res.status(500).json({ message: 'Could not create offer' });
      }

      res.json({
        success: true,
        offerId: result.insertId
      });
    }
  );
});

// ── Get single offer ────────────────────────────────────────
app.get('/api/offers/:id', (req, res) => {
  const sql = `
    SELECT 
      o.*, 
      r.name AS restaurant_name, 
      r.address, 
      r.opening_hours, 
      r.image, 
      r.description AS restaurant_description
    FROM offers o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(results[0]);
  });
});

// ── Claim a bundle ──────────────────────────────────────────
app.post('/api/offers/:id/claim', (req, res) => {
  const offerId = req.params.id;
  const userId = req.body.userId || null;

  db.query(
    'SELECT available_quantity, status_id, discounted_price FROM offers WHERE id = ?',
    [offerId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: 'Offer not found' });
      }

      const offer = results[0];

      if (offer.status_id === 2) {
        return res.status(400).json({ message: 'Sorry, this bundle is sold out!' });
      }

      if (offer.status_id === 3) {
        return res.status(400).json({ message: 'Sorry, this bundle has expired!' });
      }

      if (offer.status_id !== 1) {
        return res.status(400).json({ message: 'This bundle is not available right now.' });
      }

      if (userId) {
        db.query(
          `SELECT od.id 
           FROM orders o
           JOIN orderdetails od ON o.id = od.order_id
           WHERE o.user_id = ? AND od.offer_id = ?`,
          [userId, offerId],
          (err, existing) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            if (existing.length > 0) {
              return res.status(400).json({ message: 'You have already claimed this bundle!' });
            }

            proceedClaim(offer, offerId, userId, res);
          }
        );
      } else {
        proceedClaim(offer, offerId, null, res);
      }
    }
  );
});

function proceedClaim(offer, offerId, userId, res) {
  const price = offer.discounted_price;
  const newQty = offer.available_quantity - 1;
  const newStatus = newQty === 0 ? 2 : 1;

  if (userId) {
    db.query(
      'INSERT INTO orders (user_id, status_id, total) VALUES (?, 1, ?)',
      [userId, price],
      (err, orderResult) => {
        if (err) return res.status(500).json({ message: 'Order creation failed' });

        db.query(
          'INSERT INTO orderdetails (order_id, offer_id, quantity, total) VALUES (?, ?, 1, ?)',
          [orderResult.insertId, offerId, price],
          (err) => {
            if (err) return res.status(500).json({ message: 'Order details creation failed' });

            db.query(
              'UPDATE offers SET available_quantity = ?, status_id = ? WHERE id = ?',
              [newQty, newStatus, offerId],
              (err) => {
                if (err) return res.status(500).json({ message: 'Could not update offer' });

                res.json({
                  success: true,
                  remainingQuantity: newQty,
                  soldOut: newQty === 0
                });
              }
            );
          }
        );
      }
    );
  } else {
    db.query(
      'UPDATE offers SET available_quantity = ?, status_id = ? WHERE id = ?',
      [newQty, newStatus, offerId],
      (err) => {
        if (err) return res.status(500).json({ message: 'Could not claim bundle' });

        res.json({
          success: true,
          remainingQuantity: newQty,
          soldOut: newQty === 0
        });
      }
    );
  }
}

// ── Restock offer ───────────────────────────────────────────
app.put('/api/offers/:id/restock', (req, res) => {
  const { quantity } = req.body;
  const newStatus = quantity > 0 ? 1 : 2;

  db.query(
    'UPDATE offers SET available_quantity = ?, status_id = ? WHERE id = ?',
    [quantity, newStatus, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      res.json({ success: true });
    }
  );
});

// ── Get offers for one restaurant ───────────────────────────
app.get('/api/restaurants/:restaurantId/offers', (req, res) => {
  const sql = `
    SELECT 
      o.*, 
      r.name AS restaurant_name, 
      r.address, 
      r.image, 
      r.description AS restaurant_description
    FROM offers o
    JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.restaurant_id = ?
    ORDER BY o.id DESC
  `;

  db.query(sql, [req.params.restaurantId], (err, results) => {
    if (err) {
      console.error('Restaurant offers error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
});

// ── Delete offer ────────────────────────────────────────────
app.delete('/api/offers/:id', (req, res) => {
  db.query('DELETE FROM offers WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Delete offer error:', err);
      return res.status(500).json({ message: 'Could not delete offer' });
    }

    res.json({ success: true });
  });
});

// ── Get restaurant orders ───────────────────────────────────
// IMPORTANT: this route must be before /api/orders/:userId
app.get('/api/orders/restaurant/:restaurantId', (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.status_id,
      od.total,
      od.quantity,
      off.title AS offer_name,
      u.first_name,
      u.last_name,
      u.phone AS customer_phone
    FROM orders o
    JOIN orderdetails od ON o.id = od.order_id
    JOIN offers off ON od.offer_id = off.id
    JOIN users u ON o.user_id = u.id
    WHERE off.restaurant_id = ?
    ORDER BY o.id DESC
  `;

  db.query(sql, [req.params.restaurantId], (err, results) => {
    if (err) {
      console.error('Restaurant orders error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
});

// ── Update order status ─────────────────────────────────────
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { status_id } = req.body;

  if (!status_id) {
    return res.status(400).json({ message: 'Missing status_id' });
  }

  db.query(
    'UPDATE orders SET status_id = ? WHERE id = ?',
    [status_id, req.params.orderId],
    (err) => {
      if (err) {
        console.error('Update order status error:', err);
        return res.status(500).json({ message: 'Could not update order status' });
      }

      res.json({ success: true });
    }
  );
});

// ── Get orders by user ──────────────────────────────────────
app.get('/api/orders/:userId', (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id, 
      off.title AS bundleTitle, 
      r.name AS restaurantName,
      od.total AS price, 
      off.original_price, 
      o.status_id
    FROM orders o
    JOIN orderdetails od ON o.id = od.order_id
    JOIN offers off ON od.offer_id = off.id
    JOIN restaurants r ON off.restaurant_id = r.id
    WHERE o.user_id = ?
    ORDER BY o.id DESC
  `;

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });

    res.json(results);
  });
});

// ── Upload restaurant image ─────────────────────────────────
app.post('/api/restaurant/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imagePath = 'images/' + req.file.filename;

  db.query(
    'UPDATE restaurants SET image = ? WHERE id = ?',
    [imagePath, req.body.restaurantId],
    (err) => {
      if (err) return res.status(500).json({ message: 'Could not save image' });

      res.json({ success: true, imagePath });
    }
  );
});

// ── Get restaurant by user id ───────────────────────────────
app.get('/api/restaurant/:userId', (req, res) => {
  const sql = `
    SELECT r.*
    FROM restaurants r
    JOIN users u 
      ON r.contact_person = CONCAT(u.first_name, ' ', u.last_name)
      OR r.phone = u.phone
    WHERE u.id = ?
    ORDER BY r.id DESC
    LIMIT 1
  `;

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.error('Get restaurant error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results[0] || null);
  });
});

// ── Create restaurant on signup ─────────────────────────────
app.post('/api/restaurant/create', upload.single('image'), (req, res) => {
  const { name, description, address, opening_hours, contact_person, phone } = req.body;

  const imagePath = req.file ? 'images/' + req.file.filename : null;

  db.query(
    'INSERT INTO restaurants (name, description, address, opening_hours, contact_person, phone, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description || null, address, opening_hours || null, contact_person, phone || null, imagePath],
    (err, result) => {
      if (err) {
        console.error('Create restaurant error:', err);
        return res.status(500).json({ message: 'Could not create restaurant' });
      }

      res.json({
        success: true,
        restaurantId: result.insertId
      });
    }
  );
});

// ── Old create offer route kept so nothing breaks ───────────
app.post('/api/offers/create', (req, res) => {
  const {
    restaurantId,
    title,
    description,
    original_price,
    discounted_price,
    available_quantity,
    pickup_start,
    pickup_end
  } = req.body;

  if (!restaurantId || !title || !original_price || !discounted_price || available_quantity === undefined) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const formattedStart = pickup_start ? pickup_start.substring(0, 5) : null;
  const formattedEnd = pickup_end ? pickup_end.substring(0, 5) : null;

  const qty = Number(available_quantity);
  const statusId = qty <= 0 ? 2 : 1;

  const sql = `
    INSERT INTO offers
    (restaurant_id, status_id, title, description, original_price, discounted_price, available_quantity, pickup_start, pickup_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    restaurantId,
    statusId,
    title,
    description || null,
    original_price,
    discounted_price,
    qty,
    formattedStart,
    formattedEnd
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ message: 'Could not create offer' });
    }

    res.json({
      success: true,
      offerId: result.insertId
    });
  });
});

// ── Get all restaurants for dropdown ────────────────────────
app.get('/api/restaurants', (req, res) => {
  db.query('SELECT id, name FROM restaurants ORDER BY name ASC', (err, results) => {
    if (err) {
      console.error('Get restaurants error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});