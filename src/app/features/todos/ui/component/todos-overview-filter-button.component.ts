import { Component } from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { TodosOverviewService, TodosViewFilter } from '../todos-overview/todos-overview.service';
import { addIcons } from 'ionicons';
import { filter } from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-todos-overview-filter-button',
  template: `
    <ion-button (click)="presentFilterActionSheet()">
      <ion-icon name="filter"></ion-icon>
    </ion-button>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class TodosOverviewFilterButtonComponent {
  constructor(
    private todosService: TodosOverviewService,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService
  ) {
    addIcons({ filter });
  }

  async presentFilterActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: await lastValueFrom(this.translate.get('TODOS_OVERVIEW.FILTER.TITLE')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('TODOS_OVERVIEW.FILTER.ALL')),
          handler: () => this.todosService.setFilter(TodosViewFilter.all)
        },
        {
          text: await lastValueFrom(this.translate.get('TODOS_OVERVIEW.FILTER.ACTIVE')),
          handler: () => this.todosService.setFilter(TodosViewFilter.activeOnly)
        },
        {
          text: await lastValueFrom(this.translate.get('TODOS_OVERVIEW.FILTER.COMPLETED')),
          handler: () => this.todosService.setFilter(TodosViewFilter.completedOnly)
        },
        {
          text: await lastValueFrom(this.translate.get('COMMON.CANCEL')),
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
