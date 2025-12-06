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

// Helper function to parse medicines
function parseMedicines(medicinesData) {
  try {
    if (!medicinesData) return [];
    return typeof medicinesData === 'string' ? JSON.parse(medicinesData) : medicinesData;
  } catch (e) {
    return [];
  }
}

// Helper function to format date
function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

  const { adminNo } = req.query;
  const db = getConnection();

  try {
    if (req.method === 'GET') {
      // Get single patient
      const result = await db.query('SELECT * FROM patients WHERE "adminNo" = $1', [adminNo]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      const patient = {
        ...result.rows[0],
        medicines: parseMedicines(result.rows[0].medicines),
        nextappointment: formatDate(result.rows[0].nextappointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'PUT') {
      // Update patient
      const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
      
      const result = await db.query(
        'UPDATE patients SET name = $1, age = $2, gender = $3, "bloodGroup" = $4, "contactNo" = $5, address = $6, "healthIssue" = $7, medicines = $8, "nextAppointment" = $9 WHERE "adminNo" = $10',
        [name, age, gender, bloodGroup, contactNo, address, healthIssue, JSON.stringify(medicines || []), nextAppointment || null, adminNo]
      );
      
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      const updatedPatient = await db.query('SELECT * FROM patients WHERE "adminNo" = $1', [adminNo]);
      const patient = {
        ...updatedPatient.rows[0],
        medicines: parseMedicines(updatedPatient.rows[0].medicines),
        nextappointment: formatDate(updatedPatient.rows[0].nextappointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'DELETE') {
      // Delete patient
      const result = await db.query('DELETE FROM patients WHERE "adminNo" = $1', [adminNo]);
      
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  } finally {
    await db.end();
  }
};
