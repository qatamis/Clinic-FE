import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateDoctor } from '../../../interfaces/doctor';
import { DoctorsService } from '../../../services/doctors.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-doctor-add',
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './doctor-add.component.html',
  styleUrl: './doctor-add.component.css'
})
export class DoctorAddComponent {
  newDoctor: CreateDoctor = {
    email: '',
    fullName: '',
    password: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    address: ''
  };

  doctorsService = inject(DoctorsService);
  translate = inject(TranslateService);

  constructor(private router: Router) {}

  onSubmit() {
    this.doctorsService.createDoctor(this.newDoctor).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/doctors']);
        } else {
          this.translate.get('doctor.errorCreating').subscribe((message) => {
            alert(response.message || message);
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.translate.get('doctor.errorCreating').subscribe((message) => {
          alert(err.error?.message || message);
        });
      }
    });
  }
}
