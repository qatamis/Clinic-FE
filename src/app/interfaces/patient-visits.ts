export interface PatientVisits {
  id: number;
  patientId: number;
  diagnoses: string;
  inclinicTreatment: string;
  inhouseTreatment: string;
  treatmentCost: number;
  onDutyDrName: string;
  visitDate: string | Date;
  insuranceCoveragePercentage?: number | null;
  insuranceCoveredAmount?: number | null;
  patientPaidAmount?: number | null;
}
