import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal',
  template: `
    <!-- <input
      type="checkbox"
      id="app-modal"
      class="modal-toggle"
      (change)="handleChange($event)"
    />
    <label
      for="app-modal"
      class="modal modal-bottom cursor-pointer sm2:modal-middle"
    >
      <label
        class="modal-box relative rounded-[3px] border-2 border-red-500 bg-base-100/0 p-0"
        for=""
      >
        <ng-content></ng-content>
      </label>
    </label> -->

    <input type="checkbox" [id]="inputId" class="modal-toggle" (change)="handleChange($event)" />

    <label [for]="inputId" class="modal modal-bottom sm2:modal-middle">
      <label for="" class="modal-box w-fit flex justify-center max-w-5xl sm2:max-w-5xl rounded-[3px] sm2:w-fit sm2:rounded-[3px] p-0 bg-transparent">
        
        <ng-content></ng-content>

      </label>
    </label>
  `,
})
export class ModalComponent {
  @Output() checkboxChanged: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() inputId? = 'app-modal';

  handleChange(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).checked;
    this.checkboxChanged.emit(value);

    console.log('checked property change', JSON.stringify(e));
  }
}
