import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppointmentsService } from '../../services/appointments.service';
import { PatientsService } from '../../services/patients.service';
import { DoctorsService } from '../../services/doctors.service';
import { Appointment } from '../../interfaces/appointment';
import { Patient } from '../../interfaces/patient';
import { Doctor } from '../../interfaces/doctor';
import { AppointmentsCalendarComponent } from './appointments-calendar/appointments-calendar.component';

@Component({
  selector: 'app-appointments',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    FormsModule,
    TranslateModule,
    AppointmentsCalendarComponent
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointmentsService = inject(AppointmentsService);
  patientsService = inject(PatientsService);
  doctorsService = inject(DoctorsService);
  snackBar = inject(MatSnackBar);
  translate = inject(TranslateService);

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  loading = true;

  // Filters
  searchKeyword = '';
  selectedStatus = '';
  selectedDoctorId: number | null = null;
  selectedPatientId: number | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Dropdowns
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  statuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show', 'Rescheduled'];

  viewMode: 'list' | 'calendar' = 'list';

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
    this.loadPatients();
  }

  loadAppointments() {
    this.loading = true;
    
    // For calendar view, load appointments for a wider range (3 months back, 3 months forward) if no date range is specified
    let startDate = this.startDate;
    let endDate = this.endDate;
    
    if (this.viewMode === 'calendar' && !startDate && !endDate) {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 4, 0);
      endDate.setHours(23, 59, 59, 999);
    }
    
    this.appointmentsService.getAppointments(
      startDate || undefined,
      endDate || undefined,
      this.selectedDoctorId || undefined,
      this.selectedPatientId || undefined,
      this.selectedStatus || undefined
    ).subscribe({
      next: (response) => {
        this.appointments = response;
        // Debug logging for calendar view
        if (this.viewMode === 'calendar') {
          console.log('Calendar view - Loaded appointments:', response.length);
          console.log('Status breakdown:', response.reduce((acc, apt) => {
            acc[apt.status] = (acc[apt.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>));
          console.log('Sample appointments:', response.slice(0, 5).map(a => ({
            id: a.id,
            patient: a.patientName,
            status: a.status,
            date: a.appointmentDate
          })));
        }
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
        this.loading = false;
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

  applyFilters() {
    this.filteredAppointments = this.appointments.filter(apt => {
      const matchesSearch = !this.searchKeyword || 
        apt.patientName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        apt.doctorName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (apt.appointmentType && apt.appointmentType.toLowerCase().includes(this.searchKeyword.toLowerCase()));
      
      return matchesSearch;
    });
    
    // Debug: Log appointments for calendar view
    if (this.viewMode === 'calendar') {
      console.log('Calendar view - All appointments:', this.appointments);
      console.log('Appointments by status:', this.appointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
    }
  }

  onFilterChange() {
    this.loadAppointments();
  }

  onSearchChange() {
    this.applyFilters();
  }

  deleteAppointment(id: number) {
    if (confirm(this.translate.instant('appointments.deleteConfirm'))) {
      this.appointmentsService.deleteAppointment(id).subscribe({
        next: () => {
          this.snackBar.open(
            this.translate.instant('appointments.appointmentDeleted'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
          this.loadAppointments();
        },
        error: (err) => {
          console.error('Error deleting appointment:', err);
          this.snackBar.open(
            this.translate.instant('appointments.errorDeleting'),
            this.translate.instant('common.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  updateStatus(id: number, status: string) {
    this.appointmentsService.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant('appointments.statusUpdated'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.snackBar.open(
          this.translate.instant('appointments.errorUpdatingStatus'),
          this.translate.instant('common.close'),
          { duration: 3000 }
        );
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'No-show': 'bg-orange-100 text-orange-800',
      'Rescheduled': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  toggleView() {
    this.viewMode = this.viewMode === 'list' ? 'calendar' : 'list';
    // When switching to calendar, reload appointments to get current month's data
    if (this.viewMode === 'calendar') {
      // Clear date filters when switching to calendar to show current month
      if (!this.startDate && !this.endDate) {
        this.loadAppointments();
      }
    }
  }
}


