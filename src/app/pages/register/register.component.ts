import { Component, Inject, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select'
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatInputModule, MatIconModule, MatSelectModule, MatSnackBarModule, AsyncPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  matSnackbar = inject(MatSnackBar);
  roles$!:Observable<Role[]>;
  fb = inject(FormBuilder);
  registerForm!: FormGroup;
  router = Inject(Router);
  confirmPasswordHide: boolean = true;
  passwordHide:boolean = true;
  errors!: ValidationError[];

  register(){
    this.authService.Register(this.registerForm.value).subscribe({
      next: (response) =>{
        console.log(response);
        
        this.matSnackbar.open(response.message || 'Registration successful', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login'])
      },
      error:(err:HttpErrorResponse)=>{
        if(err!.status=== 400){
          this.errors = err!.error;
          this.matSnackbar.open('Validations Error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center'
          })
        }
      },
      complete:()=>{
        console.log('Register Success');
        
      }
    })
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]],
      fullName:['', [Validators.required]],
      roles:[''],
      confirmPassword:['', [Validators.required]]
    },
  {
    validator: this.passwordMatchValidator,
  });

    this.roles$ = this.roleService.getRoles();
  }

  private passwordMatchValidator(control: AbstractControl):{[key:string]:Boolean} | null{
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password != confirmPassword){
      return {passwordMismatch:true}
    }
    return null;
  }
}
