/**
 * Custom exception thrown when a category is not found.
 */
export class CategoryNotFoundException extends Error {
  constructor() {
    super('Category not found');
    this.name = 'CategoryNotFoundException';
  }
}
