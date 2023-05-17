import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button
    class="btn-primary btn w-full  rounded-[3px]  text-center text-base "
  >
    <ng-content></ng-content>
  </button> `,
})
export class ButtonComponent {}
