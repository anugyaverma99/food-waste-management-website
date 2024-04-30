const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 4000;

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'signup',
  password: 'root',
  port: 5432,
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint for user signup
// Endpoint for user signup
app.post('/signup', async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    // Check if the email already exists
    const emailExists = await pool.query('SELECT * FROM signup WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).send('Email already registered');
    }

    // Insert the form data into the database
    const result = await pool.query(
      'INSERT INTO signup (fullname, email, password) VALUES ($1, $2, $3)',
      [fullname, email, password]
    );

    res.status(200).send('Sign Up successful');
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Failed to sign up');
  }
});

// Endpoint to fetch signup data
app.get('/signup', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM signup');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching signup data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
