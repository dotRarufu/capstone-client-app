import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';

@Component({
  standalone: true,
  imports: [CommonModule, FeatherIconsModule, ReactiveFormsModule],
  selector: 'outcome',
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between ">
        <h1 class="text-[20px] text-base-content">{{ heading }}</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <ng-container *ngIf="!hideInput">
        <div class="flex items-center justify-between">
          <input
            type="text"
            placeholder="Implemented time travel algorithm"
            class="bg-base input join-item w-full rounded-[3px] border-[1px] px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-secondary focus:outline-0 "
            [formControl]="input"
          />
          <label
            tabindex="0"
            (click)="handleAddItem()"
            class="btn-ghost btn-sm join-item btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
            [class.btn-disabled]="input.invalid"
            [class.cursor-not-allowed]="input.invalid"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </label>
        </div>
      </ng-container>

      <ul
        *ngIf="data.length !== 0; else empty"
        class="flex h-fit  flex-col gap-2"
      >
        <li
          *ngFor="let item of data || []"
          class="flex items-center justify-between rounded-[3px] border border-base-content/20 px-4 py-2 text-base text-base-content "
        >
          <p class="line-clamp-1 w-full">
            {{ item }}
          </p>
          <label
            *ngIf="!hideInput"
            (click)="handleDeleteItem(item)"
            tabindex="0"
            class="btn-ghost btn-sm btn rounded-[3px]"
          >
            <i-feather class="text-base-content/70" name="minus" />
          </label>
        </li>
      </ul>

      <ng-template #empty>
        <div class="flex w-full items-center gap-2 py-2">
          <div class=" flex h-[20px] shrink-0 grow-0 basis-[20px]">
            <i-feather
              class="text-base-content/50"
              style="width: 20px; height: 20px;"
              [name]="hideInput ? 'slash' : 'list'"
            />
          </div>

          <p class="text-base text-base-content/50">
            {{ hideInput ? 'Nothing to show' : 'Add something first' }}
          </p>
        </div>
      </ng-template>
    </div>
  `,
})
export class OutcomeComponent {
  input = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  // todo: rename to isDisplay
  @Input() hideInput? = false;
  @Input() heading = '';
  @Input({ required: true }) data!: string[];
  @Output() addItem = new EventEmitter<string>();
  @Output() deleteItem = new EventEmitter<string>();

  toastr = inject(ToastrService);
  a = console.log("renders outcome")
  handleAddItem() {
    if (this.input.invalid) {
      this.toastr.error('Input cannot be empty');

      return;
    }

    this.addItem.emit(this.input.value);
    this.input.reset();
  }

  handleDeleteItem(item: string) {
    if (this.deleteItem === undefined) return;

    this.deleteItem.emit(item);
  }
}
