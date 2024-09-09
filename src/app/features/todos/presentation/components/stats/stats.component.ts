import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, ellipseOutline } from 'ionicons/icons';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { StatsService, StatsStatus } from './stats.service';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsDropdownComponent } from 'src/app/core/settings/settings-dropdown.component';

@Component({
  selector: 'app-stats',
  template: `
      <div *ngIf="statsService.status() === StatsStatus.loading">
        <ion-spinner></ion-spinner>
      </div>

      <div *ngIf="statsService.status() === StatsStatus.success">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item >
                <ion-icon name="ellipse-outline" slot="start"></ion-icon>
                <ion-label>{{ 'STATS.ACTIVE_TODOS' | translate }}</ion-label>
                <ion-note slot="end">{{ statsService.activeTodos() }}</ion-note>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
                <ion-label>{{ 'STATS.COMPLETED_TODOS' | translate }}</ion-label>
                <ion-note slot="end">{{ statsService.completedTodos() }}</ion-note>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <div *ngIf="statsService.status() === StatsStatus.failure">
        <ion-text color="danger">
          <p>{{ 'STATS.ERROR' | translate }}</p>
        </ion-text>
      </div>
  `,
  standalone: true,
  imports: [IonicModule, TranslateModule, NgIf, SettingsDropdownComponent]
})
export class StatsComponent implements OnInit {
  StatsStatus = StatsStatus;

  constructor(public statsService: StatsService) {
    addIcons({ ellipseOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.statsService.loadStats();
  }
}
