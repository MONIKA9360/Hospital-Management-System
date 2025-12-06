const { Pool } = require('pg');

// Helper function to create database connection
function getConnection() {
  return new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const db = getConnection();

  try {
    const result = await db.query('SELECT COUNT(*) as count FROM patients');
    
    if (parseInt(result.rows[0].count) === 0) {
      const samplePatients = [
        ['ADM001', 'John Smith', 35, 'Male', 'A+', '+1-555-0123', '123 Main St, New York, NY 10001', 'Hypertension, Diabetes', '[]', null],
        ['ADM002', 'Sarah Johnson', 28, 'Female', 'B-', '+1-555-0456', '456 Oak Ave, Los Angeles, CA 90210', 'Asthma', '[]', null],
        ['ADM003', 'Michael Brown', 42, 'Male', 'O+', '+1-555-0789', '789 Pine Rd, Chicago, IL 60601', 'Heart Disease', '[]', null],
        ['ADM004', 'Emily Davis', 31, 'Female', 'AB+', '+1-555-0321', '321 Elm St, Houston, TX 77001', 'Migraine, Anxiety', '[]', null],
        ['ADM005', 'David Wilson', 55, 'Male', 'A-', '+1-555-0654', '654 Maple Dr, Phoenix, AZ 85001', 'Arthritis, High Cholesterol', '[]', null]
      ];
      
      for (const patient of samplePatients) {
        await db.query(
          'INSERT INTO patients ("adminNo", name, age, gender, "bloodGroup", "contactNo", address, "healthIssue", medicines, "nextAppointment") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          patient
        );
      }
      
      res.status(200).json({ message: 'Sample data initialized successfully' });
    } else {
      res.status(200).json({ message: 'Database already has data' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  } finally {
    await db.end();
  }
};
