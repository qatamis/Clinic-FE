import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateDoctor } from '../../../interfaces/doctor';
import { DoctorsService } from '../../../services/doctors.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-doctor-edit',
  imports: [CommonModule, FormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent implements OnInit {
  doctorId: number = 0;
  doctor: CreateDoctor = {
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.doctorId = parseInt(id, 10);
          this.loadDoctor();
        }
      }
    });
  }

  loadDoctor() {
    this.doctorsService.getDoctorById(this.doctorId).subscribe({
      next: (response) => {
        this.doctor = {
          email: response.email,
          fullName: response.fullName,
          password: '', // Don't load password
          specialization: response.specialization || '',
          licenseNumber: response.licenseNumber || '',
          phoneNumber: response.phoneNumber || '',
          address: response.address || ''
        };
      },
      error: (err) => {
        console.log(err);
        this.translate.get('doctor.errorLoading').subscribe((message) => {
          alert(message);
        });
      }
    });
  }

  onSubmit() {
    this.doctorsService.updateDoctor(this.doctorId, this.doctor).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/doctors']);
        } else {
          this.translate.get('doctor.errorUpdating').subscribe((message) => {
            alert(response.message || message);
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.translate.get('doctor.errorUpdating').subscribe((message) => {
          alert(err.error?.message || message);
        });
      }
    });
  }
}
