-- Add doctorName column to patients table
USE hospital_management;

ALTER TABLE patients ADD COLUMN doctorName VARCHAR(255) AFTER healthIssue;

SELECT 'Doctor Name column added successfully!' AS message;
