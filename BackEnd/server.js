require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/bundles', require('./routes/bundles'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/restaurant', require('./routes/restaurant'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`UrFood server running on port ${PORT}`);
});