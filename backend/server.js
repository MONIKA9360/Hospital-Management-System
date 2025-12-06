const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (fallback when MySQL is not available)
let patients = [
  { adminNo: 'ADM001', name: 'John Smith', age: 35, gender: 'Male', bloodGroup: 'A+', contactNo: '+1-555-0123', address: '123 Main St, New York, NY 10001', healthIssue: 'Hypertension, Diabetes' },
  { adminNo: 'ADM002', name: 'Sarah Johnson', age: 28, gender: 'Female', bloodGroup: 'B-', contactNo: '+1-555-0456', address: '456 Oak Ave, Los Angeles, CA 90210', healthIssue: 'Asthma' },
  { adminNo: 'ADM003', name: 'Michael Brown', age: 42, gender: 'Male', bloodGroup: 'O+', contactNo: '+1-555-0789', address: '789 Pine Rd, Chicago, IL 60601', healthIssue: 'Heart Disease' },
  { adminNo: 'ADM004', name: 'Emily Davis', age: 31, gender: 'Female', bloodGroup: 'AB+', contactNo: '+1-555-0321', address: '321 Elm St, Houston, TX 77001', healthIssue: 'Migraine, Anxiety' },
  { adminNo: 'ADM005', name: 'David Wilson', age: 55, gender: 'Male', bloodGroup: 'A-', contactNo: '+1-555-0654', address: '654 Maple Dr, Phoenix, AZ 85001', healthIssue: 'Arthritis, High Cholesterol' }
];

console.log('✅ Using in-memory storage (MySQL not connected)');

// Routes

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get single patient
app.get('/api/patients/:adminNo', async (req, res) => {
  try {
    const patient = patients.find(p => p.adminNo === req.params.adminNo);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

// Add new patient
app.post('/api/patients', async (req, res) => {
  try {
    console.log('Received patient data:', req.body);
    
    // Generate admin number
    let nextNumber = 1;
    if (patients.length > 0) {
      const lastAdminNo = patients[patients.length - 1].adminNo;
      const lastNumber = parseInt(lastAdminNo.replace('ADM', ''));
      nextNumber = lastNumber + 1;
    }
    const adminNo = `ADM${String(nextNumber).padStart(3, '0')}`;
    
    const { name, age, gender, bloodGroup, contactNo, address, healthIssue } = req.body;
    
    const newPatient = {
      adminNo,
      name,
      age,
      gender,
      bloodGroup,
      contactNo,
      address,
      healthIssue
    };
    
    patients.push(newPatient);
    console.log('Patient added successfully:', newPatient);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update patient
app.put('/api/patients/:adminNo', async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, contactNo, address, healthIssue } = req.body;
    
    const index = patients.findIndex(p => p.adminNo === req.params.adminNo);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patients[index] = {
      ...patients[index],
      name,
      age,
      gender,
      bloodGroup,
      contactNo,
      address,
      healthIssue
    };
    
    res.json(patients[index]);
  } catch (error) {
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete patient
app.delete('/api/patients/:adminNo', async (req, res) => {
  try {
    const index = patients.findIndex(p => p.adminNo === req.params.adminNo);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    patients.splice(index, 1);
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

// Initialize with sample data
app.post('/api/initialize', async (req, res) => {
  try {
    res.json({ message: 'Data already initialized' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Hospital Management Backend is running!', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💾 Using in-memory storage - data will reset on server restart`);
});
