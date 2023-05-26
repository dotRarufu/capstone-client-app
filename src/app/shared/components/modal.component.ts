import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modal',
  template: `
    <input
      type="checkbox"
      id="app-modal"
      class="modal-toggle"
      (change)="handleChange($event)"
    />
    <label
      for="app-modal"
      class="modal modal-bottom cursor-pointer sm2:modal-middle"
    >
      <label class="modal-box relative p-0 rounded-[3px]" for="">
        <ng-content></ng-content>
      </label>
    </label>
  `
})
export class ModalComponent {
  @Output() checkboxChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleChange(e: Event) {
    const value = (e.currentTarget as HTMLInputElement).checked
    this.checkboxChanged.emit(value);

    console.log("checked property change", JSON.stringify(e))
  }
}
