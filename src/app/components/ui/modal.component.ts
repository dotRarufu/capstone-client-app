import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [],
  template: `
    <dialog
      [id]="inputId"
      (close)="closed.emit()"
      class="modal modal-bottom sm2:modal-middle"
    >
      <form
        method="dialog"
        class="modal-box flex w-full justify-center rounded-[3px] bg-transparent p-0  sm2:max-w-[712px] sm2:rounded-[3px]"
      >
        <ng-content />
      </form>
    </dialog>
  `,
})
export class ModalComponent {
  @Output() closed = new EventEmitter();
  @Input() inputId? = 'Modal';
}
