import { CategoriesRepositoryImpl } from 'src/app/features/categories/data/repository/categories-repository-impl';
import { Category } from 'src/app/core/domain/model/category.model';
import { Injectable, signal, computed } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Todo } from '../../../../core/domain/model/todo.model';
import { TodosRepositoryImpl } from '../../data/repository/todos-repository-impl';
import { TranslateService } from '@ngx-translate/core';

export enum EditTodoStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class EditTodoService {
  private statusSignal = signal<EditTodoStatus>(EditTodoStatus.initial);
  status = this.statusSignal.asReadonly();

  private initialTodoSignal = signal<Todo | null>(null);
  initialTodo = this.initialTodoSignal.asReadonly();

  private title: string = '';
  private description: string = '';
  private category: Category | null = null;

  categoriesSignal = signal<Category[]>([]);
  categories = computed(() => this.categoriesSignal());

  isNewTodo = computed(() => this.initialTodoSignal() === null);
  isLoadingOrSuccess = computed(() =>
    [EditTodoStatus.loading, EditTodoStatus.success].includes(this.statusSignal())
  );

  constructor(
    private todosRepository: TodosRepositoryImpl,
    private categoriesRepository: CategoriesRepositoryImpl,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {
    this.categoriesRepository.getCategories().subscribe((data) => {
      this.categoriesSignal.update(() => data);
    });
  }

  initializeTodo(todo: Todo | null) {
    this.statusSignal.set(EditTodoStatus.initial);
    this.initialTodoSignal.set(todo);
    if (todo) {
      this.category = todo.category;
      this.description = todo.description;
      this.title = todo.title;
    }
  }

  setTitle(title: string) {
    this.title = title
  }

  setDescription(description: string) {
    this.description = description
  }

  setCategory(category: Category) {
    this.category = category
  }

  async getTodoById(todoId: string): Promise<Todo> {
    return await lastValueFrom(this.todosRepository.getTodoById(todoId));
  }

  async submit() {
    this.statusSignal.set(EditTodoStatus.loading);
    if (!this.title || !this.description || !this.category) {
      this.statusSignal.set(EditTodoStatus.failure);
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateService.get('COMMON.MISSING_FIELDS_MESSAGE')),
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const todo = Todo.create({
      id: this.initialTodo()?.id ?? null,
      title: this.title,
      description: this.description,
      category: this.category
    });

    try {
      await this.todosRepository.saveTodo(todo);
      this.statusSignal.set(EditTodoStatus.success);
    } catch (e) {
      this.statusSignal.set(EditTodoStatus.failure);
    }
  }

  async deleteTodo(todo: Todo): Promise<boolean> {
    this.statusSignal.set(EditTodoStatus.loading);
    const result = await this.todosRepository.deleteTodo(todo);
    if (result) {
      this.statusSignal.set(EditTodoStatus.success);
    } else {
      this.statusSignal.set(EditTodoStatus.initial);
    }
    return result;
  }
}
