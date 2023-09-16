import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { SpinnerComponent } from 'src/app/components/spinner.component';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'signup',
  standalone: true,
  imports: [
    SpinnerComponent,
    CommonModule,
    FeatherIconsModule,
    ReactiveFormsModule,
  ],
  template: `
    <ng-container *ngIf="!isInLastStep">
      <div
        class="flex h-[568px] w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
      >
        <div class="flex flex-col gap-2 py-4">
          <h1 class="text-[2rem]">Sign Up</h1>
          <p class="text-sm opacity-80">
          Your account is your key to seamless synchronization across devices and access to personalized features. It allows you to securely store and access your data from anywhere. 
          </p>
        </div>

        <!-- todo: error message for inputs -->
        <input
          type="text"
          placeholder="Full Name"
          [formControl]="fullName"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <div class="form-control ">
          <div class="input-group rounded-[3px] border border-base-content/50">
            <select
              class="select-bordered select w-full rounded-[3px] border-none text-base  font-normal  focus:rounded-[3px] "
            >
              <!-- todo: make this dynamic -->
              <option disabled selected>What is your role?</option>

              <option (click)="roleId.setValue(0)">Student</option>
              <option (click)="roleId.setValue(5)">Adviser</option>
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
          <a class="btn-link btn no-underline " (click)="toLogin.emit()"
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

        <!-- <input
          type="number"
          placeholder="Section"
          [formControl]="section"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
          min="1"
        /> -->
        <input
          type="text"
          placeholder="Student Number"
          [formControl]="studentNumber"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <input
          type="email"
          placeholder="Email"
          [formControl]="email"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <input
          type="password"
          placeholder="Password"
          [formControl]="password"
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

    <spinner />
  `,
})
export class SignupComponent {
  @Output() toLogin = new EventEmitter<void>();

  email = new FormControl('', { nonNullable: true });
  password = new FormControl('', { nonNullable: true });
  studentNumber = new FormControl('', { nonNullable: true });
  fullName = new FormControl('', { nonNullable: true });
  roleId = new FormControl(0, { nonNullable: true });

  section = 1;

  isInLastStep = false;

  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  signUp() {
    this.spinner.show();

    const userInfo = {
      studentNumber: this.studentNumber.value,
      name: this.fullName.value,
      roleId: this.roleId.value,
    };

    this.authService
      .signUp(this.email.value, this.password.value, userInfo)
      .subscribe({
        next: (value) => {
          this.toastr.success('Sign up success');
          this.spinner.hide();
          this.toLogin.emit();
        },
        error: (value) => {
          this.spinner.hide();
          this.toastr.error(value as string);
        },
      });
  }
}
