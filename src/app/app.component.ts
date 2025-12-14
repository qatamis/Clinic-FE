import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, SidenavComponent, MatSnackBarModule, MatMenuModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Clinic';
  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '200px');

  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout=()=>{
    this.authService.logout();
    this.matSnackBar.open('Logout Success', 'Close', {
      duration: 500,
      horizontalPosition: 'center'
    })
    this.router.navigate(['/login'])
  }
}
