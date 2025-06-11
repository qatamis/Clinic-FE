import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Patient } from '../../../interfaces/patient';
import { PatientsService } from '../../../services/patients.service';

@Component({
  selector: 'app-patient-edit',
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
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
  };
  form!: FormGroup;
  patientService = inject(PatientsService);

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
}
