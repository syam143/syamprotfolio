const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'contact_messages.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
    return;
  }

  db.run(
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'General Inquiry',
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      source TEXT NOT NULL DEFAULT 'web_form',
      processed INTEGER NOT NULL DEFAULT 0
    )`,
    (createErr) => {
      if (createErr) {
        console.error('Failed to create contact_messages table:', createErr.message);
      }
    }
  );
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const stmt = db.prepare(
    `INSERT INTO contact_messages (name, email, subject, message, source, processed)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  stmt.run([name, email, subject || 'General Inquiry', message, 'web_form', 0], function (err) {
    if (err) {
      console.error('Contact form submit failed:', err.message);
      return res.status(500).json({ error: 'Unable to save message. Please try again later.' });
    }

    res.status(201).json({ id: this.lastID, status: 'saved' });
  });

  stmt.finalize();
});

exports.api = functions.https.onRequest(app);
