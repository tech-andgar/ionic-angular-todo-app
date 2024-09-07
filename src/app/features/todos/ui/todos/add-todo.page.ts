import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-todo',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Todo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Add todo form will go here</h2>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class AddTodoPage {}
