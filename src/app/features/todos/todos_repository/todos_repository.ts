import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodosApi } from '../todosAPI/todos_api';
import { Todo } from '../todosAPI/models/todo';

/**
 * A repository that handles `todo` related requests.
 */
@Injectable({
  providedIn: 'root'
})
export class TodosRepository {
  constructor(private todosApi: TodosApi) {}

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
  saveTodo(todo: Todo): Promise<void> {
    return this.todosApi.saveTodo(todo);
  }

  /**
   * Deletes the todo with the given id.
   *
   * If no todo with the given id exists, a TodoNotFoundException is thrown.
   */
  deleteTodo(id: string): Promise<void> {
    return this.todosApi.deleteTodo(id);
  }

  /**
   * Deletes all completed todos.
   *
   * Returns the number of deleted todos.
   */
  clearCompleted(): Promise<number> {
    return this.todosApi.clearCompleted();
  }

  /**
   * Sets the isCompleted state of all todos to the given value.
   *
   * Returns the number of updated todos.
   */
  completeAll(isCompleted: boolean): Promise<number> {
    return this.todosApi.completeAll(isCompleted);
  }
}
