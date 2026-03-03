const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Database Tables via Sequelize
const { sequelize } = require('./models');
sequelize
  .sync()
  .then(() => console.log('Database synchronized successfully.'))
  .catch((err) => console.error('Error synchronizing database:', err));

// Routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const apiRoutes = require('./routes/api');

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', apiRoutes); // For fetching uploads, pairs, and exports

// Serve frontend in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
