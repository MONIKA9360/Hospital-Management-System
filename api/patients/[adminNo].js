const mysql = require('mysql2/promise');

// Helper function to create database connection
function getConnection() {
  return mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') ? {
      rejectUnauthorized: true
    } : undefined
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
      const [rows] = await db.query('SELECT * FROM patients WHERE adminNo = ?', [adminNo]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      const patient = {
        ...rows[0],
        medicines: parseMedicines(rows[0].medicines),
        nextAppointment: formatDate(rows[0].nextAppointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'PUT') {
      // Update patient
      const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
      
      const [result] = await db.query(
        'UPDATE patients SET name = ?, age = ?, gender = ?, bloodGroup = ?, contactNo = ?, address = ?, healthIssue = ?, medicines = ?, nextAppointment = ? WHERE adminNo = ?',
        [name, age, gender, bloodGroup, contactNo, address, healthIssue, JSON.stringify(medicines || []), nextAppointment || null, adminNo]
      );
      
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      const [updatedPatient] = await db.query('SELECT * FROM patients WHERE adminNo = ?', [adminNo]);
      const patient = {
        ...updatedPatient[0],
        medicines: parseMedicines(updatedPatient[0].medicines),
        nextAppointment: formatDate(updatedPatient[0].nextAppointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'DELETE') {
      // Delete patient
      const [result] = await db.query('DELETE FROM patients WHERE adminNo = ?', [adminNo]);
      
      if (result.affectedRows === 0) {
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
