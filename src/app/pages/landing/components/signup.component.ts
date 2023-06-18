import { Component, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'SignUp',
  template: `
    <ng-container *ngIf="!isInLastStep">
      <div
        class="flex h-[568px] w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
      >
        <div class="flex flex-col gap-2 py-4">
          <h1 class="text-[2rem]">Sign Up</h1>
          <p class="text-xs opacity-80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostru
          </p>
        </div>

        <!-- todo: error message for inputs -->
        <input
          type="text"
          placeholder="Full Name"
          [(ngModel)]="fullName"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <div class="form-control ">
          <div class="input-group rounded-[3px] border border-base-content/50">
            <select
              class="select-bordered select w-full rounded-[3px] border-none text-base  font-normal  focus:rounded-[3px] "
            >
              <!-- todo: make this dynamic -->
              <option disabled selected>What is your role?</option>
              <!-- todo: rename roles table to role -->
              <option (click)="selectRole(0)">Student</option>
              <option (click)="selectRole(1)">Subject Adviser</option>
              <option (click)="selectRole(2)">Technical Adviser</option>
            </select>
          </div>
        </div>
        <button
          (click)="isInLastStep = true"
          class="btn-primary btn w-full  rounded-[3px]  text-center text-base "
        >
          Next
        </button>
        <div class="flex flex-col gap-2">
          <div class="flex flex-row items-center gap-2 opacity-75">
            <div class="flex h-full flex-grow items-center">
              <div class="h-[2px] w-full bg-base-content/10"></div>
            </div>
            OR
            <div class="flex h-full flex-grow items-center">
              <div class="h-[2px] w-full bg-base-content/10"></div>
            </div>
          </div>
          <button
            class="btn-ghost btn flex w-full flex-row items-center justify-center gap-2 px-1 opacity-75"
          >
            <img src="assets/google.svg" alt="" />
            <a>Sign Up with Google</a>
          </button>
        </div>
        <div class="flex-grow"></div>
        <div class="flex w-full flex-row items-center justify-center gap-2">
          <div class="opacity-75">Already have an account?</div>
          <a class="btn-link btn no-underline " (click)="navigateToLogin()"
            >LOGIN</a
          >
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="isInLastStep">
      <div
        class="flex h-[568px] w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
      >
        <div class="flex flex-col gap-2 py-4">
          <div class="flex w-full justify-between">
            <h1 class="text-[2rem]">Sign Up</h1>
            <button (click)="isInLastStep = false" class="btn-ghost btn w-fit">
              Back<i-feather
                class="text-base-content/70"
                name="arrow-left"
              ></i-feather>
            </button>
          </div>

          <p class="text-xs opacity-80">
            You're almost done! Your email and password will be used to identify
            you every time you log in.
          </p>
        </div>

        <!-- todo: error message for inputs -->
        
        <input
          type="number"
          placeholder="Section"
          [(ngModel)]="section"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
          min="1"
        />
        <input
          type="text"
          placeholder="Student Number"
          [(ngModel)]="studentNumber"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <input
          type="email"
          placeholder="Email"
          [(ngModel)]="email"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <input
          type="password"
          placeholder="Password"
          [(ngModel)]="password"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />

        <button
          (click)="signUp()"
          class="btn-primary btn w-full  rounded-[3px]  text-center text-base "
        >
          SIGN UP
        </button>

        <div class="flex-grow"></div>
      </div>
    </ng-container>

    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
  `,
})
export class SignupComponent {
  @Output() toLogin: EventEmitter<void> = new EventEmitter<void>();
  email = '';
  password = '';
  section = 1;
  studentNumber = '';
  fullName = '';
  emailMessage = 'test message email';
  passwordMessage = 'test message password';
  roleId = -1;
  isInLastStep = false;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  signUp() {
    this.spinner.show();
    if (this.fullName.length === 0) throw Error('wip: name is empty');

    const user = { name: this.fullName, roleId: this.roleId };
    this.authService.signUp(this.email, this.password, user, this.studentNumber, this.section).subscribe((v) => {
      this.spinner.hide();
      this.navigateToLogin();
    });
  }

  selectRole(id: number) {
    this.roleId = id;
  }

  navigateToLogin() {
    this.toLogin.emit();
  }
}
