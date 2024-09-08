import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-category-badge',
  template: `
    <ion-badge [style.background-color]="backgroundColor">{{ categoryName }}</ion-badge>
  `,
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CategoryBadgeComponent implements OnInit {
  @Input() categoryName: string = '';
  @Input() categoryId: string = '';
  backgroundColor: string = '';

  ngOnInit() {
    this.backgroundColor = this.getColorForCategory(this.categoryId || this.categoryName);
  }

  private getColorForCategory(identifier: string): string {
    // Generate a hash code from the string
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use the hash to generate an HSL color
    // This ensures a good distribution of colors
    const hue = Math.abs(hash % 360);
    const saturation = 70 + (hash % 30); // Between 70-100%
    const lightness = 45 + (hash % 10);  // Between 45-55%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
