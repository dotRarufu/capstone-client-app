import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ParticipantCardComponent } from './participant-card.component';
import { CommonModule } from '@angular/common';
import { AddParticipantModalComponent } from 'src/app/pages/project/pages/project/add-participant-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AError, ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectRow, User } from 'src/app/types/collection';
import { ProjectCardPreviewComponent } from './project-card-preview.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  take,
  tap,
  map,
  catchError,
  EMPTY,
  forkJoin,
  of,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ParticipntDetailModalComponent } from './participant-detail-modal.component';
import { InvitedParticipntDetailModalComponent } from './invited-participant-detail-modal.component';
import { ProjectStateService } from './data-access/project-state.service';
import { InvitedParticipantCardComponent } from './invited-participant-card.component';

@Component({
  selector: 'general',
  standalone: true,
  imports: [
    FeatherIconsModule,
    ParticipantCardComponent,
    CommonModule,
    AddParticipantModalComponent,
    ProjectCardPreviewComponent,
    ReactiveFormsModule,
    AddParticipantModalComponent,
    ParticipntDetailModalComponent,
    InvitedParticipntDetailModalComponent,
    InvitedParticipantCardComponent,
  ],

  template: `
    <div *ngIf="{project: project$ | async} as observables" class="flex flex-col gap-[16px]">
      <div class="flex w-full flex-col gap-[16px] sm2:flex-row">
        <div class="flex w-full flex-col gap-[8px]">
          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Name</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <input
              [formControl]="name"
              (change)="newNameSubject.next(this.name.value)"
              [disabled]="!isStudent()"
              type="text"
              placeholder="Type here"
              class="input-bordered input input-md w-full rounded-[3px] focus:input-primary  focus:outline-0"
            />
          </div>

          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Full Title</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <textarea
              [formControl]="title"
              (change)="newTitleSubject.next(this.title.value)"
              [disabled]="!isStudent()"
              type="text"
              placeholder="Type here"
              class="textarea-bordered textarea input-md h-[144px] w-full rounded-[3px] focus:textarea-primary focus:outline-0"
            ></textarea>
          </div>
        </div>

        <div *ngIf="isStudent()" class="flex w-[320px] flex-col gap-[4px]">
          <div class="text-base font-semibold">Preview</div>
          <project-card-preview [name]="name.value" [title]="title.value" />
        </div>
      </div>

      <div class="flex flex-col gap-[8px]">
        <div class="flex items-center justify-between text-base font-semibold">
          Participants

          <button
            *ngIf="isStudent()"
            onclick="addParticipant.showModal()"
            class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </button>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <participant-card
          *ngFor="let participant of participants$ | async"
          (click)="projectStateService.setActiveParticipant(participant)"
          [user]="participant"
        />
        <invited-participant-card
          *ngFor="let user of invited$ | async"
          (click)="projectStateService.setActiveInvitedParticipant(user)"
          [user]="user"
        />
      </div>

      
      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Section</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
   
        <input
              [formControl]="section"
              (change)="newSectionSubject.next(this.section.value)"
          
              type="text"
              placeholder="3-1"
              class="input-bordered input input-md w-full rounded-[3px] focus:input-primary  focus:outline-0"
            />
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Date Created</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div>{{observables.project?.created_at}}</div>
      </div>
      <div *ngIf="isCapstoneAdviser()" class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Mark as Done</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div class="flex gap-[8px]">
          <input
            type="checkbox"
            class="toggle-success toggle"
            [checked]="isDone"
            [formControl]="isDone"
            (change)="newIsDoneSubject.next(this.isDone.value)"
          />
          <div class="text-base font-semibold">
            {{ isDone ? 'Done' : 'Not Done' }}
          </div>
        </div>
      </div>
    </div>
    <add-participant-modal />
    <participant-detail-modal />
    <invited-participant-detail-modal />
  `,
})
export class GeneralComponent implements OnInit {
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  projectStateService = inject(ProjectStateService);

  name = new FormControl('', { nonNullable: true });
  title = new FormControl('', { nonNullable: true });
  section = new FormControl('', { nonNullable: true });
  isDone = new FormControl(false, { nonNullable: true });

  projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);

  isStudent = computed(() => {
    const user = this.user();

    if (user === null) return false;

    return getRolePath(user.role_id) === 's';
  });
  isCapstoneAdviser = computed(() => {
    const user = this.user();

    if (user === null) return false;

    return getRolePath(user.role_id) === 'c';
  });
  user = toSignal(
    this.authService.user$.pipe(
      take(1),
      map((u) => {
        if (u === null) {
          throw new Error('no logged in user');
        }
        return u;
      })
    ),
    { initialValue: null }
  );

  project$ = this.projectService.getProjectInfo(this.projectId)
  projectSubscription = this.project$.subscribe({
    next: (project) => {
      this.name.setValue(project.name);
      this.title.setValue(project.full_title);
      this.isDone.setValue(project.is_done);
      this.section.setValue(project.section);
    },
    error: (err) => {
      this.toastr.error('error fetching project info');
    },
  });

  newTitleSubject = new Subject<string>();
  newTitle$ = this.newTitleSubject.pipe(
    takeUntilDestroyed(),
    debounceTime(3000),
    distinctUntilChanged(),
    switchMap((newTitle) =>
      this.projectService.updateGeneralInfo(this.projectId, {
        full_title: newTitle,
      })
    )
  );
  newTitleSuccess$ = this.newTitle$
    .pipe(filter((v): v is ProjectRow => !v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.success(
          'successfully changed project title to ' + res.full_title
        );
      },
    });
  newTitleFailed$ = this.newTitle$
    .pipe(filter((v): v is AError => v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.error('error changing title: ' + res.message);
      },
    });
  newSectionSubject = new Subject<string>();
  newSection$ = this.newSectionSubject.pipe(
    takeUntilDestroyed(),
    debounceTime(3000),
    distinctUntilChanged(),
    switchMap((newSection) =>
      this.projectService.updateGeneralInfo(this.projectId, {
        section: newSection,
      })
    )
  );
  newSectionSuccess$ = this.newSection$
    .pipe(filter((v): v is ProjectRow => !v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.success(
          'Successfully changed section to ' + res.section
        );
      },
    });
  newSectionFailed$ = this.newSection$
    .pipe(filter((v): v is AError => v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.error('Error changing section: ' + res.message);
      },
    });

  newNameSubject = new Subject<string>();
  newName$ = this.newNameSubject.pipe(
    tap((v) => console.log('chagned:', v)),
    takeUntilDestroyed(),
    debounceTime(3000),
    distinctUntilChanged(),
    switchMap((newTitle) =>
      this.projectService.updateGeneralInfo(this.projectId, {
        name: newTitle,
      })
    )
  );
  newNameSuccess$ = this.newName$
    .pipe(filter((v): v is ProjectRow => !v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.success('successfully changed project name to ' + res.name);
      },
    });
  newNameFailed$ = this.newName$
    .pipe(filter((v): v is AError => v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.error('error changing name: ' + res.message);
      },
    });

  newIsDoneSubject = new Subject<boolean>();
  newIsDone$ = this.newIsDoneSubject.pipe(
    takeUntilDestroyed(),
    debounceTime(3000),
    distinctUntilChanged(),
    switchMap((newIsDone) =>
      this.projectService.updateGeneralInfo(this.projectId, {
        is_done: newIsDone,
      })
    )
  );
  newIsDoneSuccess$ = this.newIsDone$
    .pipe(filter((v): v is ProjectRow => !v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.success(
          'successfully changed project is done to ' + res.is_done
        );
      },
    });
  newIsDoneFailed$ = this.newIsDone$
    .pipe(filter((v): v is AError => v.hasOwnProperty('isError')))
    .subscribe({
      next: (res) => {
        this.toastr.error('error changing is done property: ' + res.message);
      },
    });

  invited$ = this.projectService.getInvitedParticipants(this.projectId).pipe(
    switchMap((users) => {
      const usersData$ = users.map((u) =>
        this.authService.getUser(u.receiver_uid).pipe(map(v => ({...v, ...u})))
      );
      if (users.length === 0) return of([])

      return forkJoin(usersData$);
    }),

  );

  participants$ = this.projectService.getParticipants(this.projectId).pipe(
    map((p) => {
      if (p === null) {
        return [];
      }

      return p;
    }),
    // switchMap(p => forkJoin({participants: of(p), invited: this.projectService.getInvitedParticipants(this.projectId)})),
    // map(({invited, participants}) => {

    // }),
    tap(() => this.spinner.hide()),
    catchError((err) => {
      this.toastr.error('Error getting participants');

      return EMPTY;
    })
  );

  shouldShowParticipant(participant: {
    name: string;
    role_id: number;
    uid: string;
  }) {
    if (!this.isStudent()) {
      return false;
    }

    const user = this.user();

    return user !== null && participant.uid !== user.uid;
  }

  ngOnInit(): void {
    this.spinner.show();
  }
}
