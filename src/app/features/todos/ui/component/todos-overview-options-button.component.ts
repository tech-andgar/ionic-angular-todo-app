import { Component } from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { TodosOverviewService } from '../todos-overview/todos-overview.service';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-todos-overview-options-button',
  template: `
    <ion-button (click)="presentOptionsActionSheet()">
      <ion-icon name="ellipsis-vertical"></ion-icon>
    </ion-button>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class TodosOverviewOptionsButtonComponent {
  constructor(
    private todosService: TodosOverviewService,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService
  ) {
    addIcons({ellipsisVertical});
  }

  async presentOptionsActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: await this.translate.get('TODOS_OVERVIEW.OPTIONS.TITLE').toPromise(),
      buttons: [
        {
          text: await this.translate.get('TODOS_OVERVIEW.OPTIONS.TOGGLE_ALL').toPromise(),
          handler: () => this.todosService.toggleAll()
        },
        {
          text: await this.translate.get('TODOS_OVERVIEW.OPTIONS.CLEAR_COMPLETED').toPromise(),
          handler: () => this.todosService.clearCompleted()
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
