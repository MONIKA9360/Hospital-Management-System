-- Create Database
CREATE DATABASE IF NOT EXISTS hospital_management;

-- Use the database
USE hospital_management;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adminNo VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  bloodGroup VARCHAR(10) NOT NULL,
  contactNo VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  healthIssue TEXT NOT NULL,
  medicines JSON,
  nextAppointment DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO patients (adminNo, name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment) VALUES
('ADM001', 'John Smith', 35, 'Male', 'A+', '+1-555-0123', '123 Main St, New York, NY 10001', 'Hypertension, Diabetes', '[]', NULL),
('ADM002', 'Sarah Johnson', 28, 'Female', 'B-', '+1-555-0456', '456 Oak Ave, Los Angeles, CA 90210', 'Asthma', '[]', NULL),
('ADM003', 'Michael Brown', 42, 'Male', 'O+', '+1-555-0789', '789 Pine Rd, Chicago, IL 60601', 'Heart Disease', '[]', NULL),
('ADM004', 'Emily Davis', 31, 'Female', 'AB+', '+1-555-0321', '321 Elm St, Houston, TX 77001', 'Migraine, Anxiety', '[]', NULL),
('ADM005', 'David Wilson', 55, 'Male', 'A-', '+1-555-0654', '654 Maple Dr, Phoenix, AZ 85001', 'Arthritis, High Cholesterol', '[]', NULL);

SELECT 'Database setup completed successfully!' AS message;
