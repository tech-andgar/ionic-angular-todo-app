import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EditTodoService, EditTodoStatus } from './edit-todo.service';
import { addIcons } from 'ionicons';
import { checkmark, trash } from 'ionicons/icons';
import { Todo } from '../../todosAPI/models/todo';

@Component({
  selector: 'app-edit-todo',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ (editTodoService.isNewTodo() ? 'EDIT_TODO.ADD_TITLE' : 'EDIT_TODO.EDIT_TITLE') | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form>
        <ion-item>
          <ion-label position="floating">{{ 'EDIT_TODO.TITLE_LABEL' | translate }}</ion-label>
          <ion-input
          #input
          autofocus="true"
          [disabled]="editTodoService.isLoadingOrSuccess()"
          [value]="editTodoService.title()"
          (ionChange)="onTitleChange($event)"
          maxlength="50"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">{{ 'EDIT_TODO.DESCRIPTION_LABEL' | translate }}</ion-label>
          <ion-textarea
          [disabled]="editTodoService.isLoadingOrSuccess()"
          [value]="editTodoService.description()"
          (ionChange)="onDescriptionChange($event)"
          maxlength="300"
          rows="7"
          ></ion-textarea>
        </ion-item>

        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-button
              *ngIf="!editTodoService.isNewTodo()"
              expand="block"
              type="submit"
              [disabled]="editTodoService.isLoadingOrSuccess()"
              class="ion-margin-top"
              color="danger"
              (click)="onDelete()"
              >
              <ion-spinner *ngIf="editTodoService.status() === EditTodoStatus.loading"></ion-spinner>
              <ion-icon *ngIf="editTodoService.status() !== EditTodoStatus.loading" name="trash"></ion-icon>
              {{ 'COMMON.DELETE' | translate }}
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button
            expand="block"
            type="submit"
            [disabled]="editTodoService.isLoadingOrSuccess()"
            class="ion-margin-top"
            (click)="onSubmit()"
            >
            <ion-spinner *ngIf="editTodoService.status() === EditTodoStatus.loading"></ion-spinner>
            <ion-icon *ngIf="editTodoService.status() !== EditTodoStatus.loading" name="checkmark"></ion-icon>
            {{ 'EDIT_TODO.SAVE_BUTTON' | translate }}
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>
  </form>
</ion-content>
`,
  standalone: true,
  imports: [IonicModule, FormsModule, TranslateModule, NgIf]
})
export class EditTodoPage implements OnInit, AfterViewInit {
  EditTodoStatus = EditTodoStatus;
  todo: Todo | undefined;

  constructor(
    public editTodoService: EditTodoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    addIcons({ checkmark, trash });
  }
  @ViewChild('input') input!: IonInput;

  ngAfterViewInit(): void {
    this.input.setFocus();
  }

  async ngOnInit() {
    const todoId = this.route.snapshot.paramMap.get('id');
    if (todoId) {
      this.todo = await this.editTodoService.getTodoById(todoId);
      this.editTodoService.initializeTodo(this.todo);
    } else {
      this.editTodoService.initializeTodo(null);
    }
  }

  onTitleChange(event: CustomEvent) {
    this.editTodoService.setTitle(event.detail.value);
  }

  onDescriptionChange(event: CustomEvent) {
    this.editTodoService.setDescription(event.detail.value);
  }

  async onDelete() {
    let result = await this.editTodoService.deleteTodo(this.todo!);
    if (result && this.editTodoService.status() === EditTodoStatus.success) {
      this.router.navigate(['/todos']);
    }
  }

  async onSubmit() {
    await this.editTodoService.submit();
    if (this.editTodoService.status() === EditTodoStatus.success) {
      this.router.navigate(['/todos']);
    }
  }
}
