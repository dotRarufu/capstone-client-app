import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'Modal',
  template: `
    <!-- <input
      type="checkbox"
      [id]="inputId"
      class="modal-toggle"
      (change)="handleChange($event)"
    />

    <label [for]="inputId" class="modal modal-bottom sm2:modal-middle">
      <label
        for=""
        class="modal-box flex w-fit max-w-5xl justify-center rounded-[3px] bg-transparent p-0 sm2:w-fit sm2:max-w-5xl sm2:rounded-[3px]"
      >
        <ng-content />
      </label>
    </label> -->

    <dialog [id]="inputId" class="modal modal-bottom sm2:modal-middle">
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
  @Output() checkboxChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() inputId? = 'Modal';

  handleChange(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).checked;
    this.checkboxChanged.emit(value);
  }
}
