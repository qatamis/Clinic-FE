import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatInputModule, RouterLink, MatSnackBarModule, MatIconModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  translate = inject(TranslateService);
  hide = true;
  form!:FormGroup;
  fb = inject(FormBuilder);

  Login(){
    this.authService.Login(this.form.value).subscribe({
      next: (response) => {
        this.translate.get('auth.loginSuccess').subscribe((message) => {
          this.translate.get('common.close').subscribe((closeText) => {
            this.matSnackBar.open(response.message || message, closeText, {
              duration: 5000,
              horizontalPosition: 'center',
            });
          });
        });
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.translate.get('auth.invalidCredentials').subscribe((message) => {
          this.translate.get('common.close').subscribe((closeText) => {
            this.matSnackBar.open(error.error?.message || message, closeText, {
              duration: 5000,
              horizontalPosition: 'center',
            });
          });
        });
      }
    })
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    })
  }
}
