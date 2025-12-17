import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PatientVisits } from '../../../interfaces/patient-visits';
import { PatientVisitsService } from '../../../services/patient-visits.service';
import { DoctorsService } from '../../../services/doctors.service';
import { PatientsService } from '../../../services/patients.service';
import { Doctor } from '../../../interfaces/doctor';
import { Patient } from '../../../interfaces/patient';

@Component({
  selector: 'app-patient-visits-add',
  imports: [CommonModule, FormsModule, RouterLink, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './patient-visits-add.component.html',
  styleUrl: './patient-visits-add.component.css'
})
export class PatientVisitsAddComponent implements OnInit {
  newVisit: PatientVisits = {
    id: 0,
    patientId: 0,
    diagnoses: '',
    inclinicTreatment: '',
    inhouseTreatment: '',
    treatmentCost: 0,
    onDutyDrName: '',
    visitDate: '',
    insuranceCoveragePercentage: null
  };

  doctors: Doctor[] = [];
  patient: Patient | null = null;
  patientVisitService = inject(PatientVisitsService);
  doctorsService = inject(DoctorsService);
  patientsService = inject(PatientsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatient();
  }

  loadPatient() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          const idNumber = parseInt(id, 10);
          this.patientsService.getPatientById(idNumber).subscribe({
            next: (response) => {
              this.patient = response;
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      }
    });
  }

  calculateInsuranceAmounts() {
    if (this.newVisit.treatmentCost && this.newVisit.insuranceCoveragePercentage) {
      const cost = this.newVisit.treatmentCost;
      const percentage = Math.min(100, Math.max(0, this.newVisit.insuranceCoveragePercentage));
      // These will be calculated on the backend, but we can show preview here if needed
    }
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

  onSubmit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          this.newVisit.patientId = idNumber;
          this.patientVisitService.addVisit(this.newVisit).subscribe({
            next: (visit) => {
              this.router.navigate(['/patient-visits/' + idNumber]);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }
}
