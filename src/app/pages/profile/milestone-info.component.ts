import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  EMPTY,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MilestoneService } from 'src/app/services/milestone.service';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'milestone-template-info',
  standalone: true,
  imports: [BreadcrumbModule, ReactiveFormsModule],
  template: `
    <div class=" flex flex-col gap-[16px]">
      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Title</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <input
          type="text"
          [formControl]="title"
          (change)="this.newTitle$.next(this.title.value)"
          placeholder="Type here"
          class="input-bordered input input-md w-full rounded-[3px] bg-base-300/80 focus:input-primary  focus:outline-0"
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
        <input
          type="date"
          [formControl]="dueDate"
          (change)="
            this.dueDate.value !== null &&
              this.newDueDate$.next(this.dueDate.value)
          "
          class="input w-full rounded-[3px] border-y-0 border-l-[3px] border-r-0 border-l-primary-content/50 bg-base-300/80 px-3 py-2 text-[20px] text-base text-base-content/70 placeholder:text-[20px] placeholder:text-base-content/70 placeholder:opacity-70 focus:border-l-[3px] focus:border-l-secondary focus:outline-0 "
        />
      </div>

      <div class="flex items-center justify-between ">
        <div class="flex flex-col gap-[4px]">
          <div class="text-base font-semibold">Delete</div>
          <div>
            This does not delete this milestone from the current assigned
            projects
          </div>
        </div>
        <button
          (click)="handleDeleteMilestone()"
          class="btn-sm btn gap-2 rounded-[3px] text-error hover:btn-error"
        >
          Delete
        </button>
      </div>
    </div>
  `,
})
export class MilestoneTemplateInfoComponent implements OnInit, OnChanges {
  @Input({ required: true }) milestoneId!: number | null;
  @Output() closed = new EventEmitter();

  title = new FormControl('', { nonNullable: true });
  description = new FormControl('', { nonNullable: true });
  dueDate = new FormControl('');
  
  newTitle$ = new Subject<string>();
  newDescription$ = new Subject<string>();
  newDueDate$ = new Subject<string>();
  milestoneId$ = new BehaviorSubject(this.milestoneId);
  id$ = this.milestoneId$.pipe(
    filter((v): v is number => v !== null),
    switchMap((id) => this.milestoneService.getMilestoneTemplateData(id)),
    tap((d) => {
      this.title.setValue(d.title);
      this.description.setValue(d.description);
      this.dueDate.setValue(d.due_date);
    }),
    map((d) => d.id),
    catchError(() => {
      this.toastr.error('error getting milestone tempplate data');

      return EMPTY;
    })
  );

  breadcrumb = inject(BreadcrumbService);
  milestoneService = inject(MilestoneService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.newTitle$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newTitle) =>
          forkJoin({ newTitle: of(newTitle), id: this.id$ })
        ),
        switchMap(({ newTitle, id }) =>
          this.milestoneService.updateTemplate(id, {
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
          forkJoin({ newDescription: of(newDescription), id: this.id$ })
        ),

        switchMap(({ newDescription, id }) =>
          this.milestoneService.updateTemplate(id, {
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
    this.newDueDate$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newDueDate) =>
          forkJoin({ newDueDate: of(newDueDate), id: this.id$ })
        ),
        switchMap(({ newDueDate, id }) =>
          this.milestoneService.updateTemplate(id, {
            due_date: newDueDate,
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(
            'successfully changed milestone template duedate to ' + res.due_date
          );
        },
        error: () => {
          this.toastr.error('error changing milestone description');
        },
      });

    this.watchMilestoneId();
  }

  watchMilestoneId() {}

  handleDeleteMilestone() {
    this.id$
      .pipe(switchMap((id) => this.milestoneService.deleteTemplate(id)))
      .subscribe({
        next: () => {
          this.toastr.success('successfully deleted a template');
          this.closed.emit();
        },
        error: () => {
          this.toastr.error('failed to delete a template');
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleMilestoneIdChanges(changes);
  }

  handleMilestoneIdChanges(changes: SimpleChanges) {
    const newMilestoneId = changes['milestoneId'];

    if (newMilestoneId === undefined) return;

    const newValue = newMilestoneId.currentValue as number;

    this.milestoneId$.next(newValue);
  }
}
