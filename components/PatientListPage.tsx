import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, Trash2, User, Download, Bed, TestTube } from 'lucide-react';
import { Patient, Page } from '../types';
import ThemeToggle from './ThemeToggle';
import jsPDF from 'jspdf';

interface PatientListPageProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: (patient: Omit<Patient, 'adminNo'>) => void;
  onDeletePatient: (adminNo: string) => void;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

const PatientListPage: React.FC<PatientListPageProps> = ({
  patients,
  onSelectPatient,
  onAddPatient,
  onDeletePatient,
  onBack,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: '',
    contactNo: '',
    address: '',
    healthIssue: '',
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.adminNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.age.toString().includes(searchTerm)
  );

  const handleDownloadCSV = () => {
    const headers = ['Admin No', 'Name', 'Age', 'Gender', 'Blood Group', 'Contact', 'Address', 'Health Issue'];
    const csvContent = [
      headers.join(','),
      ...filteredPatients.map(p => 
        [p.adminNo, p.name, p.age, p.gender, p.bloodGroup, p.contactNo, `"${p.address}"`, `"${p.healthIssue}"`].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Patient List', 20, 20);
    
    doc.setFontSize(10);
    let y = 35;
    const lineHeight = 8;
    
    filteredPatients.forEach((patient, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${patient.name} (${patient.adminNo})`, 20, y);
      y += lineHeight;
      
      doc.setFontSize(10);
      doc.text(`Age: ${patient.age} | Gender: ${patient.gender} | Blood: ${patient.bloodGroup}`, 25, y);
      y += lineHeight;
      doc.text(`Contact: ${patient.contactNo}`, 25, y);
      y += lineHeight;
      doc.text(`Health Issue: ${patient.healthIssue}`, 25, y);
      y += lineHeight + 3;
    });
    
    doc.save(`patients-list-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient({
      ...newPatient,
      age: parseInt(newPatient.age),
    });
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: '',
      contactNo: '',
      address: '',
      healthIssue: '',
    });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-semibold h-10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Logout
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Patient Management</h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <ThemeToggle />
            <button
              onClick={() => onNavigate(Page.RoomManagement)}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Bed className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Rooms</span>
            </button>
            <button
              onClick={() => onNavigate(Page.LabTests)}
              className="flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <TestTube className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Lab Tests</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Admin No, Name, or Age..."
              className="w-full pl-10 pr-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredPatients.map((patient) => (
            <div
              key={patient.adminNo}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition cursor-pointer border-l-4 border-purple-500"
              onClick={() => onSelectPatient(patient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-3 mr-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">ID: {patient.adminNo}</p>
                    <p className="text-xs text-gray-600">Age: {patient.age} | Gender: {patient.gender} | Blood: {patient.bloodGroup}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this patient?')) {
                        onDeletePatient(patient.adminNo);
                      }
                    }}
                    className="flex items-center bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                    title="Delete Patient"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Blood Group"
                  value={newPatient.bloodGroup}
                  onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={newPatient.contactNo}
                  onChange={(e) => setNewPatient({ ...newPatient, contactNo: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <textarea
                  placeholder="Health Issue"
                  value={newPatient.healthIssue}
                  onChange={(e) => setNewPatient({ ...newPatient, healthIssue: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    Add Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientListPage;
