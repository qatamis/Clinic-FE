import { Component, inject, OnInit, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { StatisticsService } from '../../services/statistics.service';
import { Statistics, AmountStatistics } from '../../interfaces/statistics';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule, 
    RouterLink, 
    TranslateModule, 
    MatIconModule, 
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  statisticsService = inject(StatisticsService);
  translate = inject(TranslateService);
  statistics: Statistics | null = null;
  loading = true;
  
  // Revenue filtering
  revenueFilter: 'today' | 'month' | 'range' | 'total' = 'total';
  startDate: Date | null = null;
  endDate: Date | null = null;
  customAmount: number | null = null;
  loadingCustomAmount = false;

  // Check if user is admin
  isAdmin = computed(() => {
    const userDetail = this.authService.getUserDetail();
    return userDetail?.roles && Array.isArray(userDetail.roles) && userDetail.roles.includes('Admin');
  });

  ngOnInit(): void {
    this.loadStatistics();
    // Initialize revenue filter to show total amount
    this.revenueFilter = 'total';
  }

  loadStatistics(): void {
    this.statisticsService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.loading = false;
        // Reset custom amount when statistics load
        if (this.revenueFilter !== 'range') {
          this.customAmount = null;
        }
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
        this.loading = false;
      }
    });
  }

  onRevenueFilterChange(): void {
    if (this.revenueFilter === 'range') {
      // Don't load automatically for range, wait for user to click button
      this.customAmount = null;
      return;
    }

    this.loadCustomAmount();
  }

  loadCustomAmount(): void {
    if (!this.statistics) return;

    this.loadingCustomAmount = true;
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.revenueFilter) {
      case 'today':
        startDate = today;
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'range':
        if (this.startDate && this.endDate) {
          startDate = new Date(this.startDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(this.endDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          this.loadingCustomAmount = false;
          return;
        }
        break;
      case 'total':
        this.customAmount = this.statistics.totalAmount;
        this.loadingCustomAmount = false;
        return;
    }

    if (startDate && endDate) {
      this.statisticsService.getAmountByDateRange(startDate, endDate).subscribe({
        next: (result) => {
          this.customAmount = result.amount;
          this.loadingCustomAmount = false;
        },
        error: (err) => {
          console.error('Error loading custom amount:', err);
          this.loadingCustomAmount = false;
        }
      });
    } else {
      this.loadingCustomAmount = false;
    }
  }

  getDisplayAmount(): number {
    if (this.customAmount !== null) {
      return this.customAmount;
    }
    if (!this.statistics) return 0;
    
    switch (this.revenueFilter) {
      case 'today':
        return this.statistics.todayAmount;
      case 'month':
        return this.statistics.thisMonthAmount;
      case 'total':
        return this.statistics.totalAmount;
      default:
        return 0;
    }
  }
}
