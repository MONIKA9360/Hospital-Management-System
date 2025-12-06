const { createClient } = require('@supabase/supabase-js');

// Helper function to create Supabase client
function getSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

  const supabase = getSupabaseClient();
  const { adminNo } = req.query;

  try {
    if (req.method === 'GET' && !adminNo) {
      // Get all patients
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      const patients = data.map(patient => ({
        ...patient,
        medicines: parseMedicines(patient.medicines),
        nextAppointment: formatDate(patient.nextAppointment)
      }));
      res.status(200).json(patients);
    } else if (req.method === 'GET' && adminNo) {
      // Get single patient
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('adminNo', adminNo)
        .single();
      
      if (error) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      const patient = {
        ...data,
        medicines: parseMedicines(data.medicines),
        nextAppointment: formatDate(data.nextAppointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'POST') {
      // Add new patient - get last adminNo
      const { data: lastPatient } = await supabase
        .from('patients')
        .select('adminNo')
        .order('id', { ascending: false })
        .limit(1)
        .single();
      
      let nextNumber = 1;
      if (lastPatient) {
        const lastNumber = parseInt(lastPatient.adminNo.replace('ADM', ''));
        nextNumber = lastNumber + 1;
      }
      const newAdminNo = `ADM${String(nextNumber).padStart(3, '0')}`;
      
      const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
      
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          adminNo: newAdminNo,
          name,
          age,
          gender,
          bloodGroup,
          contactNo,
          address,
          healthIssue,
          medicines: medicines || [],
          nextAppointment: nextAppointment || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      const patient = {
        ...data,
        medicines: parseMedicines(data.medicines),
        nextAppointment: formatDate(data.nextAppointment)
      };
      res.status(201).json(patient);
    } else if (req.method === 'PUT' && adminNo) {
      // Update patient
      const { name, age, gender, bloodGroup, contactNo, address, healthIssue, medicines, nextAppointment } = req.body;
      
      const { data, error } = await supabase
        .from('patients')
        .update({
          name,
          age,
          gender,
          bloodGroup,
          contactNo,
          address,
          healthIssue,
          medicines: medicines || [],
          nextAppointment: nextAppointment || null
        })
        .eq('adminNo', adminNo)
        .select()
        .single();
      
      if (error) {
        res.status(404).json({ message: 'Patient not found' });
        return;
      }
      
      const patient = {
        ...data,
        medicines: parseMedicines(data.medicines),
        nextAppointment: formatDate(data.nextAppointment)
      };
      res.status(200).json(patient);
    } else if (req.method === 'DELETE' && adminNo) {
      // Delete patient
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('adminNo', adminNo);
      
      if (error) {
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
  }
};
