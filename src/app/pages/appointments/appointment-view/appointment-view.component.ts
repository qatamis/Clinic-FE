import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { AppointmentsService } from '../../../services/appointments.service';
import { Appointment } from '../../../interfaces/appointment';

@Component({
  selector: 'app-appointment-view',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule,
    DatePipe
  ],
  templateUrl: './appointment-view.component.html',
  styleUrl: './appointment-view.component.css'
})
export class AppointmentViewComponent implements OnInit {
  appointmentsService = inject(AppointmentsService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  appointment: Appointment | null = null;
  loading = true;

  ngOnInit(): void {
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
              this.appointment = response;
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
}

