import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { MilestoneData } from '../../../../types/collection';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { isNotNull } from 'src/app/utils/isNotNull';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'milestone-info',
  standalone: true,
  imports: [BreadcrumbModule, ReactiveFormsModule, CommonModule],
  template: `
    <div
      class=" flex flex-col gap-[16px] pt-[20px]"
      *ngIf="{
        isCapstoneAdviser: isCapstoneAdviser$ | async,
        role: role$ | async
      } as observables"
    >
      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Title</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <input
          type="text"
          [formControl]="title"
          (change)="this.newTitle$.next(this.title.value)"
          placeholder="Type here"
          class="input-bordered input input-md w-full rounded-[3px]  bg-base-300/80 focus:input-primary focus:outline-0 "
        />
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Description</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <textarea
          type="text"
          [formControl]="description"
          (change)="this.newDescription$.next(this.description.value)"
          placeholder="Type here"
          class="textarea-bordered textarea input-md h-[144px] w-full rounded-[3px] bg-base-300/80 focus:textarea-primary focus:outline-0"
        ></textarea>
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Due Date</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div>{{ milestoneDataSignal().dueDate }}</div>
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Mark as Achieved</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div class="flex gap-[8px]">
          <input
            type="checkbox"
            [checked]="isAchieved"
            [formControl]="isAchieved"
            (change)="this.newIsAchieved$.next(this.isAchieved.value)"
            class="toggle-success toggle"
          />
          <div class="text-base font-semibold">
            {{ isAchieved ? 'Achieved' : 'Pending' }}
          </div>
        </div>
      </div>

      <div
        *ngIf="observables.role === 'c'"
        class="flex items-center justify-between "
      >
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Delete</div>
          <div>
            Once you delete a milestone, there is no going back. Please be
            certain.
          </div>
        </div>
        <button
          (click)="handleDeleteMilestone()"
          class="btn-error btn-sm btn gap-2 rounded-[5px] hover:btn-error"
        >
          Delete
        </button>
      </div>
    </div>
  `,
})
export class MilestoneInfoComponent {
  breadcrumb = inject(BreadcrumbService);
  milestoneService = inject(MilestoneService);
  projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);
  authService = inject(AuthService);

  title = new FormControl('', { nonNullable: true });
  description = new FormControl('', { nonNullable: true });
  isAchieved = new FormControl(false, { nonNullable: true });

  role$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((u) =>
      this.projectService.getAdviserProjectRole(this.projectId, u.uid)
    )
  );

  projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
  isCapstoneAdviser$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((u) => {
      if (u.role_id === 0) return of('s');

      return this.projectService.getAdviserProjectRole(this.projectId, u.uid);
    }),
    tap((role) => {

      if (['c', 'ct'].includes(role)) return;


        this.isAchieved.disable();
        this.description.disable();
        this.title.disable();
      
    }),
    map((role) => ['c', 'ct'].includes(role))
  );

  newTitle$ = new Subject<string>();
  newDescription$ = new Subject<string>();
  newIsAchieved$ = new Subject<boolean>();

  newIsAchievedSubscription = this.newIsAchieved$
    .pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((newIsAchieved) =>
        this.milestoneService.update(this.milestoneDataSignal().id, {
          is_achieved: newIsAchieved,
        })
      )
    )
    .subscribe({
      next: (res) => {
        this.toastr.success(
          'successfully changed milestone data is achieved to ' +
            res.is_achieved
        );
      },
      error: () => {
        this.toastr.error('error changing milestone data is achieved');
      },
    });

  newDescriptionIsAchieved = this.newDescription$
    .pipe(
      debounceTime(3000),
      distinctUntilChanged(),
      switchMap((newDescription) =>
        this.milestoneService.update(this.milestoneDataSignal().id, {
          description: newDescription,
        })
      )
    )
    .subscribe({
      next: (res) => {
        this.toastr.success(
          'successfully changed milestone description to ' + res.description
        );
      },
      error: () => {
        this.toastr.error('error changing milestone description');
      },
    });

  newTitleSubscription = this.newTitle$
    .pipe(
      debounceTime(3000),
      distinctUntilChanged(),
      switchMap((newTitle) =>
        this.milestoneService.update(this.milestoneDataSignal().id, {
          title: newTitle,
        })
      )
    )
    .subscribe({
      next: (res) => {
        this.breadcrumb.set('@milestoneId', res.title);
        this.toastr.success(
          'successfully changed milestone title to ' + res.title
        );
      },
      error: () => {
        this.toastr.error('error changing milestone title');
      },
    });

  milestoneData$ = this.route.url.pipe(
    map((url) => Number(url[0].path)),
    switchMap((milestoneId) =>
      this.milestoneService.getMilestoneData(milestoneId)
    ),
    tap((d) => {
      this.breadcrumb.set('@milestoneId', d.title);

      this.title.setValue(d.title);
      this.description.setValue(d.description);
      this.isAchieved.setValue(!!d.is_achieved);
    }),
    catchError((err) => {
      this.toastr.error('error getting milestone data:', err);

      return EMPTY;
    })
  );
  milestoneDataSignal = toSignal(
    this.milestoneData$.pipe(
      map(({ id, due_date }) => ({ id, dueDate: due_date }))
    ),
    {
      initialValue: {
        id: -1,
        dueDate: '',
      },
    }
  );

  handleDeleteMilestone() {
    this.milestoneService.delete(this.milestoneDataSignal().id).subscribe({
      next: () => {
        this.toastr.success('successfully deleted a milestone');
        this.router.navigate(['../../milestones'], { relativeTo: this.route });
      },
      error: () => {
        this.toastr.error('failed to delete a milestone');
      },
    });
  }
}
