import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, catchError, filter, map, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
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
      *ngIf="{
        adviser: adviser$ | async,
        adviserProjectRole: adviserProjectRole$ | async
      } as observables"
    >
      <div
        class="p-[16px] text-primary-content bg-primary"
   
      >
        {{ task.title }}
      </div>
      <div
        class="flex items-center justify-end gap-[8px] px-[16px] py-[8px] text-base text-base-content"
      >
        <span class="text-[12px] text-base-content/70"> BY </span>

        {{ observables.adviser?.name || 'Unnamed' }}

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
  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  @Input() setActiveTask: null | ((t: Task) => void) = null;
  @Input({ required: true }) task!: Task;

  projectId = Number(this.route.parent!.snapshot.url[0].path);
  taskSubject = new BehaviorSubject<Task | null>(null);
  adviser$ = this.taskSubject.pipe(
    filter(isNotNull),
    switchMap((task) => this.authService.getUserData(this.task.assigner_id))
  );
  adviserProjectRole$ = this.adviser$.pipe(
    switchMap((u) =>
      this.projectService.getAdviserProjectRole(this.projectId, u.uid)
    ),
    tap(v => console.log("v:", v)),
    catchError((err) => '')
  );

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['task'].currentValue;

    this.taskSubject.next(changed);
  }
}
