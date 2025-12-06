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

  const db = getConnection();

  try {
    if (req.method === 'GET') {
      // Get all patients
      const result = await db.query('SELECT * FROM patients ORDER BY "createdAt" DESC');
      const patients = result.rows.map(patient => ({
        ...patient,
        medicines: parseMedicines(patient.medicines),
        nextappointment: formatDate(patient.nextappointment)
      }));
      res.status(200).json(patients);
    } else if (req.method === 'POST') {
      // Add new patient
      const result = await db.query('SELECT "adminNo" FROM patients ORDER BY id DESC LIMIT 1');
      let nextNumber = 1;
      if (result.rows.length > 0) {
        const lastAdminNo = result.rows[0].adminNo;
        const lastNumber = parseInt(lastAdminNo.replace('ADM', ''));
        nextNumber = lastNumber + 1;
      }
      const adminNo = `ADM${String(nextNumber).padStart(3, '0')}`;
      
      const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
      
      const insertResult = await db.query(
        'INSERT INTO patients ("adminNo", name, age, gender, "bloodGroup", "contactNo", address, "healthIssue", medicines, "nextAppointment") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
        [adminNo, name, age, gender, bloodGroup, contactNo, address, healthIssue, JSON.stringify(medicines || []), nextAppointment || null]
      );
      
      const newPatient = await db.query('SELECT * FROM patients WHERE id = $1', [insertResult.rows[0].id]);
      const patient = {
        ...newPatient.rows[0],
        medicines: parseMedicines(newPatient.rows[0].medicines),
        nextappointment: formatDate(newPatient.rows[0].nextappointment)
      };
      res.status(201).json(patient);
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
