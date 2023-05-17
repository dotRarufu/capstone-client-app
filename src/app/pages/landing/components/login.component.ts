import {
  EventEmitter,
  Output,
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  template: `
    <div
      class="flex h-fit w-full max-w-[387px] flex-col gap-4 rounded-[3px] bg-base-100 px-[2rem] py-8"
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
            <!-- TODO: move this svg in its own component -->
            <svg
              class="fill-current"
              width="144"
              height="2"
              viewBox="0 0 144 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y1="1"
                x2="143.5"
                y2="1"
                stroke="currentColor"
                stroke-opacity="0.5"
              />
            </svg>
          </div>
          OR
          <div class="flex h-full flex-grow items-center">
            <!-- TODO: move this svg in its own component -->
            <svg
              class="fill-current"
              width="144"
              height="2"
              viewBox="0 0 144 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                y1="1"
                x2="143.5"
                y2="1"
                stroke="currentColor"
                stroke-opacity="0.5"
              />
            </svg>
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
  `,
})
export class LoginComponent {
  @Output() toSignUp: EventEmitter<void> = new EventEmitter<void>();
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  handleButtonClick() {
    const signIn$ = this.supabaseService.signInUser(this.email, this.password);
    signIn$.subscribe((v) => {
      console.log('signIn$ emits');
      this.router.navigate(['c', 'home', 'projects']);
    });
  }

  navigateToSignUp() {
    this.toSignUp.emit();
  }
}
