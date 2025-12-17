import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsService } from '../../services/statistics.service';
import { InsuranceStatistics } from '../../interfaces/statistics';

@Component({
  selector: 'app-insurance-reports',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    TranslateModule,
    DecimalPipe
  ],
  templateUrl: './insurance-reports.component.html',
  styleUrl: './insurance-reports.component.css'
})
export class InsuranceReportsComponent implements OnInit {
  statisticsService = inject(StatisticsService);
  insuranceStats: InsuranceStatistics[] = [];
  loading = true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  filterByDateRange = false;

  ngOnInit(): void {
    this.loadInsuranceStatistics();
  }

  loadInsuranceStatistics() {
    this.loading = true;
    if (this.filterByDateRange && this.startDate && this.endDate) {
      this.statisticsService.getInsuranceStatisticsByDateRange(this.startDate, this.endDate).subscribe({
        next: (stats) => {
          this.insuranceStats = stats;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading insurance statistics:', err);
          this.loading = false;
        }
      });
    } else {
      this.statisticsService.getInsuranceStatistics().subscribe({
        next: (stats) => {
          this.insuranceStats = stats;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading insurance statistics:', err);
          this.loading = false;
        }
      });
    }
  }

  onFilterChange() {
    if (!this.filterByDateRange) {
      this.startDate = null;
      this.endDate = null;
    }
    this.loadInsuranceStatistics();
  }

  applyDateFilter() {
    if (this.startDate && this.endDate) {
      this.loadInsuranceStatistics();
    }
  }
}

