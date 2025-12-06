
import React, { useState, useCallback, useEffect } from 'react';
import { Page, Patient } from './types';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import PatientListPage from './components/PatientListPage';
import PatientDetailPage from './components/PatientDetailPage';
import SuccessPopup from './components/SuccessPopup';
import { patientAPI } from './services/api';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Load patients from backend on component mount
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await patientAPI.getAllPatients();
      setPatients(patientsData);
      
      // If no patients exist, initialize with sample data
      if (patientsData.length === 0) {
        await patientAPI.initializeData();
        const newPatientsData = await patientAPI.getAllPatients();
        setPatients(newPatientsData);
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setSuccessMessage('Error connecting to server. Using offline mode.');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    navigateTo(Page.PatientList);
  }, [navigateTo]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentPage(Page.Home);
  }, []);

  const handleSelectPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient);
    navigateTo(Page.PatientDetail);
  }, [navigateTo]);

  const handleAddPatient = useCallback(async (newPatient: Omit<Patient, 'adminNo'>) => {
    try {
      setLoading(true);
      const addedPatient = await patientAPI.addPatient(newPatient);
      setPatients(prev => [...prev, addedPatient]);
      setSuccessMessage('Patient Successfully Added!');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding patient:', error);
      setSuccessMessage('Error adding patient. Please try again.');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdatePatient = useCallback(async (updatedPatient: Patient) => {
    try {
      setLoading(true);
      const updated = await patientAPI.updatePatient(updatedPatient.adminNo, updatedPatient);
      setPatients(prev => prev.map(p => p.adminNo === updated.adminNo ? updated : p));
      setSelectedPatient(updated);
      setSuccessMessage('Patient Successfully Updated!');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating patient:', error);
      setSuccessMessage('Error updating patient. Please try again.');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeletePatient = useCallback(async (adminNo: string) => {
    try {
      setLoading(true);
      await patientAPI.deletePatient(adminNo);
      setPatients(prev => prev.filter(p => p.adminNo !== adminNo));
      setSuccessMessage('Patient Successfully Deleted!');
      setShowSuccess(true);
    } catch (error) {
      console.error('Error deleting patient:', error);
      setSuccessMessage('Error deleting patient. Please try again.');
      setShowSuccess(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onNavigateToLogin={() => navigateTo(Page.Login)} />;
      case Page.Login:
        return <LoginPage onLogin={handleLogin} onBack={() => navigateTo(Page.Home)} />;
      case Page.PatientList:
        return isLoggedIn ? (
          <PatientListPage 
            patients={patients}
            onSelectPatient={handleSelectPatient}
            onAddPatient={handleAddPatient}
            onDeletePatient={handleDeletePatient}
            onBack={handleLogout}
          />
        ) : (
          <HomePage onNavigateToLogin={() => navigateTo(Page.Login)} />
        );
      case Page.PatientDetail:
        return isLoggedIn && selectedPatient ? (
          <PatientDetailPage 
            patient={selectedPatient}
            onBack={() => navigateTo(Page.PatientList)}
            onUpdatePatient={handleUpdatePatient}
          />
        ) : (
          <HomePage onNavigateToLogin={() => navigateTo(Page.Login)} />
        );
      default:
        return <HomePage onNavigateToLogin={() => navigateTo(Page.Login)} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {renderPage()}
      {showSuccess && (
        <SuccessPopup 
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
};

export default App;
