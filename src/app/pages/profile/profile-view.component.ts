import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/collection';
import { from, map, switchMap } from 'rxjs';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { MilestonesComponent } from 'src/app/components/milestones.component';
import { MilestonesTemplateComponent } from 'src/app/adviser/components/capstone-adviser/milestones-template.component';
import { AddMilestoneModalComponent } from 'src/app/components/modal/add-milestone.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ImgFallbackModule } from 'ngx-img-fallback';

@Component({
  selector: 'ProfileView',
  standalone: true,
  imports: [
    CommonModule,
    ImgFallbackModule,
    MilestonesTemplateComponent,
    AddMilestoneModalComponent,
    FeatherIconsModule,
    FormsModule,
    NgxSpinnerModule
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
          <div class="flex gap-4">
          <div class="relative">
              <div class="avatar">
                <div class="w-24 overflow-clip rounded-full">
                  <img
                  [src]="userAvatarUrl()"
                    src-fallback="{{ fallbackAvatar }}"
                  />
                </div>
              </div>
              <div class="dropdown bottom-0 absolute left-0 z-[999]">
                <label
                  tabindex="0"
                  class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/80 p-[4px] hover:btn-primary hover:outline-none"
                  ><i-feather name="edit"
                /></label>
                <ul
                  tabindex="0"
                  class="dropdown-content menu rounded-[5px] z-[1] w-52 bg-base-300/80 p-0 shadow"
                >
                  <li (click)="handleUploadClick()"><a>Upload a photo</a></li>
                  <li><a>Remove photo</a></li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col justify-center gap-0">
              <h1 class="text-[24px]">{{ user().name }}</h1>
              <p class="text-base text-base-content/70">{{user().email}}</p>

              <p class="text-base text-base-content/70">ID: {{ user().uid }}</p>
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
                  (change)="changeTheme()"
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
          <div class="flex gap-4">
            <div class="relative">
              <div class="avatar">
                <div class="w-24 overflow-clip rounded-full">
                  <img
                    [src]="userAvatarUrl()"
                    src-fallback="{{ fallbackAvatar }}"
                  />
                </div>
              </div>
              <div class="dropdown bottom-0 absolute left-0 z-[999]">
                <label
                  tabindex="0"
                  class=" btn-square btn-sm btn flex rounded-[5px] border border-transparent bg-base-300/80 p-[4px] hover:btn-primary hover:outline-none"
                  ><i-feather name="edit"
                /></label>
                <ul
                  tabindex="0"
                  class="dropdown-content menu rounded-[5px] z-[1] w-52 bg-base-300/80 p-0 shadow"
                >
                  <li (click)="handleUploadClick()"><a>Upload a photo</a></li>
                  <li><a>Remove photo</a></li>
                </ul>
              </div>
            </div>
            <div class="flex w-full flex-col justify-center gap-0">
              <div class="flex items-center justify-between">
                <input
                  *ngIf="nameIsInEdit"
                  type="text"
                  id="nameInput"
                  [(ngModel)]="newName"
                  placeholder="Name"
                  class="input-bordered input input-md w-full rounded-[3px] bg-base-300/80 text-[24px] focus:input-primary focus:outline-0"
                />
                <h1 *ngIf="!nameIsInEdit" class="text-[24px]">
                  {{ user().name }}
                </h1>

                <label
                  for="nameInput"
                  (click)="handleNameButton()"
                  class="btn-ghost btn-square btn-sm btn text-base-content"
                >
                  <i-feather *ngIf="!nameIsInEdit" name="edit" />
                  <i-feather *ngIf="nameIsInEdit" name="save" />
                </label>
              </div>
              <p class="text-base text-base-content/70">{{user().email}}</p>
              <p class="text-base text-base-content/70">{{ user().uid }}</p>
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
                  (change)="changeTheme()"
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

          <milestones-template *ngIf="user().role_id === 1" [sideColumn]="true" />
        </div>
      </div>
    </ng-container>

    <input (change)="handleFileInputChange()" #fileInput type="file" class="hidden" /> <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >

  `,
})
export class ProfileViewComponent implements OnInit {
  search: string = '';
  deferredPrompt: any;
  projects: Project[] = [];
  theme: string = 'original';
  @Input() sideColumn? = false;
  user: WritableSignal<User & {
    email?: string; 
    avatar: string
  }> = signal({
    avatar: '',
    name: 'Unloggedin User',
    role_id: -1,
    uid: '1231-232as-ddaf',
    email: 'user@email.com',
    avatar_last_update: 0
  });
  nameIsInEdit = false;
  newName = this.user().name;
  userService = inject(UserService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  fallbackAvatar = `https://api.multiavatar.com/${this.user().name}.png`;
  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>; 

  constructor(private authService: AuthService) {}

  handleNameButton() {
    if (this.nameIsInEdit) {
      this.nameIsInEdit = false;

      this.spinner.show();
      this.authService.updateName(this.newName).subscribe({
        next: (status) => {
          this.toastr.success('successfully updated name');
          this.spinner.hide();
          // this.user().name = this.newName;
        },
      });

      return;
    }

    this.nameIsInEdit = true;
  }
  userAvatarUrl = computed(() => { 

    
    const{avatar_last_update,avatar} = this.user();
    const time =avatar_last_update;

    if (time === null) {
  
      return avatar;
    }
    const base = avatar.slice(0, avatar.indexOf('.png'));
    const newUrl = `${base}-t-${time}.png`

    return newUrl;
  })

  handleUploadClick() {
    console.log("fileInpuit:",this.fileInput);
    this.fileInput.nativeElement.click();
  }

  handleFileInputChange() {
    const file = this.fileInput.nativeElement.files![0];
    this.spinner.show()
    
    this.authService.uploadAvatar(file, this.user().uid).subscribe({
      next: () => {
        this.spinner.hide()
        this.toastr.success("photo uploaded successfully")
      }
      ,error: () => {
        this.spinner.hide()
        this.toastr.error("photo not uploaded ")
      }
    })
    
    
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
          console.log("user:", user)
          this.newName = user.name;
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
