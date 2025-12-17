import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Doctor } from '../../interfaces/doctor';
import { DoctorsService } from '../../services/doctors.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-doctors',
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorsService = inject(DoctorsService);
  translate = inject(TranslateService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteDoctor(id: number) {
    this.translate.get('doctor.deleteConfirm').subscribe((message) => {
      const isDeleteConfirmed = confirm(message);
      if (isDeleteConfirmed) {
        this.doctorsService.deleteDoctor(id).subscribe({
          next: () => {
            this.loadDoctors();
          },
          error: (err) => {
            console.log(err);
            this.translate.get('doctor.doctorDeleted').subscribe((errorMsg) => {
              alert(errorMsg);
            });
          }
        });
      }
    });
  }

  toggleStatus(doctor: Doctor) {
    const confirmKey = doctor.isActive ? 'doctor.deactivateConfirm' : 'doctor.activateConfirm';
    this.translate.get(confirmKey).subscribe((message) => {
      const isConfirmed = confirm(message);
      if (isConfirmed) {
        this.doctorsService.updateDoctorStatus(doctor.id, !doctor.isActive).subscribe({
          next: () => {
            doctor.isActive = !doctor.isActive;
          },
          error: (err) => {
            console.log(err);
            this.translate.get('doctor.doctorUpdated').subscribe((errorMsg) => {
              alert(errorMsg);
            });
          }
        });
      }
    });
  }
}
