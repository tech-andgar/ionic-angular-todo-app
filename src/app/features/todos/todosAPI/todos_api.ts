import { Todo } from "./models/todo";

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export abstract class TodosApi {
  /**
   * Provides an Observable of all todos.
  */
 abstract getTodos(): Observable<Todo[]>;

 abstract getTodo(todoId: string): Observable<Todo>;

  /**
   * Saves a todo.
   * If a todo with the same id already exists, it will be replaced.
   */
  abstract saveTodo(todo: Todo): Promise<void>;

  /**
   * Deletes the todo with the given id.
   * If no todo with the given id exists, a TodoNotFoundException is thrown.
   */
  abstract deleteTodo(id: string): Promise<void>;

  /**
   * Deletes all completed todos.
   * Returns the number of deleted todos.
   */
  abstract clearCompleted(): Promise<number>;

  /**
   * Sets the isCompleted state of all todos to the given value.
   * Returns the number of updated todos.
   */
  abstract completeAll(isCompleted: boolean): Promise<number>;

  /**
   * Closes the client and frees up any resources.
   */
  abstract close(): Promise<void>;
}

export class TodoNotFoundException extends Error {
  constructor() {
    super('Todo not found');
    this.name = 'TodoNotFoundException';
  }
}
