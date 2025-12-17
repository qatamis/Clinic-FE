import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InsuranceCompaniesService } from '../../../services/insurance-companies.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insurance-company-edit',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    TranslateModule
  ],
  templateUrl: './insurance-company-edit.component.html',
  styleUrl: './insurance-company-edit.component.css'
})
export class InsuranceCompanyEditComponent implements OnInit {
  companyId: number = 0;
  company: any = {
    name: '',
    code: '',
    phoneNumber: '',
    email: '',
    address: '',
    contactPerson: '',
    isActive: true,
    notes: ''
  };

  companiesService = inject(InsuranceCompaniesService);
  translate = inject(TranslateService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (id) {
          this.companyId = parseInt(id, 10);
          this.loadCompany();
        }
      }
    });
  }

  loadCompany() {
    this.companiesService.getInsuranceCompanyById(this.companyId).subscribe({
      next: (response) => {
        this.company = {
          name: response.name,
          code: response.code || '',
          phoneNumber: response.phoneNumber || '',
          email: response.email || '',
          address: response.address || '',
          contactPerson: response.contactPerson || '',
          isActive: response.isActive,
          notes: response.notes || ''
        };
      },
      error: (err) => {
        console.log(err);
        this.translate.get('insurance.errorLoading').subscribe((message) => {
          alert(message);
        });
      }
    });
  }

  onSubmit() {
    this.companiesService.updateInsuranceCompany(this.companyId, this.company).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.router.navigate(['/insurance-companies']);
        } else {
          this.translate.get('insurance.errorUpdating').subscribe((message) => {
            alert(response.message || message);
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.translate.get('insurance.errorUpdating').subscribe((message) => {
          alert(err.error?.message || message);
        });
      }
    });
  }
}

