import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `<input
    [type]="type"
    [placeholder]="placeholder"
    class="h-[35px] w-full border border-[#E0E4E4] px-3 py-2 placeholder:text-base placeholder:opacity-75"
  /> `,
})
export class InputComponent {
  @Input() placeholder?: string;
  @Input() type?: string;
}
