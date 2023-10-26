import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
            Your account is your key to seamless synchronization across devices
            and access to personalized features. It allows you to securely store
            and access your data from anywhere.
          </p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          [formControl]="fullName"
          class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
        />
        <div class="form-control ">
          <div class="input-group rounded-[3px] border border-base-content/50">
            <select
              [formControl]="roleId"
              class="select-bordered select w-full rounded-[3px] border-none text-base  font-normal  focus:rounded-[3px] "
            >
              <option disabled [ngValue]="-1">What is your role?</option>

              <option [ngValue]="0">Student</option>
              <option [ngValue]="5">Adviser</option>
            </select>
          </div>
        </div>
        <button
          (click)="toLastStep()"
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
            (click)="signUpWithGoogle()"
            class="btn-ghost btn flex w-full flex-row items-center justify-center gap-2 px-1 opacity-75"
          >
            <img src="assets/google.svg" alt="" />
            <a>Sign Up with Google</a>
          </button>
        </div>
        <div class="flex-grow"></div>
        <div class="flex w-full flex-row items-center justify-center gap-2">
          <div class="opacity-75">Already have an account?</div>
          <a class="btn-link btn no-underline " (click)="loginClick()">LOGIN</a>
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
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  studentNumber = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^\\d{2}-\\d{4}$')],
  });
  fullName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')],
  });
  roleId = new FormControl(-1, {
    nonNullable: true,
    validators: [Validators.required, this.roleIdValidator()],
  });

  section = 1;

  isInLastStep = false;

  router = inject(Router);
  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  toLastStep() {
    console.log('1');
    if (this.fullName.invalid) {
      this.toastr.error('Invalid name');

      return;
    }

    if (this.roleId.invalid) {
      this.toastr.error('Role cannot be empty');

      return;
    }

    this.isInLastStep = true;
  }

  roleIdValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      console.log('vlaidator:', control.value);
      if (![0, 5].includes(control.value)) return { emptyRoleId: true };

      return null;
    };
  }

  signUp() {
    if (this.email.invalid) {
      this.toastr.error('Invalid email');

      return;
    }

    if (this.password.invalid) {
      this.toastr.error('Password cannot be empty');

      return;
    }

    if (this.studentNumber.invalid) {
      this.toastr.error('Invalid student number');

      return;
    }

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
         
        },
        error: (value) => {
          this.spinner.hide();
          this.toastr.error('Sign up failed, try again');
        },
      });
  }

  signUpWithGoogle() {
    this.authService.signUpWithGoogle().subscribe({
      next: () => {
        console.log("done sign up with google")
      }
    })
  }

  loginClick() {
    this.router.navigate(['login']);
  }
}
