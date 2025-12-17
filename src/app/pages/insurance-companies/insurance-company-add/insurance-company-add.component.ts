import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InsuranceCompaniesService } from '../../../services/insurance-companies.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-insurance-company-add',
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
  templateUrl: './insurance-company-add.component.html',
  styleUrl: './insurance-company-add.component.css'
})
export class InsuranceCompanyAddComponent {
  newCompany: any = {
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

  constructor(private router: Router) {}

  onSubmit() {
    this.companiesService.createInsuranceCompany(this.newCompany).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.router.navigate(['/insurance-companies']);
        } else {
          this.translate.get('insurance.errorCreating').subscribe((message) => {
            alert(response.message || message);
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.translate.get('insurance.errorCreating').subscribe((message) => {
          alert(err.error?.message || message);
        });
      }
    });
  }
}

