  import { Component, OnInit } from '@angular/core';
  import { IonicModule } from '@ionic/angular';
  import { NgIf } from '@angular/common';
  import { TranslateModule } from '@ngx-translate/core';
  import { StatsService, StatsStatus } from './stats.service';
  import { SettingsDropdownComponent } from "../../../../core/settings/settings-dropdown.component";
  import { addIcons } from 'ionicons';
  import { checkmarkCircleOutline, ellipseOutline } from 'ionicons/icons';

  @Component({
    selector: 'app-stats',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'STATS.TITLE' | translate }}</ion-title>
        <app-settings-dropdown slot="end"></app-settings-dropdown>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ng-container *ngIf="statsService.status() === StatsStatus.loading">
        <ion-spinner></ion-spinner>
      </ng-container>

      <ng-container *ngIf="statsService.status() === StatsStatus.success">
        <ion-list>
          <ion-item>
            <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
            <ion-label>{{ 'STATS.COMPLETED_TODOS' | translate }}</ion-label>
            <ion-note slot="end">{{ statsService.completedTodos() }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-icon name="ellipse-outline" slot="start"></ion-icon>
            <ion-label>{{ 'STATS.ACTIVE_TODOS' | translate }}</ion-label>
            <ion-note slot="end">{{ statsService.activeTodos() }}</ion-note>
          </ion-item>
        </ion-list>
      </ng-container>

      <ng-container *ngIf="statsService.status() === StatsStatus.failure">
        <ion-text color="danger">
          <p>{{ 'STATS.ERROR' | translate }}</p>
        </ion-text>
      </ng-container>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, TranslateModule, NgIf, SettingsDropdownComponent]
})
export class StatsPage implements OnInit {
  StatsStatus = StatsStatus;

  constructor(public statsService: StatsService) {
    addIcons({ellipseOutline, checkmarkCircleOutline});
  }

  ngOnInit() {
    this.statsService.loadStats();
  }
}
