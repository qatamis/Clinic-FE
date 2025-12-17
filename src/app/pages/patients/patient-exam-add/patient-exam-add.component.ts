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
  selector: 'app-patient-exam-add',
  imports: [CommonModule, FormsModule, RouterLink, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule],
  templateUrl: './patient-exam-add.component.html',
  styleUrl: './patient-exam-add.component.css'
})
export class PatientExamAddComponent implements OnInit {
  newExam: PatientExam = {
    id: 0,
    patientId: 0,
    examDate: new Date().toISOString().split('T')[0],
    examType: '',
    examResults: '',
    doctorName: '',
    notes: ''
  };
  selectedFile: File | null = null;
  doctors: Doctor[] = [];
  patientId: number = 0;

  patientExamService = inject(PatientExamsService);
  doctorsService = inject(DoctorsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          const idNumber = parseInt(id, 10);
          this.patientId = idNumber;
          this.newExam.patientId = idNumber;
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
    if (this.newExam.patientId) {
      this.patientExamService.addExam(this.newExam, this.selectedFile || undefined).subscribe({
        next: () => {
          this.router.navigate(['/patient-exams/' + this.newExam.patientId]);
        },
        error: (err) => {
          console.log(err);
          alert('Error adding exam');
        },
      });
    }
  }
}
