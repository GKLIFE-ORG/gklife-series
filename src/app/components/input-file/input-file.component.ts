import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss'
})
export class InputFileComponent {
  @Input() label!: string;
  @Input() link!: string;
  @Input() tabIndex!: number;
  @Input() icon!: string;
  @Input() onlyIcon: boolean = false;

  @Input() imagePreview: string | null = null;
  @Output() fileSelected = new EventEmitter<File>();

  value: any;
  inputId: string = 'input-' + Math.random().toString(36).substr(2, 9);

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);

      // Si el archivo es una imagen, genera la vista previa
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    }
  }
}
