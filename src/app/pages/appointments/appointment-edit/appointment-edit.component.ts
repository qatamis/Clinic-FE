import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { UpdateAppointment, Appointment } from '../../../interfaces/appointment';
import { Patient } from '../../../interfaces/patient';
import { Doctor } from '../../../interfaces/doctor';

@Component({
  selector: 'app-appointment-edit',
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
  templateUrl: './appointment-edit.component.html',
  styleUrl: './appointment-edit.component.css'
})
export class AppointmentEditComponent implements OnInit {
  appointmentsService = inject(AppointmentsService);
  patientsService = inject(PatientsService);
  doctorsService = inject(DoctorsService);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslateService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  appointment: UpdateAppointment = {
    id: 0,
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
  loading = true;

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
    this.loadAppointment();
  }

  loadAppointment() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          const idNumber = parseInt(id, 10);
          this.appointmentsService.getAppointmentById(idNumber).subscribe({
            next: (response) => {
              this.appointment = {
                id: response.id,
                patientId: response.patientId,
                doctorId: response.doctorId,
                appointmentDate: new Date(response.appointmentDate),
                duration: response.duration,
                status: response.status,
                appointmentType: response.appointmentType || '',
                notes: response.notes || ''
              };
              this.selectedDateTime = this.formatDateTimeLocal(new Date(response.appointmentDate));
              this.loading = false;
            },
            error: (err) => {
              console.error('Error loading appointment:', err);
              this.loading = false;
            }
          });
        }
      }
    });
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

  formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onDateTimeChange() {
    if (this.selectedDateTime) {
      this.appointment.appointmentDate = new Date(this.selectedDateTime);
    }
  }

  onSubmit() {
    this.appointment.appointmentDate = this.selectedDateTime;

    this.appointmentsService.updateAppointment(this.appointment.id, this.appointment).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.snackBar.open(
            this.translate.instant('appointments.appointmentUpdated'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.router.navigate(['/appointments']);
        } else {
          this.snackBar.open(
            response.message || this.translate.instant('appointments.errorUpdating'),
            this.translate.instant('common.close'),
            { duration: 5000 }
          );
        }
      },
      error: (err) => {
        console.error('Error updating appointment:', err);
        const errorMessage = err.error?.message || this.translate.instant('appointments.errorUpdating');
        this.snackBar.open(
          errorMessage,
          this.translate.instant('common.close'),
          { duration: 5000 }
        );
      }
    });
  }
}

