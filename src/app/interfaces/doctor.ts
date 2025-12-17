export interface Doctor {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  specialization?: string;
  licenseNumber?: string;
  phoneNumber?: string;
  address?: string;
  createdDate: string | Date;
  isActive: boolean;
}

export interface CreateDoctor {
  email: string;
  fullName: string;
  password: string;
  specialization?: string;
  licenseNumber?: string;
  phoneNumber?: string;
  address?: string;
}

