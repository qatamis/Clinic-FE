import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatSnackBarModule, TranslateModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  matSnackBar = inject(MatSnackBar);
  translate = inject(TranslateService);
  accountDetail$ = this.authService.getDetail();
  
  ngOnInit() {
    this.accountDetail$.subscribe({
      next: (user) => {
        console.log('User details:', user);
        console.log('User roles:', user.roles);
      }
    });
  }
  
  resetPasswordForm!: FormGroup;
  showPasswordReset = false;
  currentPasswordHide = true;
  newPasswordHide = true;
  confirmPasswordHide = true;

  constructor() {
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  togglePasswordReset() {
    this.showPasswordReset = !this.showPasswordReset;
    if (!this.showPasswordReset) {
      this.resetPasswordForm.reset();
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword } = this.resetPasswordForm.value;
    this.authService.resetPassword(currentPassword, newPassword).subscribe({
      next: (response) => {
        this.translate.get('account.passwordResetSuccess').subscribe((message) => {
          this.translate.get('common.close').subscribe((closeText) => {
            this.matSnackBar.open(response.message || message, closeText, {
              duration: 5000,
              horizontalPosition: 'center'
            });
          });
        });
        this.resetPasswordForm.reset();
        this.showPasswordReset = false;
      },
      error: (error) => {
        this.translate.get('account.passwordResetFailed').subscribe((message) => {
          this.translate.get('common.close').subscribe((closeText) => {
            this.matSnackBar.open(error.error?.message || message, closeText, {
              duration: 5000,
              horizontalPosition: 'center'
            });
          });
        });
      }
    });
  }

  private passwordMatchValidator(control: any): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
