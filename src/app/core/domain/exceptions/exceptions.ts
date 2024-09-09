/**
 * Custom exception thrown when a category is not found.
 */
export class CategoryNotFoundException extends Error {
  constructor() {
    super('Category not found');
    this.name = 'CategoryNotFoundException';
  }
}

/**
 * Custom exception thrown when a todo is not found.
 */
export class TodoNotFoundException extends Error {
  constructor() {
    super('Todo not found');
    this.name = 'TodoNotFoundException';
  }
}
