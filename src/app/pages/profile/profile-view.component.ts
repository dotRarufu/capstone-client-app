import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  WritableSignal,
  computed,
  inject,
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
} from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MilestonesTemplateComponent } from 'src/app/pages/profile/milestones-template.component';
import { AddMilestoneModalComponent } from 'src/app/pages/project/pages/milestones/add-milestone.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ImgFallbackModule } from 'ngx-img-fallback';

@Component({
  selector: 'profile-view',
  standalone: true,
  imports: [
    CommonModule,
    ImgFallbackModule,
    MilestonesTemplateComponent,
    AddMilestoneModalComponent,
    FeatherIconsModule,
    FormsModule,
 
    ReactiveFormsModule,
  ],
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="flex w-full flex-col gap-[1rem] sm2:w-[840px] md:w-full lg:w-full "
      >
        <div
          class="hidden flex-col gap-2 sm1:flex-row sm1:items-center sm1:justify-between md:flex"
        >
          <h2 class="text-[24px] text-base-content sm1:text-[32px]">Profile</h2>
        </div>
        <div class="hidden h-[2px] w-full bg-base-content/10 md:block"></div>

        <div class="flex w-full flex-col gap-4">
          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Profile Picture</div>
            <div class="relative w-fit">
              <div class="avatar">
                <div class="w-40 overflow-clip rounded-full">
                  <img
                    [src]="userAvatarUrl()"
                    src-fallback="{{ fallbackAvatar }}"
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
                    <li (click)="handleUploadClick()"><a>Upload a photo</a></li>
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
                [defaultValue]="user().name"
                [(ngModel)]="newName"
                (input)="handleNameChange(nameInput.value)"
                placeholder="Type here"
                class="input-bordered input input-sm w-full max-w-sm rounded-[5px] bg-base-300/80 p-[8px] text-base focus:input-primary focus:outline-0"
              />
              <label
                *ngIf="showSaveButton | async"
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
              <p class="pl-[8px] text-base text-base-content/70">
                {{ user().uid }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between ">
            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Email</div>
              <p class="pl-[8px] text-base text-base-content/70">
                {{ user().email }}
              </p>
            </div>
          </div>

          <ul>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]"
                  >Notifications</span
                >
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
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
                  checked
                />
              </label>
            </li>
            <li class="flex w-full items-center justify-between px-1 py-2">
              <span class="label-text text-[18px] sm2:text-[20px]"
                >Add to Home Screen</span
              >
              <button (click)="installPwa()" class="btn-primary btn-sm btn">
                Install
              </button>
            </li>
          </ul>

          <milestones-template *ngIf="user().role_id === 1" />
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="sideColumn">
      <div
        class="hidden w-full flex-col gap-[1rem] sm2:w-[840px] md:flex md:w-full lg:w-full"
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
                    [src]="userAvatarUrl()"
                    src-fallback="{{ fallbackAvatar }}"
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
                [defaultValue]="user().name"
                #nameInput
                [(ngModel)]="newName"
                (input)="handleNameChange(nameInput.value)"
                placeholder="Type here"
                class="input-bordered input input-sm w-full max-w-sm rounded-[5px] bg-base-300/80 p-[8px] text-base focus:input-primary focus:outline-0"
              />
              <label
                *ngIf="showSaveButton | async"
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
              <p class="pl-[8px] text-base text-base-content/70">
                {{ user().uid }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between ">
            <div class="flex flex-col gap-[4px]">
              <div class="text-base font-semibold">Email</div>
              <p class="pl-[8px] text-base text-base-content/70">
                {{ user().email }}
              </p>
            </div>
          </div>

          <ul>
            <li class="form-control w-full">
              <label class="label flex cursor-pointer items-center">
                <span class="label-text text-[18px] sm2:text-[20px]"
                  >Notifications</span
                >
                <input type="checkbox" class="toggle-primary toggle" checked />
              </label>
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
                  checked
                />
              </label>
            </li>
            <li class="flex w-full items-center justify-between px-1 py-2">
              <span class="label-text text-[18px] sm2:text-[20px]"
                >Add to Home Screen</span
              >
              <button (click)="installPwa()" class="btn-primary btn-sm btn">
                Install
              </button>
            </li>
          </ul>

          <milestones-template
            *ngIf="user().role_id === 1"
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
  
  `,
})
export class ProfileViewComponent implements OnInit {
  search: string = '';
  deferredPrompt: any;
  projects: Project[] = [];
  theme: string = 'original';
  @Input() sideColumn? = false;
  user: WritableSignal<
    User & {
      email?: string;
      avatar: string;
    }
  > = signal({
    avatar: '',
    name: 'Unloggedin User',
    role_id: -1,
    uid: '1231-232as-ddaf',
    email: 'user@email.com',
    avatar_last_update: 0,
  });
  nameIsInEdit = false;
  newName = this.user().name;
  userService = inject(UserService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  fallbackAvatar = `https://api.multiavatar.com/${this.user().name}.png`;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService) {}

  handleNameButton() {
    this.spinner.show();
    this.authService.updateName(this.newName).subscribe({
      next: (status) => {
        this.toastr.success('successfully updated name');
        this.spinner.hide();
        // this.user().name = this.newName;
        this.showSaveButtonSubject.next(this.newName);
      },
    });
  }

  userAvatarUrl = computed(() => {
    const { avatar_last_update, avatar } = this.user();
    const time = avatar_last_update;

    if (time === null) {
      return avatar;
    }
    const base = avatar.slice(0, avatar.indexOf('.png'));
    const newUrl = `${base}-t-${time}.png`;

    return newUrl;
  });
  showSaveButtonSubject = new BehaviorSubject('');
  showSaveButton = this.showSaveButtonSubject
    .asObservable()
    .pipe(map((v) => v !== this.user().name));

  handleNameChange(value: string) {
    this.showSaveButtonSubject.next(value);
  }

  handleUploadClick() {
    this.fileInput.nativeElement.click();
  }

  handleDeletePhotoClick() {
    const { avatar_last_update, uid } = this.user();
    const time = avatar_last_update;
    const path = `${uid}-t-${time}.png`;
    this.spinner.show();
    this.authService.deleteAvatar(path).subscribe({
      next: (status) => {
        this.toastr.success('successfully removed photo');
        this.spinner.hide();
      },
      error: (status) => {
        this.toastr.error('failed to removed photo');
        this.spinner.hide();
      },
    });
  }

  handleFileInputChange() {
    const file = this.fileInput.nativeElement.files![0];
    this.spinner.show();

    this.authService.uploadAvatar(file, this.user().uid).subscribe({
      next: () => {
        this.spinner.hide();
        this.toastr.success('photo uploaded successfully');
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('photo not uploaded ');
      },
    });
  }

  ngOnInit() {
    this.spinner.show();

    const user$ = from(this.authService.getAuthenticatedUser());
    user$
      .pipe(
        map((user) => {
          if (user === null) throw new Error('user cant be null');

          return user;
        }),
        switchMap((user) => this.authService.getUserProfile(user.uid))
      )
      .subscribe({
        next: (user) => {
          this.user.set(user);
          console.log('user:', user);
          this.newName = user.name;
          this.showSaveButtonSubject.next(this.newName);
          this.spinner.hide();
        },
      });

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault(); // Prevent the default behavior
      this.deferredPrompt = event;
    });
  }

  changeTheme() {
    this.theme = this.theme === 'dark' ? 'original' : 'dark';
    document.querySelector('html')?.setAttribute('data-theme', this.theme);
  }

  installPwa() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt(); // Prompt the user to install the PWA
      this.deferredPrompt = null; // Reset the deferredPrompt
    }
  }
}
