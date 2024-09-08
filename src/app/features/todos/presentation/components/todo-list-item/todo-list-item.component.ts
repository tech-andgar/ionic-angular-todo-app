import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Todo } from '../../../../../core/domain/model/todo.model';
import { TodoListItemService } from './todo-list-item.service';
import { addIcons } from 'ionicons';
import { chevronForward, trash } from 'ionicons/icons';
import { CategoryBadgeComponent } from "../category-badge.component";

@Component({
  selector: 'app-todo-list-item',
  template: `
    <ion-item-sliding>
      <ion-item (click)="edit.emit()">
        <ion-checkbox slot="start" [checked]="todo.isCompleted" (ionChange)="toggleCompleted.emit($event.detail.checked)"></ion-checkbox>
        <ion-label [class.completed]="todo.isCompleted">
          <ion-grid>
            <ion-row>
              <ion-col>
                <h2>{{ todo.title }}</h2>
                <p>{{ todo.description }}</p>
              </ion-col>
              <ion-col size="auto" >
                <ion-row>
                  <app-category-badge [categoryName]="categoryName" [categoryId]="getCategoryId()!"></app-category-badge>
                </ion-row>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-label>
        <ion-icon name="chevron-forward" slot="end"></ion-icon>
      </ion-item>
      <ion-item-options side="end">
        <ion-item-option color="danger" (click)="delete.emit()" [attr.aria-label]="'TODO_LIST_ITEM.DELETE' | translate">
          <ion-icon name="trash" slot="icon-only" [style.color]="'#fff'" aria-hidden="true"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  standalone: true,
  imports: [IonicModule, TranslateModule, AsyncPipe, NgIf, CategoryBadgeComponent],
})
export class TodoListItemComponent implements OnInit {
  constructor(public todoListItemService: TodoListItemService) {
    addIcons({ chevronForward, trash });
  }
  @Input() todo!: Todo;
  @Output() toggleCompleted = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  categoryName: string = 'Loading...';

  ngOnInit() {
    this.categoryName = this.todoListItemService.getCategoryName(this.getCategoryId());
  }

  getCategoryId(): string | undefined {
    return typeof this.todo.category === 'string'
      ? this.todo.category!
      : this.todo.category?.id!;
  }
}
