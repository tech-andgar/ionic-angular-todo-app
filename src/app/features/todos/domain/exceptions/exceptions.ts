/**
 * Custom exception thrown when a todo is not found.
 */
export class TodoNotFoundException extends Error {
  constructor() {
    super('Todo not found');
    this.name = 'TodoNotFoundException';
  }
}
