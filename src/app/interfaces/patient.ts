export interface Patient {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  age: number;
  bloodSuger: boolean;
  bloodPressure: boolean;
  allergy: boolean;
  insuranceCompanyId?: number | null;
  insuranceCompanyName?: string | null;
  insurancePolicyNumber?: string | null;
}
