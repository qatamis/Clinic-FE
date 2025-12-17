export interface PatientExam {
  id: number;
  patientId: number;
  examDate: string | Date;
  examType?: string;
  examResults?: string;
  doctorName?: string;
  notes?: string;
  documentPath?: string;
  documentFileName?: string;
}

