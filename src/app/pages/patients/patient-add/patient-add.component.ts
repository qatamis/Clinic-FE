import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { PatientsService } from '../../../services/patients.service';
import { Patient } from '../../../interfaces/patient';
import { InsuranceCompaniesService } from '../../../services/insurance-companies.service';
import { InsuranceCompany } from '../../../interfaces/insurance-company';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-add',
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatSelectModule, TranslateModule],
  templateUrl: './patient-add.component.html',
  styleUrl: './patient-add.component.css'
})
export class PatientAddComponent implements OnInit {
  newPatient: Patient = {
    id: 0,
    name: '',
    address: '',
    phoneNumber: '',
    age: 0,
    bloodSuger: false,
    bloodPressure: false,
    allergy: false,
    insuranceCompanyId: null,
    insurancePolicyNumber: ''
  };

  insuranceCompanies: InsuranceCompany[] = [];
  patientService = inject(PatientsService);
  insuranceCompaniesService = inject(InsuranceCompaniesService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadInsuranceCompanies();
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

  onSubmit() {
    this.patientService.addPatient(this.newPatient).subscribe({
      next: (patient) => {
        this.router.navigate(['patients']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
