import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { PatientsService } from '../../../services/patients.service';
import { DoctorsService } from '../../../services/doctors.service';
import { CreateAppointment } from '../../../interfaces/appointment';
import { Patient } from '../../../interfaces/patient';
import { Doctor } from '../../../interfaces/doctor';

@Component({
  selector: 'app-appointment-add',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './appointment-add.component.html',
  styleUrl: './appointment-add.component.css'
})
export class AppointmentAddComponent implements OnInit {
  appointmentsService = inject(AppointmentsService);
  patientsService = inject(PatientsService);
  doctorsService = inject(DoctorsService);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslateService);
  router = inject(Router);

  newAppointment: CreateAppointment = {
    patientId: 0,
    doctorId: 0,
    appointmentDate: new Date(),
    duration: 30,
    status: 'Scheduled',
    appointmentType: '',
    notes: ''
  };

  patients: Patient[] = [];
  doctors: Doctor[] = [];
  statuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show', 'Rescheduled'];
  appointmentTypes = ['Consultation', 'Follow-up', 'Check-up', 'Emergency', 'Other'];

  selectedDateTime: string = '';

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    // Set default to current date/time
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getMinutes() % 15); // Round to nearest 15 minutes
    this.selectedDateTime = this.formatDateTimeLocal(now);
    this.newAppointment.appointmentDate = now;
  }

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadPatients() {
    this.patientsService.getPatients().subscribe({
      next: (response) => {
        this.patients = response;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  loadDoctors() {
    this.doctorsService.getDoctors().subscribe({
      next: (response) => {
        this.doctors = response.filter(d => d.isActive);
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }

  onDateTimeChange() {
    if (this.selectedDateTime) {
      this.newAppointment.appointmentDate = new Date(this.selectedDateTime);
    }
  }

  onSubmit() {
    if (!this.newAppointment.patientId || !this.newAppointment.doctorId) {
      this.snackBar.open(
        this.translate.instant('appointments.fillRequiredFields'),
        this.translate.instant('common.close'),
        { duration: 3000 }
      );
      return;
    }

    this.newAppointment.appointmentDate = this.selectedDateTime;

    this.appointmentsService.createAppointment(this.newAppointment).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.snackBar.open(
            this.translate.instant('appointments.appointmentCreated'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/appointments']);
        } else {
          this.snackBar.open(
            response.message || this.translate.instant('appointments.errorCreating'),
            this.translate.instant('common.close'),
            { duration: 5000 }
          );
        }
      },
      error: (err) => {
        console.error('Error creating appointment:', err);
        const errorMessage = err.error?.message || this.translate.instant('appointments.errorCreating');
        this.snackBar.open(
          errorMessage,
          this.translate.instant('common.close'),
          { duration: 5000 }
        );
      }
    });
  }
}

