export interface Statistics {
  totalPatients: number;
  totalDoctors: number;
  activeDoctors: number;
  totalVisits: number;
  totalExams: number;
  totalAppointments?: number;
  todayAppointments?: number;
  upcomingAppointments?: number;
  totalAmount: number;
  todayAmount: number;
  thisMonthAmount: number;
  totalInsuranceCovered?: number;
  totalPatientPaid?: number;
}

export interface AmountStatistics {
  amount: number;
  startDate?: string;
  endDate?: string;
}

export interface InsuranceStatistics {
  insuranceCompanyId: number;
  insuranceCompanyName: string;
  totalVisits: number;
  totalTreatmentCost: number;
  totalInsuranceCovered: number;
  totalPatientPaid: number;
}

