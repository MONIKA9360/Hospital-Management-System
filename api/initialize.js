const { createClient } = require('@supabase/supabase-js');

// Helper function to create Supabase client
function getSupabaseClient() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // Check if environment variables exist
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ 
      message: 'Database configuration missing', 
      error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable is not set'
    });
    return;
  }

  const supabase = getSupabaseClient();

  try {
    // Check if patients exist
    const { count, error: countError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    if (count === 0) {
      const samplePatients = [
        { adminNo: 'ADM001', name: 'John Smith', age: 35, gender: 'Male', bloodGroup: 'A+', contactNo: '+1-555-0123', address: '123 Main St, New York, NY 10001', healthIssue: 'Hypertension, Diabetes', medicines: [], nextAppointment: null },
        { adminNo: 'ADM002', name: 'Sarah Johnson', age: 28, gender: 'Female', bloodGroup: 'B-', contactNo: '+1-555-0456', address: '456 Oak Ave, Los Angeles, CA 90210', healthIssue: 'Asthma', medicines: [], nextAppointment: null },
        { adminNo: 'ADM003', name: 'Michael Brown', age: 42, gender: 'Male', bloodGroup: 'O+', contactNo: '+1-555-0789', address: '789 Pine Rd, Chicago, IL 60601', healthIssue: 'Heart Disease', medicines: [], nextAppointment: null },
        { adminNo: 'ADM004', name: 'Emily Davis', age: 31, gender: 'Female', bloodGroup: 'AB+', contactNo: '+1-555-0321', address: '321 Elm St, Houston, TX 77001', healthIssue: 'Migraine, Anxiety', medicines: [], nextAppointment: null },
        { adminNo: 'ADM005', name: 'David Wilson', age: 55, gender: 'Male', bloodGroup: 'A-', contactNo: '+1-555-0654', address: '654 Maple Dr, Phoenix, AZ 85001', healthIssue: 'Arthritis, High Cholesterol', medicines: [], nextAppointment: null }
      ];
      
      const { error: insertError } = await supabase
        .from('patients')
        .insert(samplePatients);
      
      if (insertError) throw insertError;
      
      res.status(200).json({ message: 'Sample data initialized successfully' });
    } else {
      res.status(200).json({ message: 'Database already has data', count });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error initializing data', error: error.message });
  }
};
