import { EventEmitter, Output, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'Login',
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
        <a class="btn-link btn no-underline " (click)="navigateToSignUp()"
          >SIGN UP</a
        >
      </div>
    </div>

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
export class LoginComponent {
  @Output() toSignUp: EventEmitter<void> = new EventEmitter<void>();
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  handleButtonClick() {
    this.spinner.show();
    const signIn$ = this.authService.login(this.email, this.password);
    signIn$.subscribe({
      next: (user) => {
        // todo: refactor
        if (user.role_id === null) throw Error('user does not have a role');
        const role = getRolePath(user.role_id);
        this.spinner.hide();
        this.router.navigate([role]);
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Login failed');
      },
    });
  }

  navigateToSignUp() {
    this.toSignUp.emit();
  }
}
