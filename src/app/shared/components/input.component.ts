import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `<input
    [type]="type"
    [placeholder]="placeholder"
    class="h-[35px] w-full border border-[#E0E4E4] px-3 py-2 placeholder:text-base placeholder:text-[#808080]"
  /> `,
})
export class InputComponent {
  @Input() placeholder?: string;
  @Input() type?: string;
}
