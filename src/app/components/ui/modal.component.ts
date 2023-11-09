import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [],
  template: `
    <dialog
      #dialogElem
      [id]="inputId"
      (close)="closed.emit()"
      class="modal modal-bottom sm2:modal-middle"
    >
      <div
        class="modal-box flex w-full justify-center rounded-[3px] bg-transparent p-0  sm2:max-w-[712px] sm2:rounded-[3px]"
      >
        <ng-content />
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  `,
})
export class ModalComponent {
  @Output() closed = new EventEmitter();
  @Input() inputId? = 'Modal';
  @ViewChildren('dialogElem') dialog!: QueryList<ElementRef<HTMLDialogElement>>;

  close() {
    if (this.dialog) {
      this.dialog.first.nativeElement.close();
    }
  }
}
