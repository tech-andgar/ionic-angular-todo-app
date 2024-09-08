import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../../../domain/models/todo.model';
import { TodosRepositoryImpl } from '../../../data/repository/todos-repository-impl';

export enum StatsStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statusSignal = signal<StatsStatus>(StatsStatus.initial);
  private todosSignal = signal<Todo[]>([]);

  status = this.statusSignal.asReadonly();
  todos = this.todosSignal.asReadonly();

  completedTodos = computed(() => this.todos().filter(todo => todo.isCompleted).length);
  activeTodos = computed(() => this.todos().filter(todo => !todo.isCompleted).length);

  constructor(private todosRepository: TodosRepositoryImpl) { }

  async loadStats() {
    this.statusSignal.set(StatsStatus.loading);
    try {
      this.todosRepository.getTodos().subscribe(todos => {
        this.todosSignal.set(todos);
        this.statusSignal.set(StatsStatus.success);
      });
    } catch (error) {
      this.statusSignal.set(StatsStatus.failure);
    }
  }
}
