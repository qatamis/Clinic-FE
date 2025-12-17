import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'
import { MatDividerModule } from '@angular/material/divider'
import { AuthService } from './services/auth.service';
import { TranslationService } from './services/translation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, SidenavComponent, MatSnackBarModule, MatMenuModule, MatDividerModule, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Clinic';
  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '80px' : '280px');
  
  ngOnInit() {
    // Initialize translation service
    this.translationService.setLanguage(this.translationService.getCurrentLanguage());
    
    // Update sidenav width CSS variable for RTL support
    this.updateSidenavWidth();
  }
  
  private updateSidenavWidth() {
    document.documentElement.style.setProperty('--sidenav-width', this.sidenavWidth());
  }

  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router);
  translationService = inject(TranslationService);
  translate = inject(TranslateService);

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout=()=>{
    this.authService.logout();
    this.translate.get('auth.logoutSuccess').subscribe((message) => {
      this.translate.get('common.close').subscribe((closeText) => {
        this.matSnackBar.open(message, closeText, {
          duration: 500,
          horizontalPosition: 'center'
        });
      });
    });
    this.router.navigate(['/login'])
  }
}
