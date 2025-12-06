
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
  price?: number;
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
}

export enum Page {
  Home,
  Login,
  PatientList,
  PatientDetail,
}
