import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { PatientExam } from '../../../interfaces/patient-exam';
import { PatientExamsService } from '../../../services/patient-exams.service';
import { DoctorsService } from '../../../services/doctors.service';
import { Doctor } from '../../../interfaces/doctor';

@Component({
  selector: 'app-patient-exam-edit',
  imports: [CommonModule, FormsModule, RouterLink, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule],
  templateUrl: './patient-exam-edit.component.html',
  styleUrl: './patient-exam-edit.component.css'
})
export class PatientExamEditComponent implements OnInit {
  exam: PatientExam = {
    id: 0,
    patientId: 0,
    examDate: new Date().toISOString().split('T')[0],
    examType: '',
    examResults: '',
    doctorName: '',
    notes: ''
  };
  selectedFile: File | null = null;
  examId: number = 0;
  doctors: Doctor[] = [];

  patientExamService = inject(PatientExamsService);
  doctorsService = inject(DoctorsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.examId = parseInt(id, 10);
          this.patientExamService.getExamById(this.examId).subscribe({
            next: (response) => {
              this.exam = response;
              // Convert examDate to string format for input[type="date"]
              if (this.exam.examDate) {
                const date = new Date(this.exam.examDate);
                this.exam.examDate = date.toISOString().split('T')[0];
              }
            },
            error: (err) => {
              console.log(err);
              alert('Error loading exam');
            },
          });
        }
      },
    });
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response.filter(d => d.isActive);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      alert('Please select a PDF file');
      this.selectedFile = null;
    }
  }

  onSubmit() {
    this.patientExamService.updateExam(this.examId, this.exam, this.selectedFile || undefined).subscribe({
      next: () => {
        this.router.navigate(['/patient-exams/' + this.exam.patientId]);
      },
      error: (err) => {
        console.log(err);
        alert('Error updating exam');
      },
    });
  }

  deleteDocument() {
    if (confirm('Are you sure you want to delete the document?')) {
      this.patientExamService.deleteDocument(this.examId).subscribe({
        next: () => {
          this.exam.documentPath = undefined;
          this.exam.documentFileName = undefined;
          alert('Document deleted successfully');
        },
        error: (err) => {
          console.log(err);
          alert('Error deleting document');
        },
      });
    }
  }
}
