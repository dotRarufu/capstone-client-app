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
import { ImgFallbackModule } from 'ngx-img-fallback';

@Component({
  selector: 'TaskCard',
  standalone: true,
  imports: [CommonModule, ImgFallbackModule],
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
          class="avatar w-8 rounded-full bg-primary/50 aspect-square"
          [src]="observables.adviser?.profileUrl"
          [src-fallback]="'https://api.multiavatar.com/' + (observables.adviser?.name || 'unnamed') + '.png'"
          alt="assigner profile"
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
    switchMap((uid) => this.authService.getUserProfile(this.task.assigner_id)),
    map((user) => {
      const { avatar_last_update, avatar } = user;
      const time = avatar_last_update;

      if (time === null) {
    
        return {...user, profileUrl: avatar};
      }
      const base = avatar.slice(0, avatar.indexOf('.png'));
      const newUrl = `${base}-t-${time}.png`;

      return {...user, profileUrl: newUrl};
    })
  );
  adviserProjectRole$ = this.adviser$.pipe(
    switchMap((u) =>
      this.projectService.getAdviserProjectRole(this.projectId, u.uid)
    ),
    catchError((err) => '')
  );

  ngOnChanges(changes: SimpleChanges): void {
    const changed = changes['task'].currentValue;

    this.taskSubject.next(changed);
  }
}
