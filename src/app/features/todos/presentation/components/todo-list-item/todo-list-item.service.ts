import { Injectable } from '@angular/core';
import { Category } from '../../../../../core/domain/model/category.model';
import { CategoriesRepositoryImpl } from '../../../../categories/data/repository/categories-repository-impl';

@Injectable({ providedIn: 'root' })
export class TodoListItemService {
  private categories: Category[] = [];

  constructor(private categoriesRepository: CategoriesRepositoryImpl) {
    this.loadCategories();
  }


  private loadCategories() {
    this.categoriesRepository.getCategories().subscribe(
      categories => this.categories = categories,
      error => console.error('Error loading categories:', error)
    );
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return 'No Category';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category!.name! : 'Unknown Category';
  }
}
