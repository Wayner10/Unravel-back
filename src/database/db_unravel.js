const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "db_unravel",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

// Close connection when the process exits
process.on('exit', () => {
  client.end(() => {
    console.log('Client disconnected');
  });
});

// Handle termination signals (e.g., Ctrl+C) to close the connection gracefully
process.on('SIGINT', () => {
  client.end(() => {
    console.log('Client disconnected due to process termination');
    process.exit(0);  // Exiting gracefully
  });
});

module.exports = client;
