import { Component, computed, Input, input, signal, effect, inject, OnInit } from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule, TranslateModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
  sidenavCollapsed = signal(false);
  authService = inject(AuthService);
  translate = inject(TranslateService);
  
  @Input() set collapsed(val: boolean){
    this.sidenavCollapsed.set(val);
  }

  ngOnInit() {
    // Ensure translations are loaded
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('app-language') || 'en';
    // Load translations
    this.translate.use(savedLang).subscribe({
      next: (translations) => {
        console.log('Translations loaded:', translations);
        // Force change detection
      },
      error: (err) => {
        console.error('Error loading translations:', err);
        // Fallback to English
        this.translate.use('en').subscribe(() => {
          console.log('Fallback to English loaded');
        });
      }
    });
  }

  allMenuItems: MenuItem[] = [
    {
      icon:'dashboard',
      label:'menu.dashboard',
      route:'dashboard',
    },
    {
      icon:'personal_injury',
      label:'menu.patients',
      route:'patients',
    },
    {
      icon:'medical_services',
      label:'menu.doctors',
      route:'doctors',
    },
    {
      icon:'business',
      label:'menu.insuranceCompanies',
      route:'insurance-companies',
    },
    {
      icon:'assessment',
      label:'menu.insuranceReports',
      route:'insurance-reports',
    },
    {
      icon:'event',
      label:'menu.appointments',
      route:'appointments',
    }
  ];

  menuItems = computed(() => {
    // Depend on token signal to trigger recomputation when token changes
    const token = this.authService.getTokenSignal()();
    
    const userDetail = this.authService.getUserDetail();
    if (!userDetail) {
      return this.allMenuItems;
    }
    
    const roles = userDetail.roles && Array.isArray(userDetail.roles) 
      ? userDetail.roles 
      : (userDetail.roles ? [userDetail.roles] : []);
    
    const isDoctor = roles.includes('Doctor');
    const isAdmin = roles.includes('Admin');
    
    // Filter menu items based on role
    return this.allMenuItems.filter(item => {
      // Doctors can't see Doctors menu
      if (isDoctor && item.route === 'doctors') {
        return false;
      }
      // Only Admins can see Insurance Companies and Reports menus
      if ((item.route === 'insurance-companies' || item.route === 'insurance-reports') && !isAdmin) {
        return false;
      }
      return true;
    });
  });

  // profilePicSize = computed(() => this.sidenavCollapsed() ? '32' : '100');
}
