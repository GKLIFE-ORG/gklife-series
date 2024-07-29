import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type!: string;
  @Input() styles!: string;

  @Input() placeholder!: string;
  @Input() iconLeft!: string;
  @Input() iconRight!: string;
  @Input() label!: string;
  
  value: any;
  inputId: string = 'input-' + Math.random().toString(36).substr(2, 9);

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    if (this.type === undefined || this.type == '') this.type = 'text';
    if (this.styles === undefined || this.styles == '') this.styles = 'default';
    
    if (this.placeholder === undefined || this.placeholder == '') this.placeholder = '...';
    if (this.iconLeft === undefined) this.iconLeft = '';
    if (this.iconRight === undefined) this.iconRight = '';
    if (this.label === undefined) this.label = '';
  }

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
