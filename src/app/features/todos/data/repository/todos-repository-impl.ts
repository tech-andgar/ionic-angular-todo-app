import { computed, Injectable, signal } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, Observable } from 'rxjs';
import { TodosRepository } from '../../domain/repository/todos_repository';
import { Todo } from '../../../../core/domain/model/todo.model';
import { TodosApi } from '../../domain/infrastructure/todos_api';

export const enum TodosViewFilter { all, activeOnly, completedOnly }

/**
 * A repository that handles `todo` related requests.
 */
@Injectable({
  providedIn: 'root'
})
export class TodosRepositoryImpl implements TodosRepository {
  todosSignal = signal<Todo[]>([]);
  todos = this.todosSignal.asReadonly();

  filterSignal = signal<TodosViewFilter>(TodosViewFilter.all);
  filter = this.filterSignal.asReadonly();

  lastDeletedTodoSignal = signal<Todo | null>(null);
  lastDeletedTodo = this.lastDeletedTodoSignal.asReadonly();

  lastDeletedTodoIndexSignal = signal<number | null>(null);

  private selectedCategorySignal = signal<string | null>(null);
  selectedCategory = this.selectedCategorySignal.asReadonly();

  setSelectedCategory(categoryId: string | null) {
    this.selectedCategorySignal.set(categoryId);
  }

  filteredTodos = computed(() => {
    return this.todos().filter(todo => {
      const matchesFilter = this.filter() === TodosViewFilter.all ||
        (this.filter() === TodosViewFilter.activeOnly && !todo.isCompleted) ||
        (this.filter() === TodosViewFilter.completedOnly && todo.isCompleted);

      const matchesCategory = this.selectedCategory() === null || this.getCategoryId(todo) === this.selectedCategory();

      return matchesFilter && matchesCategory;
    });
  });

  private getCategoryId(todo: Todo): string | undefined {
    return typeof todo.category === 'string'
      ? todo.category!
      : todo.category?.id!;
  }

  constructor(
    private todosApi: TodosApi,
    private alertController: AlertController,
    private toastController: ToastController,
    private translateService: TranslateService
  ) { }

  async loadTodos() {
    this.getTodos().subscribe(todos => {
      this.todosSignal.set(todos);
    });
  }

  /**
   * Provides an Observable of all todos.
   */
  getTodos(): Observable<Todo[]> {
    return this.todosApi.getTodos();
  }

  getTodoById(todoId: string): Observable<Todo> {
    return this.todosApi.getTodo(todoId);
  }

  /**
   * Saves a todo.
   *
   * If a todo with the same id already exists, it will be replaced.
   */
  saveTodo(todo: Todo): Promise<boolean> {
    return lastValueFrom(this.todosApi.saveTodo(todo));
  }

  /**
   * Saves a todo with the position index
   *
   * If a todo with the same id already exists, it will be replaced.
   */
  saveTodoAt(todo: Todo, index: number | null = null): Promise<boolean> {
    return lastValueFrom(this.todosApi.saveTodoAt(todo, index));
  }

  /**
   * Deletes the todo with the given id.
   *
   * If no todo with the given id exists, a TodoNotFoundException is thrown.
   */
  async deleteTodo(todo: Todo): Promise<boolean> {
    if (await this.confirmDelete(todo)) {
      const todos = this.todos();
      const index = todos.findIndex(t => t.id === todo.id);

      if (index !== -1) {
        this.lastDeletedTodoSignal.set(todo);
        this.lastDeletedTodoIndexSignal.set(index);
        await this.todosApi.deleteTodo(todo.id);
        this.removeTodoFromList(todo);
        this.showUndoToast(todo);
      }
      return true;
    } else {
      return false;
    }
  }

  private removeTodoFromList(todoToRemove: Todo) {
    this.todosSignal.update(todos =>
      todos.filter(todo => todo.id !== todoToRemove.id)
    );
  }

  private async confirmDelete(todo: Todo): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: await lastValueFrom(this.translateService.get('COMMON.DELETE_CONFIRM_HEADER')),
        message: await lastValueFrom(this.translateService.get('TODO_LIST_ITEM.DELETE_CONFIRM_MESSAGE', { title: todo?.title ?? '' })),
        buttons: [
          {
            text: await lastValueFrom(this.translateService.get('COMMON.CANCEL')),
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: await lastValueFrom(this.translateService.get('COMMON.DELETE')),
            role: 'destructive',
            handler: async () => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }


  private async showUndoToast(deletedTodo: Todo) {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translateService.get('TODOS_OVERVIEW.TODO_DELETED_MESSAGE', { title: deletedTodo.title })),
      duration: 4000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: await lastValueFrom(this.translateService.get('COMMON.UNDO')),
          handler: () => {
            this.undoDeleteTodo();
          }
        }
      ]
    });
    await toast.present();
  }

  private async undoDeleteTodo() {
    const todo = this.lastDeletedTodo();
    const index = this.lastDeletedTodoIndexSignal();

    if (todo && index !== null) {
      await this.saveTodoAt(todo, index);
      this.lastDeletedTodoSignal.set(null);
      this.lastDeletedTodoIndexSignal.set(null);
      this.addTodoToListAt(todo, index);
    }
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

  /**
   * Deletes all completed todos.
   *
   * Returns the number of deleted todos.
   */
  clearCompleted(): Promise<number> {
    return lastValueFrom(this.todosApi.clearCompleted());
  }

  /**
   * Sets the isCompleted state of all todos to the given value.
   *
   * Returns the number of updated todos.
   */
  completeAll(isCompleted: boolean): Promise<number> {
    return lastValueFrom(this.todosApi.completeAll(isCompleted));
  }

  setFilter(filter: TodosViewFilter) {
    this.filterSignal.set(filter);
  }

  async toggleAll() {
    const areAllCompleted = this.todos().every(todo => todo.isCompleted);
    await this.completeAll(!areAllCompleted);
    await this.loadTodos();
  }

  async toggleTodoCompletion(todo: Todo, isCompleted: boolean) {
    const newTodo = todo.copyWith({ isCompleted });
    await this.saveTodo(newTodo);
    this.updateTodoInList(newTodo);
  }

  private updateTodoInList(updatedTodo: Todo) {
    this.todosSignal.update(todos =>
      todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
    );
  }

}
