import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientsService } from '../../../services/patients.service';
import { Patient } from '../../../interfaces/patient';

@Component({
  selector: 'app-patient-add',
  imports: [FormsModule, RouterLink],
  templateUrl: './patient-add.component.html',
  styleUrl: './patient-add.component.css'
})
export class PatientAddComponent {
  newPatient: Patient = {
    id: 0,
    name: '',
    address: '',
    phoneNumber: '',
    age: 0,
    bloodSuger: false,
    bloodPressure: false,
    allergy: false,
  };

  patientService = inject(PatientsService);

  constructor(private router: Router) {}

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
