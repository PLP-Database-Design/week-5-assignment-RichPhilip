// Declare dependencies / variables
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if DB connection works
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the MySQL DB:", err.code, err.message);
        return; // Exit if there's an error
    }
    console.log("Connected to MySQL successfully as ID: ", db.threadId);

    // Start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);

        // Send a message to the browser
        app.get('/', (req, res) => {
            res.send("Server started successfully! Wedding can go ON!!!");
        });
    });
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error retrieving patients:", err);
            res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error retrieving providers:", err);
            res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Question 3: Filter patients by first name
app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const sql = 'SELECT * FROM patients WHERE first_name = ?';
    db.query(sql, [firstName], (err, results) => {
        if (err) {
            console.error(`Error retrieving patients with first name ${firstName}:`, err);
            res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Question 4: Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const sql = 'SELECT * FROM providers WHERE provider_specialty = ?';
    db.query(sql, [specialty], (err, results) => {
        if (err) {
            console.error(`Error retrieving providers with specialty ${specialty}:`, err);
            res.status(500).send('Server error');
        }
        res.json(results);
    });
});
