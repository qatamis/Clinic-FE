import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly defaultLang = 'en';
  private readonly storageKey = 'app-language';
  
  currentLang = signal<string>(this.defaultLang);
  isRtl = signal<boolean>(false);

  constructor(private translate: TranslateService) {
    // Set default language
    this.translate.setDefaultLang(this.defaultLang);
    
    // Get saved language or use browser language
    const savedLang = localStorage.getItem(this.storageKey);
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (browserLang === 'ar' ? 'ar' : this.defaultLang);
    
    // Load translations
    this.translate.use(initialLang).subscribe({
      next: () => {
        this.currentLang.set(initialLang);
        this.isRtl.set(initialLang === 'ar');
        this.updateDocumentSettings(initialLang);
      },
      error: (err) => {
        console.error('Error loading translations:', err);
        // Fallback to default
        this.translate.use(this.defaultLang).subscribe(() => {
          this.currentLang.set(this.defaultLang);
          this.isRtl.set(false);
          this.updateDocumentSettings(this.defaultLang);
        });
      }
    });
  }

  setLanguage(lang: string): void {
    this.translate.use(lang).subscribe({
      next: () => {
        this.currentLang.set(lang);
        this.isRtl.set(lang === 'ar');
        localStorage.setItem(this.storageKey, lang);
        this.updateDocumentSettings(lang);
      },
      error: (err) => {
        console.error(`Error loading language ${lang}:`, err);
        // Fallback to default
        this.translate.use(this.defaultLang).subscribe(() => {
          this.currentLang.set(this.defaultLang);
          this.isRtl.set(false);
          this.updateDocumentSettings(this.defaultLang);
        });
      }
    });
  }

  private updateDocumentSettings(lang: string): void {
    // Update document direction and language
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update body class for RTL styling
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('ltr', lang !== 'ar');
  }

  getCurrentLanguage(): string {
    return this.currentLang();
  }

  isRtlMode(): boolean {
    return this.isRtl();
  }
}

