import { Injectable, computed, signal } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Todo } from '../../todosAPI/models/todo';
import { TodosRepository } from '../../todos_repository/todos_repository';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';

export enum TodosOverviewStatus { initial, loading, success, failure }
export enum TodosViewFilter { all, activeOnly, completedOnly }

@Injectable({ providedIn: 'root' })
export class TodosOverviewService {
  private statusSignal = signal<TodosOverviewStatus>(TodosOverviewStatus.initial);
  private todosSignal = signal<Todo[]>([]);
  private filterSignal = signal<TodosViewFilter>(TodosViewFilter.all);
  private lastDeletedTodoSignal = signal<Todo | null>(null);
  private lastDeletedTodoIndexSignal = signal<number | null>(null);

  status = this.statusSignal.asReadonly();
  todos = this.todosSignal.asReadonly();
  filter = this.filterSignal.asReadonly();
  lastDeletedTodo = this.lastDeletedTodoSignal.asReadonly();

  filteredTodos = computed(() => {
    const filter = this.filter();
    const todos = this.todos();
    return todos.filter(todo => {
      switch (filter) {
        case TodosViewFilter.all: return true;
        case TodosViewFilter.activeOnly: return !todo.isCompleted;
        case TodosViewFilter.completedOnly: return todo.isCompleted;
      }
    });
  });

  constructor(
    private todosRepository: TodosRepository,
    private toastController: ToastController,
    private alertController: AlertController,
    private translateService: TranslateService
  ) { }

  async loadTodos() {
    this.statusSignal.set(TodosOverviewStatus.loading);
    try {
      this.todosRepository.getTodos().subscribe(todos => {
        this.todosSignal.set(todos);
        this.statusSignal.set(TodosOverviewStatus.success);
      });
    } catch (error) {
      this.statusSignal.set(TodosOverviewStatus.failure);
    }
  }

  async toggleTodoCompletion(todo: Todo, isCompleted: boolean) {
    const newTodo = todo.copyWith({ isCompleted });
    await this.todosRepository.saveTodo(newTodo);
    this.updateTodoInList(newTodo);
  }


  async confirmDelete(todo: Todo) {
    const alert = await this.alertController.create({
      header: await lastValueFrom(this.translateService.get('TODO_LIST_ITEM.DELETE_CONFIRM_HEADER')),
      message: await lastValueFrom(this.translateService.get('TODO_LIST_ITEM.DELETE_CONFIRM_MESSAGE', { title: todo.title })),
      buttons: [
        {
          text: await lastValueFrom(this.translateService.get('COMMON.CANCEL')),
          role: 'cancel',
        },
        {
          text: await lastValueFrom(this.translateService.get('COMMON.DELETE')),
          role: 'destructive',
          handler: () => {
            this.deleteTodo(todo);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteTodo(todo: Todo) {
    const todos = this.todos();
    const index = todos.findIndex(t => t.id === todo.id);

    if (index !== -1) {
      this.lastDeletedTodoSignal.set(todo);
      this.lastDeletedTodoIndexSignal.set(index);
      await this.todosRepository.deleteTodo(todo.id);
      this.removeTodoFromList(todo);
      this.showUndoToast(todo);
    }
  }

  async undoDeleteTodo() {
    const todo = this.lastDeletedTodo();
    const index = this.lastDeletedTodoIndexSignal();

    if (todo && index !== null) {
      await this.todosRepository.saveTodoAt(todo, index);
      this.lastDeletedTodoSignal.set(null);
      this.lastDeletedTodoIndexSignal.set(null);
      this.addTodoToListAt(todo, index);
    }
  }

  setFilter(filter: TodosViewFilter) {
    this.filterSignal.set(filter);
  }

  async toggleAll() {
    const areAllCompleted = this.todos().every(todo => todo.isCompleted);
    await this.todosRepository.completeAll(!areAllCompleted);
    await this.loadTodos();
  }

  async clearCompleted() {
    await this.todosRepository.clearCompleted();
    await this.loadTodos();
  }

  private async showUndoToast(deletedTodo: Todo) {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translateService.get('TODOS_OVERVIEW.TODO_DELETED_MESSAGE', { title: deletedTodo.title })),
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: await lastValueFrom(this.translateService.get('TODOS_OVERVIEW.UNDO_DELETION_BUTTON')),
          handler: () => {
            this.undoDeleteTodo();
          }
        }
      ]
    });
    await toast.present();
  }

  private updateTodoInList(updatedTodo: Todo) {
    this.todosSignal.update(todos =>
      todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
    );
  }

  private removeTodoFromList(todoToRemove: Todo) {
    this.todosSignal.update(todos =>
      todos.filter(todo => todo.id !== todoToRemove.id)
    );
  }

  private addTodoToListAt(todoToAdd: Todo, index: number) {
    this.todosSignal.update(todos => {
      if (!todos.some(t => t.id === todoToAdd.id)) {
        const newTodos = [...todos];
        newTodos.splice(index, 0, todoToAdd);
        return newTodos;
      }
      return todos;
    });
  }
}
