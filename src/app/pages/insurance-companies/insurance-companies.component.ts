import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { InsuranceCompany } from '../../interfaces/insurance-company';
import { InsuranceCompaniesService } from '../../services/insurance-companies.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insurance-companies',
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule, MatDividerModule, TranslateModule],
  templateUrl: './insurance-companies.component.html',
  styleUrl: './insurance-companies.component.css'
})
export class InsuranceCompaniesComponent implements OnInit {
  companies: InsuranceCompany[] = [];
  companiesService = inject(InsuranceCompaniesService);
  translate = inject(TranslateService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companiesService.getAllInsuranceCompanies().subscribe({
      next: (response) => {
        this.companies = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteCompany(id: number) {
    this.translate.get('insurance.deleteConfirm').subscribe((message) => {
      const isDeleteConfirmed = confirm(message);
      if (isDeleteConfirmed) {
        this.companiesService.deleteInsuranceCompany(id).subscribe({
          next: () => {
            this.loadCompanies();
          },
          error: (err) => {
            console.log(err);
            this.translate.get('insurance.deleteError').subscribe((errorMsg) => {
              alert(errorMsg);
            });
          }
        });
      }
    });
  }

  toggleStatus(company: InsuranceCompany) {
    const confirmKey = company.isActive ? 'insurance.deactivateConfirm' : 'insurance.activateConfirm';
    this.translate.get(confirmKey).subscribe((message) => {
      const isConfirmed = confirm(message);
      if (isConfirmed) {
        const updatedCompany = { ...company, isActive: !company.isActive };
        this.companiesService.updateInsuranceCompany(company.id, updatedCompany).subscribe({
          next: () => {
            company.isActive = !company.isActive;
          },
          error: (err) => {
            console.log(err);
            this.translate.get('insurance.updateError').subscribe((errorMsg) => {
              alert(errorMsg);
            });
          }
        });
      }
    });
  }
}

