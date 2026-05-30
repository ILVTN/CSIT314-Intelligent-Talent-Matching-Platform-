'use strict';

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// --- Main App ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Database Connection ---
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Successfully connected to the database.');
});

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Welcome to the Intelligent Talent Matching Platform API!');
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});