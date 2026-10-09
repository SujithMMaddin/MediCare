export interface Doctor {
  id: number;
  userId: number;
  name: string;
  email: string;
  specializationId: number;
  specialization: string;
  createdAt: string;
}

export interface DoctorRequest {
  name: string;
  email: string;
  password: string;
  specializationId: number;
}