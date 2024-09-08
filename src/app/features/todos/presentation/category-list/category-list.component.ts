import { Category } from '../../domain/models/category.model';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/features/task/data/services/data.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { SettingsDropdownComponent } from 'src/app/core/settings/settings-dropdown.component';

@Component({
  selector: 'app-category-list',
  template: `
  <ion-header>
      <ion-toolbar>
        <ion-title>Categories</ion-title>
        <app-settings-dropdown slot="end"></app-settings-dropdown>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input [(ngModel)]="newCategoryName" placeholder="New category"></ion-input>
          <ion-button (click)="addCategory()">Add</ion-button>
        </ion-item>
        <ion-item *ngFor="let category of categories$ | async">
          <ion-label>{{ category.name }}</ion-label>
          <ion-button (click)="editCategory(category)">Edit</ion-button>
          <ion-button (click)="deleteCategory(category.id)">Delete</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SettingsDropdownComponent],
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<Category[]> = of([]);
  newCategoryName = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.categories$ = this.dataService.getCategories();
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: this.newCategoryName.trim(),
      };
      this.dataService.addCategory(newCategory).subscribe();
      this.newCategoryName = '';
    }
  }

  editCategory(category: Category) {
    // TODO: this should be done
    // Implement edit logic (e.g., open a modal for editing)
    console.log('Edit category:', category);
  }

  deleteCategory(categoryId: string) {
    this.dataService.deleteCategory(categoryId).subscribe();
  }
}
