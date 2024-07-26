import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() type!: string;
  @Input() placeholder!: string;

  constructor() {
    if (this.type === undefined || this.type == '') this.type = 'default';
    if (this.placeholder === undefined || this.placeholder == '') this.placeholder = 'Buscar...';
  }
}
