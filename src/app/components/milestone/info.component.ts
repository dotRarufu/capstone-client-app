import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { MilestoneData } from '../../types/collection';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'milestone-info',
  standalone: true,
  imports: [BreadcrumbModule, FormsModule],
  template: `
    <div class=" flex flex-col gap-[16px] pt-[20px]">
      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Title</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <input
          type="text"
          [disabled]="!isCapstoneAdviser"
          [(ngModel)]="title"
          (change)="handleTitleChange()"
          placeholder="Type here"
          class="input-bordered input bg-base-300/80 input-md w-full rounded-[3px] focus:input-primary  focus:outline-0"
        />
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Description</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <textarea
          type="text"
          [(ngModel)]="description"
          [disabled]="!isCapstoneAdviser"
          (change)="handleDescriptionChange()"
          placeholder="Type here"
          class="textarea-bordered bg-base-300/80 textarea input-md h-[144px] w-full rounded-[3px] focus:textarea-primary focus:outline-0"
        ></textarea>
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Due Date</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div>{{ dueDate }}</div>
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Mark as Achieved</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div class="flex gap-[8px]">
          <input
            type="checkbox"
            [checked]="isAchieved"
            [disabled]="!isCapstoneAdviser"
            [(ngModel)]="isAchieved"
            (change)="handleIsAchievedChange()"
            class="toggle-success toggle"
          />
          <div class="text-base font-semibold">
            {{ isAchieved ? 'Achieved' : 'Pending' }}
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Delete</div>
          <div>
            Once you delete a milestone, there is no going back. Please be
            certain.
          </div>
        </div>
        <button
          (click)="handleDeleteMilestone()"
          class="btn-sm btn btn-error rounded-[5px] gap-2 hover:btn-error"
        >
          Delete
        </button>
      </div>
    </div>
  `,
})
export class MilestoneInfoComponent implements OnInit {
  id = -1;
  title = '';
  description = '';
  dueDate = '';
  isAchieved = false;
  isCapstoneAdviser = false;
  newTitle$ = new Subject<string>();
  newDescription$ = new Subject<string>();
  newIsAchieved$ = new Subject<boolean>();

  constructor(
    private breadcrumb: BreadcrumbService,
    private milestoneService: MilestoneService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.newTitle$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newTitle) =>
          this.milestoneService.update(this.id, {
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

    this.newDescription$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newDescription) =>
          this.milestoneService.update(this.id, {
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

    this.newIsAchieved$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((newIsAchieved) =>
          this.milestoneService.update(this.id, {
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

    const user$ = from(this.authService.getAuthenticatedUser());
    user$
      .pipe(
        map((user) => {
          if (user === null) throw new Error('no authenticated user');

          return user;
        })
      )
      .subscribe({
        next: (user) => {
          this.isCapstoneAdviser = getRolePath(user.role_id) === 'c';
        },
      });

    this.watchMilestoneId();
  }

  watchMilestoneId() {
    this.route.url
      .pipe(
        map((url) => Number(url[0].path)),
        switchMap((milestoneId) =>
          this.milestoneService.getMilestoneData(milestoneId)
        )
      )
      .subscribe({
        next: (d) => {
          this.breadcrumb.set('@milestoneId', d.title);

          this.title = d.title;
          this.description = d.description;
          this.dueDate = d.due_date;
          this.isAchieved = !!d.is_achieved;
          this.id = d.milestone_id;
        },
        error: (err) => {
          this.toastr.error('error getting milestone data');
        },
      });
  }

  handleDescriptionChange() {
    this.newDescription$.next(this.description);
  }

  handleTitleChange() {
    this.newTitle$.next(this.title);
  }

  handleIsAchievedChange() {
    this.newIsAchieved$.next(this.isAchieved);
  }

  handleDeleteMilestone() {
    console.log("delete click: ", this.id);
    this.milestoneService.delete(this.id).subscribe({
      next: () => {
        this.toastr.success('successfully deleted a milestone');
        this.navigateToMilestones();
      },
      error: () => {
        this.toastr.error('failed to delete a milestone');
      },
    });
  }

  navigateToMilestones() {
    this.router.navigate(['../../milestones'], { relativeTo: this.route });
  }
}
