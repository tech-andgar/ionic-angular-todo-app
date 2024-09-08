import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../../domain/models/todo.model';
import { addIcons } from 'ionicons';
import { chevronForward, trash } from 'ionicons/icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-todo-list-item',
  template: `
    <ion-item-sliding>
      <ion-item (click)="edit.emit()">
        <ion-checkbox slot="start" [checked]="todo.isCompleted" (ionChange)="toggleCompleted.emit($event.detail.checked)"></ion-checkbox>
        <ion-label [class.completed]="todo.isCompleted">
          <h2>{{ todo.title }}</h2>
          <p>{{ todo.description }}</p>
        </ion-label>
        <ion-icon name="chevron-forward" slot="end"></ion-icon>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" (click)="this.delete.emit()" [attr.aria-label]="'TODO_LIST_ITEM.DELETE' | translate">
          <ion-icon name="delete-task" slot="icon-only" name="trash" [style.color]="'#fff'" aria-hidden="true"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  standalone: true,
  imports: [IonicModule, TranslateModule],
})
export class TodoListItemComponent {
  constructor() {
    addIcons({chevronForward, trash});
  }

  @Input() todo!: Todo;
  @Output() toggleCompleted = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}
