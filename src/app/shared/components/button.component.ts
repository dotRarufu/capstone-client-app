import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button
    class="btn-primary btn w-full h-[35px] rounded-[3px] p-2 text-center text-base "
  >
    <ng-content></ng-content>
  </button> `,
})
export class ButtonComponent {}
