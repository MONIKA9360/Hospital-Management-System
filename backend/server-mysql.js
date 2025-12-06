const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('✅ Using MySQL database');

// Helper function to parse medicines
function parseMedicines(medicinesData) {
  try {
    if (!medicinesData) return [];
    return typeof medicinesData === 'string' ? JSON.parse(medicinesData) : medicinesData;
  } catch (e) {
    return [];
  }
}

// Helper function to format date without timezone conversion
function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Routes

// Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY createdAt DESC');
    const patients = rows.map(patient => ({
      ...patient,
      medicines: parseMedicines(patient.medicines),
      nextAppointment: formatDate(patient.nextAppointment)
    }));
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Get single patient
app.get('/api/patients/:adminNo', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients WHERE adminNo = ?', [req.params.adminNo]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const patient = {
      ...rows[0],
      medicines: parseMedicines(rows[0].medicines),
      nextAppointment: formatDate(rows[0].nextAppointment)
    };
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

// Add new patient
app.post('/api/patients', async (req, res) => {
  try {
    console.log('Received patient data:', req.body);
    
    // Generate admin number
    const [result] = await db.query('SELECT adminNo FROM patients ORDER BY id DESC LIMIT 1');
    let nextNumber = 1;
    if (result.length > 0) {
      const lastAdminNo = result[0].adminNo;
      const lastNumber = parseInt(lastAdminNo.replace('ADM', ''));
      nextNumber = lastNumber + 1;
    }
    const adminNo = `ADM${String(nextNumber).padStart(3, '0')}`;
    
    const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
    
    console.log('Inserting patient with adminNo:', adminNo);
    
    const [insertResult] = await db.query(
      'INSERT INTO patients (adminNo, name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [adminNo, name, age, gender, bloodGroup, contactNo, address, healthIssue, JSON.stringify(medicines || []), nextAppointment || null]
    );
    
    const [newPatient] = await db.query('SELECT * FROM patients WHERE id = ?', [insertResult.insertId]);
    const patient = {
      ...newPatient[0],
      medicines: parseMedicines(newPatient[0].medicines),
      nextAppointment: formatDate(newPatient[0].nextAppointment)
    };
    console.log('Patient added successfully:', patient);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(400).json({ message: 'Error creating patient', error: error.message });
  }
});

// Update patient
app.put('/api/patients/:adminNo', async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
    
    console.log('Updating patient:', req.params.adminNo, req.body);
    
    const [result] = await db.query(
      'UPDATE patients SET name = ?, age = ?, gender = ?, bloodGroup = ?, contactNo = ?, address = ?, healthIssue = ?, medicines = ?, nextAppointment = ? WHERE adminNo = ?',
      [name, age, gender, bloodGroup, contactNo, address, healthIssue, JSON.stringify(medicines || []), nextAppointment || null, req.params.adminNo]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const [updatedPatient] = await db.query('SELECT * FROM patients WHERE adminNo = ?', [req.params.adminNo]);
    const patient = {
      ...updatedPatient[0],
      medicines: parseMedicines(updatedPatient[0].medicines),
      nextAppointment: formatDate(updatedPatient[0].nextAppointment)
    };
    res.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(400).json({ message: 'Error updating patient', error: error.message });
  }
});

// Delete patient
app.delete('/api/patients/:adminNo', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM patients WHERE adminNo = ?', [req.params.adminNo]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

// Initialize with sample data
app.post('/api/initialize', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) as count FROM patients');
    
    if (rows[0].count === 0) {
      const samplePatients = [
        ['ADM001', 'John Smith', 35, 'Male', 'A+', '+1-555-0123', '123 Main St, New York, NY 10001', 'Hypertension, Diabetes', '[]', null],
        ['ADM002', 'Sarah Johnson', 28, 'Female', 'B-', '+1-555-0456', '456 Oak Ave, Los Angeles, CA 90210', 'Asthma', '[]', null],
        ['ADM003', 'Michael Brown', 42, 'Male', 'O+', '+1-555-0789', '789 Pine Rd, Chicago, IL 60601', 'Heart Disease', '[]', null],
        ['ADM004', 'Emily Davis', 31, 'Female', 'AB+', '+1-555-0321', '321 Elm St, Houston, TX 77001', 'Migraine, Anxiety', '[]', null],
        ['ADM005', 'David Wilson', 55, 'Male', 'A-', '+1-555-0654', '654 Maple Dr, Phoenix, AZ 85001', 'Arthritis, High Cholesterol', '[]', null]
      ];
      
      for (const patient of samplePatients) {
        await db.query(
          'INSERT INTO patients (adminNo, name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          patient
        );
      }
      
      res.json({ message: 'Sample data initialized successfully' });
    } else {
      res.json({ message: 'Database already has data' });
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Hospital Management Backend is running!', timestamp: new Date() });
});

// Test database connection on startup
db.query('SELECT 1')
  .then(() => {
    console.log('✅ MySQL database connected successfully');
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('Make sure MySQL is running and credentials are correct');
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`💾 Using MySQL database for persistent storage`);
});
