export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientPhoneNumber?: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization?: string;
  appointmentDate: string | Date;
  duration: number;
  status: string;
  appointmentType?: string;
  notes?: string;
  createdDate: string | Date;
  updatedDate: string | Date;
  patientVisitId?: number;
}

export interface CreateAppointment {
  patientId: number;
  doctorId: number;
  appointmentDate: string | Date;
  duration: number;
  status: string;
  appointmentType?: string;
  notes?: string;
}

export interface UpdateAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string | Date;
  duration: number;
  status: string;
  appointmentType?: string;
  notes?: string;
}

