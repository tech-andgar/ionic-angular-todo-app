import { Component, ViewChild } from '@angular/core';
import { IonButton, IonIcon, IonPopover } from '@ionic/angular/standalone';
import { NgClass, NgFor } from '@angular/common';
import { LanguageService } from './language.service';
import { Language } from './model/language.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="section-title">{{ 'SETTINGS.LANGUAGE' | translate }}</div>
    <div
      *ngFor="let lang of languageService.getSupportedLanguages()"
      (click)="selectLanguage(lang.code)"
      class="dropdown-item"
      [ngClass]="{'selected': lang.code === languageService.getCurrentLanguage()}"
    >
      {{ lang.name }}
    </div>
  `,
  styles: [
    `
    .section-title {
      padding: 8px 16px;
      font-weight: bold;
      color: var(--ion-color-medium);
    }
    .dropdown-item {
      padding: 8px 16px;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background-color: var(--ion-color-light);
    }
    .dropdown-item.selected {
      background-color: var(--ion-color-primary-tint);
      color: var(--ion-color-primary-contrast);
    }
    `
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonPopover, NgFor, NgClass, TranslateModule]
})
export class LanguageSwitcherComponent {
  @ViewChild('popover') popover!: IonPopover;
  isOpen = false;

  constructor(public languageService: LanguageService){}


  getCurrentLanguageName(): string {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.languageService.getSupportedLanguages().find(lang => lang.code === currentLang)?.name || '';
  }

  async presentPopover(e: Event) {
    this.isOpen = true;
    this.popover.event = e;
  }

  selectLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
    this.isOpen = false;
  }
}
