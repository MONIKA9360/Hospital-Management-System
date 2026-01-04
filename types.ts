
export interface Doctor {
  name: string;
  qualification: string;
  specialization: string;
  experience: number;
  contact: string;
  image: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface Patient {
  adminNo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contactNo: string;
  address: string;
  healthIssue: string;
  medicines?: Medicine[];
  nextAppointment?: string;
  roomId?: string;
  bedId?: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: 'ICU' | 'General' | 'Private' | 'Emergency';
  status: 'Available' | 'Occupied' | 'Maintenance';
  patientId?: string;
  patientName?: string;
  floor: number;
  capacity: number;
  occupiedBeds: number;
}

export interface Bed {
  id: string;
  bedNumber: string;
  roomId: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  patientId?: string;
  patientName?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType: 'Blood' | 'Urine' | 'X-Ray' | 'CT Scan' | 'MRI' | 'ECG' | 'Other';
  result?: string;
  normalRange?: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  orderedDate: string;
  completedDate?: string;
  doctorName: string;
  notes?: string;
}

export enum Page {
  Home,
  Login,
  PatientList,
  PatientDetail,
  RoomManagement,
  LabTests,
}
