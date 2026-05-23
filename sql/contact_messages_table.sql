-- SQL schema for storing contact form submissions
-- This example uses PostgreSQL syntax.

CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  subject VARCHAR(150) NOT NULL DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100) NOT NULL DEFAULT 'web_form',
  processed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add an index for lookup by email and created_at if needed.
CREATE INDEX idx_contact_messages_email ON contact_messages (email);
CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at);
