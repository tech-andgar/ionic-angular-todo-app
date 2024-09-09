import { Component, ViewChild } from '@angular/core';
import { IonButton, IonIcon, IonPopover } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { chevronDownOutline, languageOutline, moonOutline, sunnyOutline, settingsOutline } from 'ionicons/icons';
import { LanguageSwitcherComponent } from "../language/language-switcher.component";
import { ThemeSwitcherComponent } from "../theme/theme-switcher.component";

@Component({
  selector: 'app-settings-dropdown',
  template: `
    <ion-button fill="clear" (click)="presentPopover($event)">
      <ion-icon name="settings-outline"></ion-icon>
    </ion-button>

    <ion-popover #popover [isOpen]="isOpen" (didDismiss)="isOpen = false">
      <ng-template>
        <div class="settings-dropdown">
          <div class="dropdown-section">
            <app-language-switcher slot="end"></app-language-switcher>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-section">
            <app-theme-switcher slot="end"></app-theme-switcher>
          </div>
        </div>
      </ng-template>
    </ion-popover>
  `,
  styles: [`
    .dropdown-divider {
      height: 1px;
      background-color: var(--ion-color-light);
      margin: 8px 0;
    }`
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonPopover, TranslateModule, LanguageSwitcherComponent, ThemeSwitcherComponent]
})
export class SettingsDropdownComponent {
  @ViewChild('popover') popover!: IonPopover;
  isOpen = false;

  constructor() {
    addIcons({ chevronDownOutline, languageOutline, moonOutline, sunnyOutline, settingsOutline });
  }

  async presentPopover(e: Event) {
    this.isOpen = true;
    this.popover.event = e;
  }
}
