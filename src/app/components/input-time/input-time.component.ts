import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-time',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-time.component.html',
  styleUrl: './input-time.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeComponent),
      multi: true
    }
  ]
})
export class InputTimeComponent {
  @Input() placeholder: string = '--:--:--';
  @Input() iconLeft: string = '';
  @Input() iconRight: string = '';
  @Input() label: string = '';
  @Input() tabIndex: number = 0;
  @Input() min: any;
  @Input() max: any;

  value: string = '';
  inputId: string = 'input-' + Math.random().toString(36).substr(2, 9);

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
