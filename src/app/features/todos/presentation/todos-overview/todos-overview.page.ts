import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SettingsDropdownComponent } from "../../../../core/settings/settings-dropdown.component";
import { StatsComponent } from '../components/stats/stats.component';
import { Todo } from '../../domain/models/todo.model';
import { TodoListItemComponent } from '../components/todo-list-item.component';
import { TodosOverviewFilterButtonComponent } from '../components/todos-overview-filter-button.component';
import { TodosOverviewOptionsButtonComponent } from '../components/todos-overview-options-button.component';
import { TodosOverviewService, TodosOverviewStatus } from './todos-overview.service';
import { TranslateModule } from '@ngx-translate/core';

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
      <app-stats></app-stats>
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
    SettingsDropdownComponent,
    StatsComponent
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
