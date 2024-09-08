import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../../domain/models/todo.model';
import { lastValueFrom } from 'rxjs';
import { TodosRepositoryImpl } from '../../data/repository/todos-repository-impl';

export enum EditTodoStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class EditTodoService {
  private statusSignal = signal<EditTodoStatus>(EditTodoStatus.initial);
  status = this.statusSignal.asReadonly();

  private initialTodoSignal = signal<Todo | null>(null);
  initialTodo = this.initialTodoSignal.asReadonly();

  private titleSignal = signal<string>('');
  title = this.titleSignal.asReadonly();

  private descriptionSignal = signal<string>('');
  description = this.descriptionSignal.asReadonly();

  private categoryIdSignal = signal<string>('');
  categoryId = this.descriptionSignal.asReadonly();

  isNewTodo = computed(() => this.initialTodoSignal() === null);
  isLoadingOrSuccess = computed(() =>
    [EditTodoStatus.loading, EditTodoStatus.success].includes(this.statusSignal())
  );

  constructor(private todosRepository: TodosRepositoryImpl) { }

  initializeTodo(todo: Todo | null) {
    this.statusSignal.set(EditTodoStatus.initial);
    this.initialTodoSignal.set(todo);
    this.titleSignal.set(todo?.title ?? '');
    this.descriptionSignal.set(todo?.description ?? '');
  }

  setTitle(title: string) {
    this.titleSignal.set(title);
  }

  setDescription(description: string) {
    this.descriptionSignal.set(description);
  }

  async getTodoById(todoId: string): Promise<Todo> {
    return await lastValueFrom(this.todosRepository.getTodoById(todoId));
  }

  async submit() {
    this.statusSignal.set(EditTodoStatus.loading);
    const todo = this.initialTodoSignal() ?? new Todo('',{id: undefined, description: undefined, isCompleted: false, categoryId: undefined});
    const updatedTodo = todo.copyWith({
      id: todo.id,
      title: this.titleSignal(),
      description: this.descriptionSignal(),
      isCompleted: todo.isCompleted,
      categoryId: this.categoryIdSignal()
    });

    try {
      await this.todosRepository.saveTodo(updatedTodo);
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
