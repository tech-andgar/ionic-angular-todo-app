import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SettingsDropdownComponent } from "../../../../core/settings/settings-dropdown.component";

@Component({
  selector: 'app-stats',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Stats</ion-title>
        <app-settings-dropdown slot="end"></app-settings-dropdown>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Your stats will appear here</h2>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, SettingsDropdownComponent]
})
export class StatsPage {}
