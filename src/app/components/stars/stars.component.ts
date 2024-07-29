import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.scss',
})
export class StarsComponent {
  @Input() starCount: number = 5;
  @Input() rating: number = 0;
  @Input() name: string = 'rating';
  @Input() label: string = '';

  @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  stars: number[] = [];

  ngOnInit(): void {
    this.stars = Array.from({ length: this.starCount }, (_, i) => i + 1);
  }

  setRating(value: number) {
    this.rating = value;
    this.ratingChange.emit(this.rating);
  }

  getChecked(index: number, half: number): boolean {
    const starValue = index + half;
    return this.rating === starValue;
  }
}
