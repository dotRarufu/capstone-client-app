import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `<input
    [type]="type"
    [placeholder]="placeholder"
    class=" input w-full border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:opacity-70 placeholder:text-base-content rounded-[3px]"
  /> `,
})
export class InputComponent {
  @Input() placeholder?: string;
  @Input() type?: string;
}
