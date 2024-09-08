import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodosApi } from '../../../domain/infrastructure/todos_api';
import { Todo } from '../../../../../core/domain/model/todo.model';
import { TodoNotFoundException } from 'src/app/core/domain/exceptions/exceptions';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageTodosApi implements TodosApi {
  private static readonly kTodosCollectionKey = '__todos_collection_key__';
  private todoStreamController: BehaviorSubject<Todo[]>;

  constructor() {
    this.todoStreamController = new BehaviorSubject<Todo[]>([]);
    this.init();
  }

  private init(): void {
    const todosJson = localStorage.getItem(LocalStorageTodosApi.kTodosCollectionKey);
    if (todosJson) {
      const todos: Todo[] = JSON.parse(todosJson).map((jsonMap: any) =>
        new Todo(jsonMap.title, {id: jsonMap.id, description: jsonMap.description, isCompleted: jsonMap.isCompleted, categoryId: jsonMap.categoryId})
      );
      this.todoStreamController.next(todos);
    } else {
      this.todoStreamController.next([]);
    }
  }

  getTodos(): Observable<Todo[]> {
    return this.todoStreamController.asObservable();
  }

  getTodo(todoId: string): Observable<Todo> {
    return new Observable<Todo>(subscriber => {
      const todo = this.todoStreamController.value.find(t => t.id === todoId);
      if (todo) {
        subscriber.next(todo);
        subscriber.complete();
      } else {
        subscriber.error(new TodoNotFoundException());
      }
    });
  }

  async saveTodo(todo: Todo): Promise<void> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === todo.id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }

    this.todoStreamController.next(todos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
  }

  async saveTodoAt(todo: Todo, index: number | null = null): Promise<void> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === todo.id);

    if (todoIndex >= 0) {
      todos[todoIndex] = todo;  // Update existing todo
    } else if (index !== null) {
      todos.splice(index, 0, todo);  // Insert at the original index
    } else {
      todos.push(todo);  // Add new todo at the end (for new todos)
    }

    this.todoStreamController.next(todos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
  }

  async deleteTodo(id: string): Promise<void> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.todoStreamController.next(todos);
      localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
    }
  }

  async clearCompleted(): Promise<number> {
    const todos = [...this.todoStreamController.value];
    const completedTodosAmount = todos.filter(t => t.isCompleted).length;
    const newTodos = todos.filter(t => !t.isCompleted);
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  async completeAll(isCompleted: boolean): Promise<number> {
    const todos = [...this.todoStreamController.value];
    const changedTodosAmount = todos.filter(t => t.isCompleted !== isCompleted).length;
    const newTodos = todos.map(todo => todo.copyWith({ isCompleted }));
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return changedTodosAmount;
  }

  async close(): Promise<void> {
    this.todoStreamController.complete();
  }
}
