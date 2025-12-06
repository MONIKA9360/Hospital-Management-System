import React, { useState, useRef } from 'react';
import { ArrowLeft, Edit2, Save, Download, Plus, Trash2, Calendar } from 'lucide-react';
import { Patient, Medicine } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PatientDetailPageProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const PatientDetailPage: React.FC<PatientDetailPageProps> = ({
  patient,
  onBack,
  onUpdatePatient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState({
    ...patient,
    medicines: patient.medicines || [],
    nextAppointment: patient.nextAppointment || ''
  });
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', frequency: '', price: '' });
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'GPAY' | 'CARD'>('CASH');
  const billRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    onUpdatePatient(editedPatient);
    setIsEditing(false);
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.price) {
      const medicine: Medicine = {
        id: Date.now().toString(),
        name: newMedicine.name,
        dosage: newMedicine.dosage,
        frequency: newMedicine.frequency,
        price: parseFloat(newMedicine.price)
      };
      const updatedPatient = {
        ...editedPatient,
        medicines: [...(editedPatient.medicines || []), medicine]
      };
      setEditedPatient(updatedPatient);
      onUpdatePatient(updatedPatient);
      setNewMedicine({ name: '', dosage: '', frequency: '', price: '' });
      setShowMedicineForm(false);
    }
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicineId(medicine.id);
    setNewMedicine({ name: medicine.name, dosage: medicine.dosage, frequency: medicine.frequency, price: medicine.price?.toString() || '' });
    setShowMedicineForm(true);
  };

  const handleUpdateMedicine = () => {
    if (editingMedicineId && newMedicine.name && newMedicine.dosage && newMedicine.frequency && newMedicine.price) {
      const updatedPatient = {
        ...editedPatient,
        medicines: editedPatient.medicines?.map(m =>
          m.id === editingMedicineId
            ? { ...m, name: newMedicine.name, dosage: newMedicine.dosage, frequency: newMedicine.frequency, price: parseFloat(newMedicine.price) }
            : m
        )
      };
      setEditedPatient(updatedPatient);
      onUpdatePatient(updatedPatient);
      setNewMedicine({ name: '', dosage: '', frequency: '', price: '' });
      setEditingMedicineId(null);
      setShowMedicineForm(false);
    }
  };

  const handleDeleteMedicine = (id: string) => {
    const updatedPatient = {
      ...editedPatient,
      medicines: editedPatient.medicines?.filter(m => m.id !== id)
    };
    setEditedPatient(updatedPatient);
    onUpdatePatient(updatedPatient);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Patient Details', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    const lineHeight = 10;
    
    doc.text(`Admin No: ${patient.adminNo}`, 20, y);
    y += lineHeight;
    doc.text(`Name: ${patient.name}`, 20, y);
    y += lineHeight;
    doc.text(`Age: ${patient.age}`, 20, y);
    y += lineHeight;
    doc.text(`Gender: ${patient.gender}`, 20, y);
    y += lineHeight;
    doc.text(`Blood Group: ${patient.bloodGroup}`, 20, y);
    y += lineHeight;
    doc.text(`Contact: ${patient.contactNo}`, 20, y);
    y += lineHeight;
    doc.text(`Address: ${patient.address}`, 20, y);
    y += lineHeight * 2;
    doc.text(`Health Issue: ${patient.healthIssue}`, 20, y);
    y += lineHeight * 2;
    
    if (editedPatient.nextAppointment) {
      doc.text(`Next Appointment: ${editedPatient.nextAppointment}`, 20, y);
      y += lineHeight * 2;
    }
    
    if (editedPatient.medicines && editedPatient.medicines.length > 0) {
      doc.text('Medicines:', 20, y);
      y += lineHeight;
      editedPatient.medicines.forEach((med, index) => {
        doc.text(`${index + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`, 25, y);
        y += lineHeight;
      });
    }
    
    doc.save(`patient-${patient.adminNo}.pdf`);
  };

  const handleDownloadBill = async () => {
    if (billRef.current) {
      try {
        const canvas = await html2canvas(billRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        // Convert to image and download
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `bill-${patient.adminNo}-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      } catch (error) {
        console.error('Error generating bill:', error);
      }
    }
  };

  const handleDownloadBillOld = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('HealthCare Plus Hospital', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Medical Street, City - 600001', 105, 28, { align: 'center' });
    doc.text('Phone: +91-1234567890 | Email: info@healthcareplus.com', 105, 34, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);
    
    // Bill Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL BILL', 105, 48, { align: 'center' });
    
    // Patient Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let y = 60;
    doc.text(`Bill No: BILL${patient.adminNo}`, 20, y);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 150, y);
    y += 8;
    doc.text(`Patient ID: ${patient.adminNo}`, 20, y);
    y += 6;
    doc.text(`Patient Name: ${patient.name}`, 20, y);
    y += 6;
    doc.text(`Age: ${patient.age} | Gender: ${patient.gender}`, 20, y);
    y += 6;
    doc.text(`Contact: ${patient.contactNo}`, 20, y);
    y += 10;
    
    doc.setLineWidth(0.3);
    doc.line(20, y, 190, y);
    y += 8;
    
    // Table Header
    doc.setFont('helvetica', 'bold');
    doc.text('S.No', 25, y);
    doc.text('Medicine Name', 45, y);
    doc.text('Dosage', 100, y);
    doc.text('Frequency', 130, y);
    doc.text('Amount (₹)', 170, y);
    y += 2;
    doc.line(20, y, 190, y);
    y += 6;
    
    // Medicines List
    doc.setFont('helvetica', 'normal');
    let totalAmount = 0;
    const consultationFee = 500;
    
    if (editedPatient.medicines && editedPatient.medicines.length > 0) {
      editedPatient.medicines.forEach((med, index) => {
        const price = med.price || 0;
        totalAmount += price;
        
        doc.text(`${index + 1}`, 25, y);
        doc.text(med.name, 45, y);
        doc.text(med.dosage, 100, y);
        doc.text(med.frequency, 130, y);
        doc.text(price.toFixed(2), 170, y);
        y += 6;
      });
    }
    
    y += 4;
    doc.line(20, y, 190, y);
    y += 8;
    
    // Totals
    doc.setFont('helvetica', 'normal');
    doc.text('Consultation Fee:', 130, y);
    doc.text(`₹ ${consultationFee.toFixed(2)}`, 170, y);
    y += 6;
    doc.text('Medicine Total:', 130, y);
    doc.text(`₹ ${totalAmount.toFixed(2)}`, 170, y);
    y += 2;
    doc.line(130, y, 190, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Grand Total:', 130, y);
    doc.text(`₹ ${(totalAmount + consultationFee).toFixed(2)}`, 170, y);
    
    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for choosing HealthCare Plus Hospital!', 105, y, { align: 'center' });
    y += 6;
    doc.text('Get well soon!', 105, y, { align: 'center' });
    
    doc.save(`bill-${patient.adminNo}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownloadCSV = () => {
    const headers = ['Admin No', 'Name', 'Age', 'Gender', 'Blood Group', 'Contact', 'Address', 'Health Issue', 'Next Appointment', 'Medicines'];
    const medicinesStr = editedPatient.medicines?.map(m => `${m.name} (${m.dosage} ${m.frequency})`).join('; ') || '';
    const row = [
      patient.adminNo,
      patient.name,
      patient.age,
      patient.gender,
      patient.bloodGroup,
      patient.contactNo,
      `"${patient.address}"`,
      `"${patient.healthIssue}"`,
      editedPatient.nextAppointment || '',
      `"${medicinesStr}"`
    ];
    
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-${patient.adminNo}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-md font-semibold h-10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowBillPreview(true)}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Bill</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md h-10 text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">Patient Details</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Admin No</label>
                <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.adminNo}</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient.name}
                    onChange={(e) => setEditedPatient({ ...editedPatient, name: e.target.value })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedPatient.age}
                    onChange={(e) => setEditedPatient({ ...editedPatient, age: parseInt(e.target.value) })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.age}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    value={editedPatient.gender}
                    onChange={(e) => setEditedPatient({ ...editedPatient, gender: e.target.value as any })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.gender}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Blood Group</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient.bloodGroup}
                    onChange={(e) => setEditedPatient({ ...editedPatient, bloodGroup: e.target.value })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.bloodGroup}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Contact Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedPatient.contactNo}
                    onChange={(e) => setEditedPatient({ ...editedPatient, contactNo: e.target.value })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.contactNo}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    value={editedPatient.address}
                    onChange={(e) => setEditedPatient({ ...editedPatient, address: e.target.value })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.address}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Health Issue</label>
                {isEditing ? (
                  <textarea
                    value={editedPatient.healthIssue}
                    onChange={(e) => setEditedPatient({ ...editedPatient, healthIssue: e.target.value })}
                    className="w-full p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">{patient.healthIssue}</p>
                )}
              </div>

              {/* Medicines Section - Below Health Issue */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-600">Medicines List</label>
                  <button
                    onClick={() => {
                      setShowMedicineForm(true);
                      setEditingMedicineId(null);
                      setNewMedicine({ name: '', dosage: '', frequency: '' });
                    }}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-sm shadow-md"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Medicine
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {editedPatient.medicines && editedPatient.medicines.length > 0 ? (
                    editedPatient.medicines.map((medicine) => (
                      <div key={medicine.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{medicine.name}</h3>
                            <p className="text-sm text-gray-600">Dosage: {medicine.dosage} | Frequency: {medicine.frequency}</p>
                            {medicine.price !== undefined && medicine.price !== null && medicine.price > 0 && <p className="text-sm font-semibold text-green-600 mt-1">Price: ₹{medicine.price}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditMedicine(medicine)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedicine(medicine.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-3 bg-gray-50 rounded-lg">No medicines added</p>
                  )}
                </div>

                {showMedicineForm && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-gray-800">{editingMedicineId ? 'Edit Medicine' : 'Add New Medicine'}</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Medicine Name"
                        value={newMedicine.name}
                        onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                        className="w-full p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={newMedicine.dosage}
                        onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                        className="w-full p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g., Twice daily)"
                        value={newMedicine.frequency}
                        onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                        className="w-full p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹) *"
                        value={newMedicine.price}
                        onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                        className="w-full p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                        min="0"
                        step="0.01"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={editingMedicineId ? handleUpdateMedicine : handleAddMedicine}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg font-semibold"
                        >
                          {editingMedicineId ? 'Update' : 'Add'}
                        </button>
                        <button
                          onClick={() => {
                            setShowMedicineForm(false);
                            setEditingMedicineId(null);
                            setNewMedicine({ name: '', dosage: '', frequency: '', price: '' });
                          }}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Appointment */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  Next Appointment Date
                </label>
                <input
                  type="date"
                  value={editedPatient.nextAppointment || ''}
                  onChange={(e) => {
                    const updatedPatient = { ...editedPatient, nextAppointment: e.target.value };
                    setEditedPatient(updatedPatient);
                    onUpdatePatient(updatedPatient);
                  }}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50"
                />
            </div>
          </div>
        </div>

        {/* Bill Preview Modal */}
        {showBillPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-800">Medical Bill Preview</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadBill}
                      className="flex items-center bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg shadow-md"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => setShowBillPreview(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-semibold text-gray-700">Payment Method:</label>
                  <button
                    onClick={() => setPaymentMethod('CASH')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${paymentMethod === 'CASH' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod('GPAY')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${paymentMethod === 'GPAY' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    GPay
                  </button>
                  <button
                    onClick={() => setPaymentMethod('CARD')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${paymentMethod === 'CARD' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Card
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div ref={billRef} style={{ width: '100%', maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', fontFamily: 'Courier New, monospace', border: '3px solid #000', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {/* Header */}
              <div style={{ borderBottom: '3px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', margin: '0', letterSpacing: '2px' }}>HEALTHCARE PLUS</h1>
                    <p style={{ fontSize: '11px', margin: '3px 0' }}>Old No. 25, New No. 15, Kamarajar Street, City - 600 001</p>
                    <p style={{ fontSize: '11px', margin: '3px 0' }}>Ph: 04265-222744 | Email: healthcare@gmail.com</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      backgroundColor: paymentMethod === 'CASH' ? '#ff6b6b' : paymentMethod === 'GPAY' ? '#4285f4' : '#9c27b0', 
                      color: 'white', 
                      padding: '5px 15px', 
                      fontWeight: 'bold', 
                      fontSize: '14px' 
                    }}>
                      {paymentMethod} BILL
                    </div>
                    <p style={{ fontSize: '11px', margin: '5px 0' }}><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '11px' }}>
                <div>
                  <p style={{ margin: '2px 0' }}><strong>Patient:</strong> {patient.name}</p>
                  <p style={{ margin: '2px 0' }}><strong>ID:</strong> {patient.adminNo}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '2px 0' }}><strong>Age:</strong> {patient.age} | <strong>Gender:</strong> {patient.gender}</p>
                  <p style={{ margin: '2px 0' }}><strong>Contact:</strong> {patient.contactNo}</p>
                </div>
              </div>

              {/* Medicine Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '11px', border: '2px solid #000' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e8e8e8', borderTop: '2px solid #000', borderBottom: '2px solid #000' }}>
                    <th style={{ padding: '10px 6px', textAlign: 'center', border: '1px solid #000', width: '50px', fontWeight: 'bold' }}>QTY</th>
                    <th style={{ padding: '10px 6px', textAlign: 'left', border: '1px solid #000', fontWeight: 'bold' }}>PRODUCT AND PACKING</th>
                    <th style={{ padding: '10px 6px', textAlign: 'center', border: '1px solid #000', width: '90px', fontWeight: 'bold' }}>BATCH NO.</th>
                    <th style={{ padding: '10px 6px', textAlign: 'center', border: '1px solid #000', width: '70px', fontWeight: 'bold' }}>MRP</th>
                    <th style={{ padding: '10px 6px', textAlign: 'center', border: '1px solid #000', width: '60px', fontWeight: 'bold' }}>DISC%</th>
                    <th style={{ padding: '10px 6px', textAlign: 'right', border: '1px solid #000', width: '90px', fontWeight: 'bold' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {editedPatient.medicines && editedPatient.medicines.length > 0 ? (
                    editedPatient.medicines.map((med, index) => {
                      const qty = 1;
                      const mrp = med.price || 0;
                      const disc = 0;
                      const amount = mrp * qty;
                      return (
                        <tr key={med.id} style={{ borderBottom: '1px solid #ccc' }}>
                          <td style={{ padding: '8px 6px', textAlign: 'center', border: '1px solid #ccc' }}>{qty}</td>
                          <td style={{ padding: '8px 6px', border: '1px solid #ccc' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{med.name}</div>
                            <div style={{ fontSize: '10px', color: '#555' }}>{med.dosage} - {med.frequency}</div>
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', border: '1px solid #ccc', fontSize: '10px' }}>B{Date.now().toString().slice(-6)}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', border: '1px solid #ccc' }}>₹{mrp.toFixed(2)}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', border: '1px solid #ccc' }}>{disc}%</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', border: '1px solid #ccc', fontWeight: 'bold' }}>₹{amount.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>No medicines prescribed</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals Section */}
              <div style={{ borderTop: '3px solid #000', paddingTop: '15px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <div style={{ width: '50%', paddingRight: '10px' }}>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>Base Value:</strong> ₹{(editedPatient.medicines?.reduce((sum, med) => sum + (med.price || 0), 0) || 0).toFixed(2)}</p>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>SGST (0%):</strong> ₹0.00</p>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>CGST (0%):</strong> ₹0.00</p>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>Total Items:</strong> {editedPatient.medicines?.length || 0}</p>
                  </div>
                  <div style={{ width: '48%', textAlign: 'right' }}>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>Consultation Fee:</strong> ₹500.00</p>
                    <p style={{ margin: '4px 0', padding: '3px 0' }}><strong>Medicine Total:</strong> ₹{(editedPatient.medicines?.reduce((sum, med) => sum + (med.price || 0), 0) || 0).toFixed(2)}</p>
                    <div style={{ backgroundColor: '#fff8dc', padding: '10px', marginTop: '8px', border: '2px solid #000', borderRadius: '4px' }}>
                      <p style={{ margin: '0', fontSize: '12px' }}><strong>Less Discount:</strong> <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>₹0.00</span></p>
                    </div>
                    <div style={{ backgroundColor: '#c8e6c9', padding: '12px', marginTop: '8px', border: '3px solid #000', borderRadius: '4px' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>GRAND TOTAL:</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' }}>₹{(500 + (editedPatient.medicines?.reduce((sum, med) => sum + (med.price || 0), 0) || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #000', fontSize: '10px', textAlign: 'center' }}>
                <p style={{ margin: '5px 0', fontStyle: 'italic', fontWeight: 'bold' }}>Thank you! Get well soon!</p>
                <p style={{ margin: '5px 0', color: '#666' }}>E & OE - Errors and Omissions Excepted</p>
              </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailPage;
