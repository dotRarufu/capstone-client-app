import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { BehaviorSubject, filter, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Task } from 'src/app/types/collection';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'TaskCard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      onclick="taskDetails.showModal()"
      class="cursor-pointer rounded-[3px]  border border-base-content/50 bg-base-100 shadow-md"
    >
      <div class="bg-secondary p-[16px] text-secondary-content">
        {{ task.title }}
      </div>
      <div
        class="flex items-center justify-end gap-[8px] px-[16px] py-[8px] text-base text-base-content"
      >
        <span class="text-[12px] text-base-content/70"> BY </span>

        {{ adviserName$ | async }}

        <img
          class="avatar w-8 rounded-full bg-primary/50"
          src="https://api.multiavatar.com/test.png"
          alt="assigner profile"
          srcset=""
        />
      </div>
    </div>
  `,
})
export class TaskCardComponent implements OnChanges {
  @Input() setActiveTask: null | ((t: Task) => void) = null;
  @Input({ required: true }) task!: Task;

  taskSubject = new BehaviorSubject<Task | null>(null);

  authService = inject(AuthService);
  adviserName$ = this.taskSubject.pipe(
    filter(isNotNull),
    switchMap((task) => this.authService.getUserData(this.task.assigner_id)),
    map((adviser) => adviser.name || 'unnamed')
  );

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['task'].currentValue;

    this.taskSubject.next(changed);
  }
}
