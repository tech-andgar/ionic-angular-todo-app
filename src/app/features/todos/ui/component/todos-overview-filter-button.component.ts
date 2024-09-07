import { Component } from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { TodosOverviewService, TodosViewFilter } from '../todos-overview/todos-overview.service';
import { addIcons } from 'ionicons';
import { filter } from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';

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
      header: await this.translate.get('TODOS_OVERVIEW.FILTER.TITLE').toPromise(),
      buttons: [
        {
          text: await this.translate.get('TODOS_OVERVIEW.FILTER.ALL').toPromise(),
          handler: () => this.todosService.setFilter(TodosViewFilter.all)
        },
        {
          text: await this.translate.get('TODOS_OVERVIEW.FILTER.ACTIVE').toPromise(),
          handler: () => this.todosService.setFilter(TodosViewFilter.activeOnly)
        },
        {
          text: await this.translate.get('TODOS_OVERVIEW.FILTER.COMPLETED').toPromise(),
          handler: () => this.todosService.setFilter(TodosViewFilter.completedOnly)
        },
        {
          text: await this.translate.get('COMMON.CANCEL').toPromise(),
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }
}
