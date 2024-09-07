import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../../todosAPI/models/todo';
import { TodosRepository } from '../../todos_repository/todos_repository';

export enum EditTodoStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class EditTodoService {
  private statusSignal = signal<EditTodoStatus>(EditTodoStatus.initial);
  private initialTodoSignal = signal<Todo | null>(null);
  private titleSignal = signal<string>('');
  private descriptionSignal = signal<string>('');

  status = this.statusSignal.asReadonly();
  initialTodo = this.initialTodoSignal.asReadonly();
  title = this.titleSignal.asReadonly();
  description = this.descriptionSignal.asReadonly();

  isNewTodo = computed(() => this.initialTodoSignal() === null);
  isLoadingOrSuccess = computed(() =>
    [EditTodoStatus.loading, EditTodoStatus.success].includes(this.statusSignal())
  );

  constructor(private todosRepository: TodosRepository) { }

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

  async submit() {
    this.statusSignal.set(EditTodoStatus.loading);
    const todo = this.initialTodoSignal() ?? new Todo('');
    const updatedTodo = todo.copyWith({
      id: todo.id,
      title: this.titleSignal(),
      description: this.descriptionSignal(),
      isCompleted: todo.isCompleted
    });

    try {
      await this.todosRepository.saveTodo(updatedTodo);
      this.statusSignal.set(EditTodoStatus.success);
    } catch (e) {
      this.statusSignal.set(EditTodoStatus.failure);
    }
  }
}
