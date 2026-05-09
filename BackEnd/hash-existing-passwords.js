const mysql = require('mysql2');
const bcrypt = require('bcrypt');

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

  console.log('Connected to database.');
  hashExistingPasswords();
});

function isAlreadyHashed(password) {
  return password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$');
}

function hashExistingPasswords() {
  db.query('SELECT id, password FROM users', async (err, users) => {
    if (err) {
      console.error('Could not fetch users:', err);
      db.end();
      return;
    }

    for (const user of users) {
      if (!user.password) continue;

      if (isAlreadyHashed(user.password)) {
        console.log(`User ${user.id} already hashed. Skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await new Promise((resolve, reject) => {
        db.query(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id],
          (updateErr) => {
            if (updateErr) reject(updateErr);
            else resolve();
          }
        );
      });

      console.log(`User ${user.id} password hashed.`);
    }

    console.log('All existing passwords checked.');
    db.end();
  });
}