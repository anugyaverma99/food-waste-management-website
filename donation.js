const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'donation',
  password: 'root',
  port: 5432,
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/food',(req,res)=>{
  pool.query('SELECT * FROM donation',(error,result)=>{
      if(error){
          console.error('error feching donation',error);
          res.status(500).json({
              error:'Internal server error'
          });
      }
      else{
          res.json(result.rows);
      }
  });
});

// Endpoint to handle form submission from donation.html
app.post('/food-listings', async (req, res) => {
  try {
    const { foodType, quantity, expirationDate, pickupLocation } = req.body;

    // Insert the form data into the database
  
    const result = await pool.query(
      'INSERT INTO donation (foodtype, quantity, expirydate, pickuplocation) VALUES ($1, $2, $3, $4)',
      [foodType, quantity, expirationDate, pickupLocation]
    );
   

    // Send success response
    res.status(200).send('Donation submitted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Failed to submit donation');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});