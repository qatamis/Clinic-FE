export interface InsuranceCompany {
  id: number;
  name: string;
  code?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  contactPerson?: string;
  createdDate: string | Date;
  isActive: boolean;
  notes?: string;
}

