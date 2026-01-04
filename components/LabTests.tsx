import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LabTest, Page } from '../types';
import ThemeToggle from './ThemeToggle';

interface LabTestsProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const LabTests: React.FC<LabTestsProps> = ({ onNavigate, onLogout }) => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | LabTest['status']>('All');
  const [showAddTest, setShowAddTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [newTest, setNewTest] = useState({
    patientName: '',
    testName: '',
    testType: 'Blood' as LabTest['testType'],
    doctorName: '',
    notes: ''
  });

  useEffect(() => {
    // Initialize with sample data
    const sampleTests: LabTest[] = [
      {
        id: '1',
        patientId: 'ADM001',
        patientName: 'John Smith',
        testName: 'Complete Blood Count',
        testType: 'Blood',
        result: 'WBC: 7,500/μL, RBC: 4.5M/μL, Hemoglobin: 14.2 g/dL',
        normalRange: 'WBC: 4,000-11,000/μL, RBC: 4.2-5.4M/μL, Hemoglobin: 12-16 g/dL',
        status: 'Completed',
        orderedDate: '2024-12-05',
        completedDate: '2024-12-06',
        doctorName: 'Dr. Sarah Wilson',
        notes: 'All values within normal range'
      },
      {
        id: '2',
        patientId: 'ADM002',
        patientName: 'Sarah Johnson',
        testName: 'Chest X-Ray',
        testType: 'X-Ray',
        status: 'In Progress',
        orderedDate: '2024-12-06',
        doctorName: 'Dr. Michael Brown',
        notes: 'Routine check for respiratory symptoms'
      },
      {
        id: '3',
        patientId: 'ADM003',
        patientName: 'Michael Brown',
        testName: 'Lipid Profile',
        testType: 'Blood',
        result: 'Total Cholesterol: 220 mg/dL, LDL: 140 mg/dL, HDL: 45 mg/dL',
        normalRange: 'Total: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL',
        status: 'Completed',
        orderedDate: '2024-12-04',
        completedDate: '2024-12-05',
        doctorName: 'Dr. Emily Davis',
        notes: 'Elevated cholesterol levels - recommend dietary changes'
      },
      {
        id: '4',
        patientId: 'ADM004',
        patientName: 'Emily Davis',
        testName: 'Urine Analysis',
        testType: 'Urine',
        status: 'Pending',
        orderedDate: '2024-12-06',
        doctorName: 'Dr. David Wilson',
        notes: 'Check for UTI symptoms'
      },
      {
        id: '5',
        patientId: 'ADM005',
        patientName: 'David Wilson',
        testName: 'ECG',
        testType: 'ECG',
        result: 'Normal sinus rhythm, HR: 72 bpm',
        normalRange: 'HR: 60-100 bpm, Normal rhythm',
        status: 'Completed',
        orderedDate: '2024-12-03',
        completedDate: '2024-12-04',
        doctorName: 'Dr. Sarah Wilson',
        notes: 'Normal cardiac function'
      }
    ];

    setTests(sampleTests);
  }, []);

  const handleAddTest = () => {
    const test: LabTest = {
      id: Date.now().toString(),
      patientId: `ADM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      patientName: newTest.patientName,
      testName: newTest.testName,
      testType: newTest.testType,
      status: 'Pending',
      orderedDate: new Date().toISOString().split('T')[0],
      doctorName: newTest.doctorName,
      notes: newTest.notes
    };

    setTests([...tests, test]);
    setNewTest({ patientName: '', testName: '', testType: 'Blood', doctorName: '', notes: '' });
    setShowAddTest(false);
  };

  const updateTestResult = (testId: string, result: string, normalRange: string) => {
    setTests(tests.map(test => 
      test.id === testId 
        ? { 
            ...test, 
            result, 
            normalRange, 
            status: 'Completed' as LabTest['status'],
            completedDate: new Date().toISOString().split('T')[0]
          }
        : test
    ));
    setSelectedTest(null);
  };

  const getStatusIcon = (status: LabTest['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'In Progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: LabTest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    }
  };

  const getTestTypeColor = (type: LabTest['testType']) => {
    const colors = {
      'Blood': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      'Urine': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      'X-Ray': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'CT Scan': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
      'MRI': 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
      'ECG': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'Other': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    };
    return colors[type];
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || test.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate(Page.PatientList)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lab Tests</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage laboratory tests and results</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setShowAddTest(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Order Test</span>
              </button>
              <button
                onClick={onLogout}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tests.filter(t => t.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tests.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tests.filter(t => t.status === 'Completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by patient name, test name, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tests List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient & Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor & Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {test.patientName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {test.testName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(test.testType)}`}>
                          {test.testType}
                        </span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(test.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {test.doctorName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Ordered: {test.orderedDate}
                        </div>
                        {test.completedDate && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Completed: {test.completedDate}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {test.result ? (
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {test.result}
                          </div>
                          {test.normalRange && (
                            <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                              Normal: {test.normalRange}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                          Awaiting results
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Test Modal */}
      {showAddTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order New Test</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={newTest.patientName}
                  onChange={(e) => setNewTest({ ...newTest, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  value={newTest.testName}
                  onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Complete Blood Count"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Type
                </label>
                <select
                  value={newTest.testType}
                  onChange={(e) => setNewTest({ ...newTest, testType: e.target.value as LabTest['testType'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Blood">Blood</option>
                  <option value="Urine">Urine</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="ECG">ECG</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={newTest.doctorName}
                  onChange={(e) => setNewTest({ ...newTest, doctorName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={newTest.notes}
                  onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Additional notes or instructions"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTest(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTest}
                disabled={!newTest.patientName || !newTest.testName || !newTest.doctorName}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                Order Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Details Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Details - {selectedTest.testName}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Patient
                </label>
                <p className="text-gray-900 dark:text-white">{selectedTest.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Doctor
                </label>
                <p className="text-gray-900 dark:text-white">{selectedTest.doctorName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Test Type
                </label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTestTypeColor(selectedTest.testType)}`}>
                  {selectedTest.testType}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedTest.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTest.status)}`}>
                    {selectedTest.status}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedTest.notes && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedTest.notes}
                </p>
              </div>
            )}

            {selectedTest.result && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Results
                </label>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {selectedTest.result}
                </p>
                {selectedTest.normalRange && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Normal Range: {selectedTest.normalRange}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTest(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabTests;