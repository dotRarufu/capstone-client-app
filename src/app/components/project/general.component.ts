import { Component, OnInit } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ParticipantCardComponent } from '../card/participant-card.component';
import { CommonModule } from '@angular/common';
import { AddParticipantModalComponent } from 'src/app/student/components/modals/addParticipant.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/collection';
import { ProjectCardPreviewComponent } from './project-card-preview.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'general',
  standalone: true,
  imports: [
    FeatherIconsModule,
    ParticipantCardComponent,
    CommonModule,
    AddParticipantModalComponent,
    ProjectCardPreviewComponent,
    FormsModule,
    AddParticipantModalComponent,
  ],

  template: `
    <div class="flex flex-col gap-[16px]">
      <div class="flex w-full flex-col gap-[16px] sm2:flex-row">
        <div class="flex w-full flex-col gap-[8px]">
          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Name</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <input
              [(ngModel)]="name"
              (change)="handleNameChange()"
              [disabled]="!isStudent"
              type="text"
              placeholder="Type here"
              class="input-bordered input input-md w-full rounded-[3px] focus:input-primary  focus:outline-0"
            />
          </div>

          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Full Title</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <textarea

              [(ngModel)]="title"
              (change)="handleTitleChange()"
              [disabled]="!isStudent"
              type="text"
              placeholder="Type here"
              class="textarea-bordered textarea input-md h-[144px] w-full rounded-[3px] focus:textarea-primary focus:outline-0"
            ></textarea>
          </div>
        </div>

        <div *ngIf="isStudent" class="flex w-[320px] flex-col gap-[4px]">
          <div class="text-base font-semibold">Preview</div>
          <project-card-preview [name]="name" [title]="title" />
        </div>
      </div>

      <div class="flex flex-col gap-[8px]">
        <div class="flex items-center justify-between text-base font-semibold">
          Participants

          <button
          *ngIf="isStudent"
            onclick="addParticipant.showModal()"
            class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </button>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <ParticipantCard
          *ngFor="let participant of participants"
          [user]="participant"
          [showRemoveButton]="shouldShowParticipant(participant)"
          (removeButtonClicked)="handleRemoveButtonClick($event)"
        />
      </div>

      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Date Created</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div>July 23, 2023</div>
      </div>
      <div class="flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Mark as Done</div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <div class="flex gap-[8px]">
          <input
            type="checkbox"
            class="toggle-success toggle"
            [checked]="isDone"
            [(ngModel)]="isDone"
            (change)="handleIsDoneChange()"
            [disabled]="!isStudent"
          />
          <div class="text-base font-semibold">
            {{ isDone ? 'Done' : 'Not Done' }}
          </div>
        </div>
      </div>
    </div>
    <AddParticipantModal />
  `,
})
export class GeneralComponent implements OnInit {
  participants: User[] = [];
  name = '';
  title = '';
  isDone = false;
  projectId = -1;
  newName$ = new Subject<string>();
  newTitle$ = new Subject<string>();
  newIsDone$ = new Subject<boolean>();
  // todo: initiate this
  isStudent = false;
  user: User | null = null;

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
    this.projectId = projectId;
    const participants$ = this.projectService.getParticipants(projectId);

    participants$.subscribe({
      next: (p) => {
        if (p === null) {
          this.participants = [];
          this.spinner.show();

          return;
        }
        this.spinner.hide();

        this.participants = p;
      },
      complete: () => console.log('getParticipants complete'),
    });

    this.projectService.getProjectInfo(this.projectId).subscribe({
      next: (project) => {
        this.name = project.name;
        this.title = project.full_title;
        this.isDone = project.is_done;
      },
      error: (err) => {
        this.toastr.error('error fetching project info');
      },
    });

    this.newName$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newName) =>
          this.projectService.updateGeneralInfo(this.projectId, {
            name: newName,
          })
        ),
        tap(() => console.log('projhect name chagned'))
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(
            'successfully changed project name to ' + res.name
          );
        },
        error: () => {
          this.toastr.error('error changing project name');
        },
      });

    this.newTitle$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newTitle) =>
          this.projectService.updateGeneralInfo(this.projectId, {
            full_title: newTitle,
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(
            'successfully changed project title to ' + res.full_title
          );
        },
        error: () => {
          this.toastr.error('error changing project title');
        },
      });

    this.newIsDone$
      .pipe(
        debounceTime(3000),
        distinctUntilChanged(),
        switchMap((newIsDone) =>
          this.projectService.updateGeneralInfo(this.projectId, {
            is_done: newIsDone,
          })
        )
      )
      .subscribe({
        next: (res) => {
          this.toastr.success(
            'successfully changed project is done to ' + res.is_done
          );
        },
        error: () => {
          this.toastr.error('error changing project is done');
        },
      });

    this.authService.user$.pipe(take(1)).subscribe({
      next: (user) => {
        console.log('user !:', user);
        if (user === null) {
          this.toastr.error('no loggedin user');
          return;
        }
        this.user = user;
        this.isStudent = getRolePath(user.role_id) === 's';
      },
      error: () => {
        this.toastr.error('no loggedin user');
      },
    });
  }

  handleRemoveButtonClick(userUid: string) {
    console.log('remove button clicked:' + userUid);
    this.projectService
      .removeProjectParticipant(userUid, this.projectId)
      .subscribe({
        next: () => {
          this.toastr.success('successfully removed user from the project');
        },
        error: () => {
          this.toastr.error('failed to removed user from the project');
        },
      });
  }

  handleNameChange() {
    this.newName$.next(this.name);
  }

  handleTitleChange() {
    this.newTitle$.next(this.title);
  }

  handleIsDoneChange() {
    this.newIsDone$.next(this.isDone);
  }

  shouldShowParticipant(participant: {
    name: string;
    role_id: number;
    uid: string;
  }) {
    if (!this.isStudent) {
      return false;
    }

    return this.user !== null && participant.uid !== this.user.uid;
  }
}
