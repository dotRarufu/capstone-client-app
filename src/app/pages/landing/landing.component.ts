import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { CommonModule } from '@angular/common';
import { filter, tap } from 'rxjs';
import { getRolePath } from 'src/app/utils/getRolePath';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'LandingPage',
  standalone: true,
  imports: [LoginComponent, SignupComponent, CommonModule],
  template: `
    <div class="relative grid h-screen w-full place-content-center py-16">
      <img
        src="assets/plv-100.jpg"
        alt=""
        srcset=""
        class="absolute -z-[1] h-full w-full object-cover object-top brightness-75 md:object-center"
      />

      <div
        class="mx-auto px-[1rem] sm1:px-[2rem] sm2:flex sm2:w-[840px] sm2:justify-center sm2:p-0 md:w-full md:flex-row md:px-[200px] lg:w-[1040px] lg:px-0"
      >
        <ng-container *ngIf="isLogin()">
          <login (toSignUp)="isLogin.set(false)" />
        </ng-container>

        <ng-container *ngIf="!isLogin()">
          <signup (toLogin)="isLogin.set(true)" />
        </ng-container>

        <img
          class="hidden bg-primary object-cover md:block"
          src="assets/high-five.png"
          alt=""
        />
      </div>
      <div class="absolute bottom-4 right-4 text-sm">Version 2.3.1</div>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  isLogin = signal(true);
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  ngZone = inject(NgZone);
  spinner = inject(NgxSpinnerService);

  user$ = this.authService.getAuthenticatedUser();

  ngOnInit() {
    this.spinner.show();
    this.user$
      .pipe(
        tap((_) => this.spinner.hide()),
        filter(isNotNull)
      )
      .subscribe({
        next: (user) => {
          const role = getRolePath(user.role_id);
          console.log('User role:', role);
          if (role === 's') {
            this.router.navigate(['s']);

            return;
          }

          this.router.navigate(['a']);
          this.toastr.success('Welcome back ' + user.name);
        },
      });
  }
}
