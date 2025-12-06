-- PostgreSQL Database Setup for Hospital Management System

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  "adminNo" VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL,
  "bloodGroup" VARCHAR(5) NOT NULL,
  "contactNo" VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  "healthIssue" TEXT NOT NULL,
  medicines JSONB DEFAULT '[]',
  "nextAppointment" DATE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_no ON patients("adminNo");
CREATE INDEX IF NOT EXISTS idx_created_at ON patients("createdAt");

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updatedAt
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
