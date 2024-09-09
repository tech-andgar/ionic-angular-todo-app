import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TodosOverviewService } from '../todos-overview/todos-overview.service';
import { CategoriesRepositoryImpl } from '../../../categories/data/repository/categories-repository-impl';
import { Category } from 'src/app/core/domain/model/category.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  template: `
    <ion-item>
      <ion-label>{{ 'TODOS_OVERVIEW.FILTER.BY_CATEGORY' | translate }}</ion-label>
      <ion-select [(ngModel)]="selectedCategoryId" (ionChange)="onCategoryChange()">
        <ion-select-option [value]="null">{{ 'TODOS_OVERVIEW.FILTER.ALL_CATEGORIES' | translate }}</ion-select-option>
        <ion-select-option *ngFor="let category of categories" [value]="category.id">
          {{ category.name }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  `,
  standalone: true,
  imports: [IonicModule, NgFor, TranslateModule, FormsModule]
})
export class CategoryFilterComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  constructor(
    private todosService: TodosOverviewService,
    private categoriesRepository: CategoriesRepositoryImpl
  ) {}

  ngOnInit() {
    this.categoriesRepository.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onCategoryChange() {
    this.todosService.setSelectedCategory(this.selectedCategoryId);
  }
}
