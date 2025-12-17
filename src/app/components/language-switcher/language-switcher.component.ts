import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-language-switcher',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="langMenu" class="text-white" [title]="translationService.currentLang() === 'en' ? 'English' : 'العربية'">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #langMenu="matMenu" class="language-menu">
      <button mat-menu-item (click)="switchLanguage('en')" [class.active]="translationService.currentLang() === 'en'" class="lang-menu-item">
        <span>🇬🇧 English</span>
        @if(translationService.currentLang() === 'en') {
          <mat-icon class="ml-auto">check</mat-icon>
        }
      </button>
      <button mat-menu-item (click)="switchLanguage('ar')" [class.active]="translationService.currentLang() === 'ar'" class="lang-menu-item">
        <span>🇸🇦 العربية</span>
        @if(translationService.currentLang() === 'ar') {
          <mat-icon class="ml-auto">check</mat-icon>
        }
      </button>
    </mat-menu>
  `,
  styles: [`
    .active {
      font-weight: bold;
    }
    .ml-auto {
      margin-left: auto;
    }
    .lang-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }
  `]
})
export class LanguageSwitcherComponent {
  translationService = inject(TranslationService);

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
  }
}

