import { Patient } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const patientAPI = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      return await response.json();
    } catch (error) {
      console.error('Error fetching patients:', error);
      return [];
    }
  },

  async getPatient(adminNo: string): Promise<Patient | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      return await response.json();
    } catch (error) {
      console.error('Error fetching patient:', error);
      return null;
    }
  },

  async addPatient(patient: Omit<Patient, 'adminNo'>): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error('Failed to add patient');
    return await response.json();
  },

  async updatePatient(adminNo: string, patient: Patient): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error('Failed to update patient');
    return await response.json();
  },

  async deletePatient(adminNo: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/patients/${adminNo}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete patient');
  },

  async initializeData(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to initialize data');
  },
};
