import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  WritableSignal,
  computed,
  inject,
  effect,
  signal,
} from '@angular/core';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/collection';
import {
  BehaviorSubject,
  from,
  map,
  switchMap,
  tap,
  of,
  forkJoin,
  take,
  filter,
  startWith,
} from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MilestonesTemplateComponent } from 'src/app/pages/profile/milestones-template.component';
import { AddMilestoneModalComponent } from 'src/app/pages/project/pages/milestones/add-milestone.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { NotificationsComponent } from './notifications.component';
import { ProjectService } from 'src/app/services/project.service';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ClipboardModule } from 'ngx-clipboard';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ImgFallbackModule,
    MilestonesTemplateComponent,
    AddMilestoneModalComponent,
    FeatherIconsModule,
    ReactiveFormsModule,
    NotificationsComponent,
    ClipboardModule,
  ],
  template: `
    <ng-container
      *ngIf="{
        user: user$ | async,
        isCapstoneAdviser: isCapstoneAdviser$ | async
      } as observables"
    >
      <ng-container *ngIf="!sideColumn">
        <div
          class="flex w-full flex-col gap-[1rem] pb-4 sm2:w-[840px] md:w-full lg:w-full "
        >
          <div
            class="hidden flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between md:flex"
          >
            <h2 class="text-[24px] text-base-content sm1:text-[32px]">
              Profile
            </h2>
          </div>
          <div class="hidden h-[2px] w-full bg-base-content/10 md:block"></div>

          <div class="flex w-full flex-col gap-4">
            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Profile Picture</div>
              <div class="relative w-fit">
                <div class="avatar">
                  <div class="w-40 overflow-clip rounded-full">
                    <img
                      [src]="userAvatarUrl$ | async"
                      src-fallback="{{ fallbackAvatar$ | async }}"
                    />
                  </div>
                </div>
                <div class="dropdown absolute bottom-0 right-0 z-[999]">
                  <label
                    tabindex="0"
                    class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/80 p-[4px] hover:btn-primary hover:outline-none"
                    ><i-feather name="edit"
                  /></label>
                  <div class="dropdown-content bg-base-100">
                    <ul
                      tabindex="0"
                      class="menu z-[1] w-52 rounded-[5px] bg-base-300/80 p-0 shadow"
                    >
                      <li (click)="handleUploadClick()">
                        <a>Upload a photo</a>
                      </li>
                      <li (click)="handleDeletePhotoClick()">
                        <a>Remove photo</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Name</div>
              <div class="flex justify-between gap-4">
                <input
                  #nameInput
                  type="text"
                  value="{{ observables.user?.name }}"
                  [formControl]="newName"
                  placeholder="Type here"
                  class="input-bordered input input-sm w-full max-w-sm rounded-[5px] bg-base-300/80 p-[8px] text-base focus:input-primary focus:outline-0"
                />
                <label
                  *ngIf="showSaveButton$ | async"
                  (click)="handleNameButton()"
                  class="btn-primary  btn-sm btn"
                >
                  <i-feather name="save" />
                  Save
                </label>
              </div>
            </div>

            <div class="flex items-center justify-between ">
              <div class="flex flex-col gap-[4px]">
                <div class="text-base font-semibold">ID</div>
                <p
                  class="flex items-center gap-2 pl-[8px] text-base text-base-content/70"
                >
                  {{ observables.user?.uid }}
                  <button
                    ngxClipboard
                    [cbContent]="observables.user?.uid"
                    (click)="clipboardClick()"
                    class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/0 p-[4px] hover:btn-primary hover:outline-none"
                  >
                    <i-feather name="copy" />
                  </button>
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between ">
              <div class="flex flex-col gap-[4px]">
                <div class="text-base font-semibold">Email</div>
                <p class="pl-[8px] text-base text-base-content/70">
                  {{ observables.user?.email }}
                </p>
              </div>
            </div>

            <ul>
              <!-- <li class="form-control w-full">
                <label class="label flex cursor-pointer items-center">
                  <span class="label-text text-[18px] sm2:text-[20px]"
                    >Notifications</span
                  >
                  <input
                    type="checkbox"
                    class="toggle-primary toggle"
                    checked
                  />
                </label>
              </li> -->
              <li class="form-control w-full">
                <label class="label flex cursor-pointer items-center">
                  <span class="label-text text-[18px] sm2:text-[20px]"
                    >Dark Mode</span
                  >
                  <input
                    (input)="changeTheme()"
                    type="checkbox"
                    class="toggle-primary toggle"
                    [checked]="themeService.theme() !== 'original'"
                  />
                </label>
              </li>
              <!-- <li class="flex w-full items-center justify-between px-1 py-2">
                <span class="label-text text-[18px] sm2:text-[20px]"
                  >Add to Home Screen</span
                >
                <button (click)="installPwa()" class="btn-primary btn-sm btn">
                  Install
                </button>
              </li> -->
            </ul>

            <notifications />
            <milestones-template *ngIf="observables.isCapstoneAdviser" />
          </div>
        </div>
      </ng-container>

      <ng-container *ngIf="sideColumn">
        <div
          class="hidden w-full flex-col gap-[1rem]  pb-4 sm2:w-[840px] md:flex md:w-full lg:w-full"
        >
          <div
            class="flex flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between"
          >
            <h2 class="text-[24px] text-base-content">Profile</h2>
          </div>
          <div class="hidden h-[2px] w-full bg-base-content/20 md:block"></div>

          <div class="flex w-full flex-col gap-4">
            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Profile Picture</div>
              <div class="relative w-fit">
                <div class="avatar">
                  <div class="w-40 overflow-clip rounded-full">
                    <img
                      [src]="userAvatarUrl$ | async"
                      src-fallback="{{ fallbackAvatar$ | async }}"
                    />
                  </div>
                </div>
                <div class="dropdown absolute bottom-0 right-0 z-[999]">
                  <label
                    tabindex="0"
                    class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/80 p-[4px] hover:btn-primary hover:outline-none"
                    ><i-feather name="edit"
                  /></label>
                  <ul
                    tabindex="0"
                    class="dropdown-content menu z-[1] w-52 rounded-[5px] bg-base-300/80 p-0 shadow"
                  >
                    <li (click)="handleUploadClick()"><a>Upload a photo</a></li>
                    <li (click)="handleDeletePhotoClick()">
                      <a>Remove photo</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Name</div>
              <div class="flex justify-between gap-4">
                <input
                  type="text"
                  value="{{ observables.user?.name }}"
                  #nameInput
                  [formControl]="newName"
                  placeholder="Type here"
                  class="input-bordered input input-sm w-full max-w-sm rounded-[5px] bg-base-300/80 p-[8px] text-base focus:input-primary focus:outline-0"
                />
                <label
                  *ngIf="showSaveButton$ | async"
                  (click)="handleNameButton()"
                  class="btn-primary  btn-sm btn"
                >
                  <i-feather name="save" />
                  Save
                </label>
              </div>
            </div>

            <div class="flex items-center justify-between ">
              <div class="flex flex-col gap-[4px]">
                <div class="text-base font-semibold">ID</div>
                <p
                  class="flex items-center gap-2 pl-[8px] text-base text-base-content/70"
                >
                  {{ observables.user?.uid }}
                  <button
                    ngxClipboard
                    [cbContent]="observables.user?.uid"
                    (click)="clipboardClick()"
                    class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/0 p-[4px] hover:btn-primary hover:outline-none"
                  >
                    <i-feather name="copy" />
                  </button>
                </p>
              </div>
            </div>

            <div class="flex items-center justify-between ">
              <div class="flex flex-col gap-[4px]">
                <div class="text-base font-semibold">Email</div>
                <p class="pl-[8px] text-base text-base-content/70">
                  {{ observables.user?.email }}
                </p>
              </div>
            </div>

            <ul>
              <li class="form-control w-full">
                <!-- <label class="label flex cursor-pointer items-center">
                  <span class="label-text text-[18px] sm2:text-[20px]"
                    >Notifications</span
                  >
                  <input
                    type="checkbox"
                    class="toggle-primary toggle"
                    checked
                  />
                </label>
              </li> -->
              </li>

              <li class="form-control w-full">
                <label class="label flex cursor-pointer items-center">
                  <span class="label-text text-[18px] sm2:text-[20px]"
                    >Dark Mode</span
                  >
                  <input
                    (input)="changeTheme()"
                    type="checkbox"
                    class="toggle-primary toggle"
                    [checked]="themeService.theme() !== 'original'"
                  />
                </label>
              </li>
              <!-- <li class="flex w-full items-center justify-between px-1 py-2">
              <span class="label-text text-[18px] sm2:text-[20px]"
                >Add to Home Screen</span
              >
              <button (click)="installPwa()" class="btn-primary btn-sm btn">
                Install
              </button>
            </li> -->
            </ul>

            <notifications />
            <milestones-template
              *ngIf="observables.isCapstoneAdviser"
              [sideColumn]="true"
            />
          </div>
        </div>
      </ng-container>

      <input
        (input)="handleFileInputChange()"
        #fileInput
        type="file"
        class="hidden"
      />
    </ng-container>
  `,
})
export class ProfileViewComponent implements OnInit {
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  projectService = inject(ProjectService);
  themeService = inject(ThemeService);
  // a = this.themeService.
  newName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')],
  });
  showSaveButtonSubject = new BehaviorSubject('');
  linkSaveButtonSubjectToName = this.newName.valueChanges.subscribe(
    this.showSaveButtonSubject
  );
  showSaveButton$ = this.showSaveButtonSubject.asObservable().pipe(
    filter((v) => v !== ''),

    switchMap((v) => forkJoin({ v: of(v), user: this.user$ })),

    map(({ v, user }) => v !== user.name)
  );
  user$ = this.authService.getAuthenticatedUser().pipe(
    map((user) => {
      if (user === null) throw new Error('user cant be null');

      return user;
    }),
    switchMap((user) =>
      this.authService.getUserProfile(user.uid).pipe(take(1))
    ),
    tap(() => this.spinner.hide())
  );
  fallbackAvatar$ = this.user$.pipe(
    map((user) => `https://api.multiavatar.com/${user.name}.png`)
  );
  userAvatarUrl$ = this.user$.pipe(
    map((user) => {
      const { avatar_last_update, avatar } = user;
      const time = avatar_last_update;

      if (time === null) {
        return avatar;
      }
      const base = avatar.slice(0, avatar.indexOf('.png'));
      const newUrl = `${base}-t-${time}.png`;

      return newUrl;
    })
  );
  isCapstoneAdviser$ = this.projectService.isUserCapstoneAdviser();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() sideColumn? = false;

  search: string = '';
  deferredPrompt: any;

  projects: Project[] = [];

  nameIsInEdit = false;

  handleNameButton() {
    if (this.newName.invalid) {
      this.toastr.error('Invalid name');

      return;
    }

    this.spinner.show();

    this.authService.updateName(this.newName.value!).subscribe({
      next: (status) => {
        this.toastr.success('Successfully updated name');
        this.spinner.hide();
        // this.user().name = this.newName;
        this.showSaveButtonSubject.next(this.newName.value!);
      },
    });
  }

  handleUploadClick() {
    this.fileInput.nativeElement.click();
  }

  clipboardClick() {
    this.toastr.success('User id copied to clipboard');
  }

  handleDeletePhotoClick() {
    this.spinner.show();

    this.user$
      .pipe(
        map((user) => {
          const { avatar_last_update, uid } = user;
          const time = avatar_last_update;
          const path = `${uid}-t-${time}.png`;

          return { path, uid };
        }),
        switchMap(({ path, uid }) => this.authService.deleteAvatar(path, uid))
      )
      .subscribe({
        next: (status) => {
          this.toastr.success('Successfully removed photo');
          this.spinner.hide();
        },
        error: (status) => {
          this.toastr.error('Failed to remove photo');
          this.spinner.hide();
        },
      });
  }

  handleFileInputChange() {
    const file = this.fileInput.nativeElement.files![0];

    this.spinner.show();

    this.user$
      .pipe(
        take(1),
        switchMap((user) => this.authService.uploadAvatar(file, user.uid))
      )
      .subscribe({
        next: () => {
          this.spinner.hide();
          this.toastr.success('Image uploaded successfully');
        },
        error: () => {
          this.spinner.hide();
          this.toastr.error('Image not uploaded ');
        },
      });
  }

  ngOnInit() {
    this.spinner.show();

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault(); // Prevent the default behavior
      this.deferredPrompt = event;
    });
  }

  changeTheme() {
    this.themeService.theme.set(
      this.themeService.theme() === 'dark' ? 'original' : 'dark'
    );
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // Prompt the user to install the PWA
      this.deferredPrompt = null; // Reset the deferredPrompt
    }
  }
}
