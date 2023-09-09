import {
  EventEmitter,
  Output,
  Component,
  inject,
  effect,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { filter, from, tap, map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';
import { isNotNull } from 'src/app/utils/isNotNull';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from 'src/app/components/spinner.component';

@Component({
  selector: 'login',
  standalone: true,
  imports: [SpinnerComponent, ReactiveFormsModule],
  template: `
    <div
      class="flex h-fit max-h-[568px] w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
    >
      <div class="flex flex-col gap-2 py-4">
        <h1 class="text-[2rem]">Login</h1>
        <p class="text-xs opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostru
        </p>
      </div>
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
        (click)="handleButtonClick()"
        class="btn-primary btn w-full  rounded-[3px]  text-center text-base "
      >
        LOGIN
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
          <a>Login with Google</a>
        </button>
      </div>
      <div class="flex-grow"></div>
      <div class="flex w-full flex-row items-center justify-center gap-2">
        <div class="opacity-75">Don't have an account?</div>
        <a class="btn-link btn no-underline " (click)="toSignUp.emit()"
          >SIGN UP</a
        >
      </div>
    </div>

    <spinner />
  `,
})
export class LoginComponent {
  @Output() toSignUp = new EventEmitter<void>();
  email = new FormControl('', { nonNullable: true });
  password = new FormControl('', { nonNullable: true });

  authService = inject(AuthService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);

  authenticatedUser$ = this.authService.getAuthenticatedUser().pipe(
    filter(isNotNull),
    switchMap((user) => this.authService.getUser(user.uid))
  );
  authenticatedUser = toSignal(this.authenticatedUser$);

  handleButtonClick() {
    this.spinner.show();

    const signIn$ = this.authService.login(
      this.email.value,
      this.password.value
    );

    signIn$
      .pipe(
        filter(isNotNull),
        map((user) => getRolePath(user.role_id)),
        tap((_) => this.spinner.hide())
      )
      .subscribe({
        next: (rolePath) => {
          this.router.navigate([rolePath, 'home']);
        },
        error: () => {
          this.spinner.hide();
          this.toastr.error('Login failed');
        },
      });
  }
}
