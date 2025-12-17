import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Patient } from '../../../interfaces/patient';
import { PatientsService } from '../../../services/patients.service';
import { InsuranceCompaniesService } from '../../../services/insurance-companies.service';
import { InsuranceCompany } from '../../../interfaces/insurance-company';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatSelectModule, TranslateModule],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css'
})
export class PatientEditComponent implements OnInit {
  updatePatientRequest: Patient = {
    id: 0,
    name: '',
    address: '',
    age: 0,
    allergy: false,
    bloodPressure: false,
    bloodSuger: false,
    phoneNumber: '',
    insuranceCompanyId: null,
    insurancePolicyNumber: ''
  };
  insuranceCompanies: InsuranceCompany[] = [];
  form!: FormGroup;
  patientService = inject(PatientsService);
  insuranceCompaniesService = inject(InsuranceCompaniesService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  onSubmit() {
    this.patientService
      .updatePatientById(
        this.updatePatientRequest.id,
        this.updatePatientRequest
      )
      .subscribe({
        next: (response) => {
          this.router.navigate(['/patients']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.loadInsuranceCompanies();
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          this.patientService.getPatientById(idNumber).subscribe({
            next: (response) => {
              this.updatePatientRequest = response;
            },
          });
        }
      },
    });
  }

  loadInsuranceCompanies() {
    this.insuranceCompaniesService.getActiveInsuranceCompanies().subscribe({
      next: (companies) => {
        this.insuranceCompanies = companies;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
