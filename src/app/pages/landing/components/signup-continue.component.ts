import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
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
import { catchError, from, map, switchMap, of } from 'rxjs';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { SpinnerComponent } from 'src/app/components/spinner.component';
import { LandingLayoutComponent } from 'src/app/components/ui/landing-layout.component';
import supabaseClient from 'src/app/lib/supabase';
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
    LandingLayoutComponent,
  ],
  template: `
    <landing-layout>
      <div
        class="flex h-[568px] w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
      >
        <div class="flex flex-col gap-2 py-4">
          <h1 class="text-[2rem]">Sign Up with Google</h1>
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
        <input
          type="text"
          placeholder="Student Number"
          [formControl]="studentNumber"
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
          (click)="signUp()"
          class="btn-primary btn w-full  rounded-[3px]  text-center text-base "
        >
          Next
        </button>

        <div class="flex-grow"></div>
      </div>
    </landing-layout>

    <spinner />
  `,
})
export class SignupContinueComponent implements OnInit {
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
   
      if (![0, 5].includes(control.value)) return { emptyRoleId: true };

      return null;
    };
  }

  ngOnInit(): void {
    const client = supabaseClient;
    const user = client.auth.getUser();
    from(user).pipe(
      switchMap(u => {
        const userId = u.data.user!.id;

        return this.authService.getUser(userId);
      }),
      
    ).subscribe({
      next: () => this.router.navigate(["/"])
    })

  }

  signUp() {
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

    this.authService.continueSignUp(userInfo).subscribe({
      next: (value) => {
        this.toastr.success('Sign up success');
        this.spinner.hide();
        this.router.navigate(['/']);
      },
      error: (value) => {
        this.spinner.hide();
        this.toastr.error('Sign up failed, try again');
      },
    });
  }
}
