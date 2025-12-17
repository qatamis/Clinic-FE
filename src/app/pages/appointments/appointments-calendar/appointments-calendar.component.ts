import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Appointment } from '../../../interfaces/appointment';

@Component({
  selector: 'app-appointments-calendar',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule,
    DatePipe
  ],
  templateUrl: './appointments-calendar.component.html',
  styleUrl: './appointments-calendar.component.css'
})
export class AppointmentsCalendarComponent implements OnInit, OnChanges {
  @Input() appointments: Appointment[] = [];

  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();

  daysInMonth: Date[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendar();
  }

  ngOnChanges() {
    this.generateCalendar();
    // Debug: Log when appointments change
    if (this.appointments && this.appointments.length > 0) {
      console.log('Calendar: Appointments changed, total:', this.appointments.length);
      console.log('Calendar: Status breakdown:', this.appointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
    }
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.daysInMonth = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth, -i));
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth, day));
    }

    // Fill remaining cells to complete the week
    const remainingDays = 42 - this.daysInMonth.length;
    for (let day = 1; day <= remainingDays; day++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth + 1, day));
    }
    
    // Debug: Log all confirmed appointments and their dates
    if (this.appointments && this.appointments.length > 0) {
      const confirmedAppts = this.appointments.filter(a => a.status === 'Confirmed');
      if (confirmedAppts.length > 0) {
        console.log('Calendar generated for:', this.getMonthName(), this.currentYear);
        console.log('Calendar month index (0-based):', this.currentMonth, 'Year:', this.currentYear);
        console.log('Confirmed appointments dates:', confirmedAppts.map(a => {
          const dateStr = typeof a.appointmentDate === 'string' 
            ? a.appointmentDate.split('T')[0] 
            : new Date(a.appointmentDate).toISOString().split('T')[0];
          const [year, month, day] = dateStr.split('-').map(Number);
          return {
            patient: a.patientName,
            date: a.appointmentDate,
            dateStr: dateStr,
            year: year,
            month: month - 1, // 0-based month
            day: day,
            isInCurrentCalendarMonth: (month - 1) === this.currentMonth && year === this.currentYear
          };
        }));
      }
    }
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    if (!this.appointments || this.appointments.length === 0) return [];
    
    // Normalize the input date to midnight for comparison (local time)
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    const matching = this.appointments.filter(apt => {
      if (!apt.appointmentDate) return false;
      
      // Parse appointment date - handle both string and Date objects
      let aptDate: Date;
      if (typeof apt.appointmentDate === 'string') {
        // Parse ISO string - extract date part to avoid timezone issues
        const dateStr = apt.appointmentDate.split('T')[0]; // Get "2025-12-18" from "2025-12-18T16:00:00"
        const [year, month, day] = dateStr.split('-').map(Number);
        aptDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
      } else {
        aptDate = new Date(apt.appointmentDate);
      }
      
      // Get the date components in local timezone
      const aptYear = aptDate.getFullYear();
      const aptMonth = aptDate.getMonth();
      const aptDay = aptDate.getDate();
      
      // Compare using date components
      const matches = aptYear === targetYear && 
                      aptMonth === targetMonth && 
                      aptDay === targetDay;
      
      return matches;
    });
    
    // Debug: Log appointments by status for the current month
    if (date.getMonth() === this.currentMonth && matching.length > 0) {
      const statusBreakdown = matching.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      if (Object.keys(statusBreakdown).some(s => s !== 'Scheduled')) {
        console.log(`Date ${date.toLocaleDateString()} - Found ${matching.length} appointment(s):`, matching.map(a => ({ status: a.status, patient: a.patientName, id: a.id })));
      }
    }
    
    return matching;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth;
  }

  getMonthName(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[this.currentMonth];
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Scheduled': 'bg-blue-500',
      'Confirmed': 'bg-green-500',
      'Completed': 'bg-gray-500',
      'Cancelled': 'bg-red-500',
      'No-show': 'bg-orange-500',
      'Rescheduled': 'bg-yellow-500'
    };
    const color = colors[status] || 'bg-gray-500';
    // Debug: Log status and color for non-Scheduled appointments
    if (status !== 'Scheduled') {
      console.log('Status color for', status, ':', color);
    }
    return color;
  }
}

