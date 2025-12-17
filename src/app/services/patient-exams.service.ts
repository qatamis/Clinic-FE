import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientExam } from '../interfaces/patient-exam';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PatientExamsService {
  apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getExamsByPatientId(patientId: number): Observable<PatientExam[]> {
    return this.http.get<PatientExam[]>(`${this.apiUrl}PatientExams/patient/${patientId}`);
  }

  getExamById(id: number): Observable<PatientExam> {
    return this.http.get<PatientExam>(`${this.apiUrl}PatientExams/${id}`);
  }

  addExam(exam: PatientExam, document?: File): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', exam.patientId.toString());
    formData.append('examDate', exam.examDate.toString());
    if (exam.examType) formData.append('examType', exam.examType);
    if (exam.examResults) formData.append('examResults', exam.examResults);
    if (exam.doctorName) formData.append('doctorName', exam.doctorName);
    if (exam.notes) formData.append('notes', exam.notes);
    if (document) formData.append('document', document);

    return this.http.post(`${this.apiUrl}PatientExams`, formData);
  }

  updateExam(id: number, exam: PatientExam, document?: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', exam.id.toString());
    formData.append('patientId', exam.patientId.toString());
    formData.append('examDate', exam.examDate.toString());
    if (exam.examType) formData.append('examType', exam.examType);
    if (exam.examResults) formData.append('examResults', exam.examResults);
    if (exam.doctorName) formData.append('doctorName', exam.doctorName);
    if (exam.notes) formData.append('notes', exam.notes);
    if (document) formData.append('document', document);

    return this.http.put(`${this.apiUrl}PatientExams/${id}`, formData);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}PatientExams/${id}`);
  }

  downloadDocument(examId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}PatientExams/${examId}/document`, {
      responseType: 'blob'
    });
  }

  deleteDocument(examId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}PatientExams/${examId}/document`);
  }
}

