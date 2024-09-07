import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TodosOverviewService, TodosOverviewStatus } from './todos-overview.service';
import { SettingsDropdownComponent } from "../../../../core/settings/settings-dropdown.component";
import { Todo } from '../../todosAPI/models/todo';
import { TodoListItemComponent } from '../component/todo-list-item.component';
import { TodosOverviewFilterButtonComponent } from '../component/todos-overview-filter-button.component';
import { TodosOverviewOptionsButtonComponent } from '../component/todos-overview-options-button.component';

@Component({
  selector: 'app-todos-overview',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'TODOS_OVERVIEW.TITLE' | translate }}</ion-title>
        <ion-buttons slot="end">
          <app-todos-overview-filter-button></app-todos-overview-filter-button>
          <app-todos-overview-options-button></app-todos-overview-options-button>
        </ion-buttons>
        <app-settings-dropdown slot="end"></app-settings-dropdown>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ng-container *ngIf="todosService.todos().length === 0">
        <div *ngIf="todosService.status() === TodosOverviewStatus.loading" class="center">
          <ion-spinner></ion-spinner>
        </div>
        <div *ngIf="todosService.status() === TodosOverviewStatus.success" class="center">
          {{ 'TODOS_OVERVIEW.EMPTY_TEXT' | translate }}
        </div>
      </ng-container>

      <ion-list>
        <app-todo-list-item
          *ngFor="let todo of todosService.filteredTodos()"
          [todo]="todo"
          (toggleCompleted)="todosService.toggleTodoCompletion(todo, $event)"
          (delete)="todosService.deleteTodo(todo)"
          (edit)="navigateToEditTodo(todo)"
        ></app-todo-list-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [
    IonicModule,
    AsyncPipe,
    NgFor,
    NgIf,
    TranslateModule,
    TodoListItemComponent,
    TodosOverviewFilterButtonComponent,
    TodosOverviewOptionsButtonComponent,
    SettingsDropdownComponent
  ]
})
export class TodosOverviewPage implements OnInit {
  TodosOverviewStatus = TodosOverviewStatus;

  constructor(
    public todosService: TodosOverviewService,
    private router: Router
  ) {}

  ngOnInit() {
    this.todosService.loadTodos();
  }

  navigateToEditTodo(todo: Todo) {
    this.router.navigate(['/edit-todo', todo.id]);
  }
}
