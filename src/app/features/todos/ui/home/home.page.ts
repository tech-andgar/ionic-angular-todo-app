import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, listOutline, statsChartOutline } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="todos" routerLink="/todos" routerLinkActive="tab-selected">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>{{ "HOME.TASKS" | translate }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="categories" routerLink="/categories" routerLinkActive="tab-selected">
          <ion-icon name="folder-outline"></ion-icon>
          <ion-label>{{ "HOME.CATEGORIES" | translate }}</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="stats" routerLink="/stats" routerLinkActive="tab-selected">
          <ion-icon name="stats-chart-outline"></ion-icon>
          <ion-label>{{ "HOME.STATS" | translate }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button routerLink="/edit-todo">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, TranslateModule]
})
export class HomePage {
  constructor(
  ) {
    addIcons({ listOutline, statsChartOutline, add });
  }
}
