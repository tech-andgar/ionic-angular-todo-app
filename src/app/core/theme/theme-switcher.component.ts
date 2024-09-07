import { Component } from '@angular/core';
import { IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  template: `
  <ion-item lines="none">
      <ion-label>{{ 'SETTINGS.DARK_MODE' | translate }}</ion-label>
      <ion-toggle slot="end" (ionChange)="themeService.toggleTheme($event)" [checked]="themeService.isDarkMode()"></ion-toggle>
  </ion-item>
  `,
  standalone: true,
  imports: [ IonItem, IonLabel, IonToggle, TranslateModule]
})
export class ThemeSwitcherComponent {
  constructor(public themeService: ThemeService){}
}
