import { CommonModule } from '@angular/common';
import { Component, Input, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';

@Component({
  standalone: true,
  imports: [CommonModule, FeatherIconsModule, FormsModule],
  selector: 'outcome',
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between ">
        <h1 class="text-[20px] text-base-content"> {{heading}}</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <ng-container *ngIf="!hideInput">
        <div class="flex items-center justify-between">
          <input
            type="text"
            placeholder="Implemented time travel algorithm"
            class="bg-base input join-item w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-base-content/50 px-3 py-2 text-base text-base-content placeholder:text-base placeholder:text-base-content placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
            [(ngModel)]="inputField"
          />
          <label
            tabindex="0"
            (click)="addItem()"
            class="btn-ghost btn-sm join-item btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </label>
        </div>
      </ng-container>

      <ul class="flex h-fit  flex-col gap-2">
        <li
          *ngFor="let item of dataSignal?.() || data || []"
          class="flex items-center justify-between rounded-[3px] border border-base-content/20 px-4 py-2 text-base text-base-content "
        >
          <p class="line-clamp-1 w-full">
            {{ item }}
          </p>
          <label
            (click)="deleteItem(item)"
            tabindex="0"
            class="btn-ghost btn-sm btn rounded-[3px]"
          >
            <i-feather class="text-base-content/70" name="minus" />
          </label>
        </li>
      </ul>
    </div>
  `,
})
export class OutcomeComponent {
  inputField = '';
  @Input() hideInput? = false;
  @Input() dataSignal: WritableSignal<string[]> | null = null;
  @Input() data?: string[] = [];
  @Input() heading = "";

  addItem() {
    this.dataSignal?.update((old) =>  [...old, this.inputField]);
    this.inputField = '';
  }

  deleteItem(item: string) {
    this.dataSignal?.update((old) => old.filter((c) => c !== item));
  }
}
