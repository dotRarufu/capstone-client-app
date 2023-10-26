import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { CommonModule } from '@angular/common';
import { filter, tap } from 'rxjs';
import { getRolePath } from 'src/app/utils/getRolePath';
import { isNotNull } from 'src/app/utils/isNotNull';
import { ToastrService } from 'ngx-toastr';
import { LandingLayoutComponent } from 'src/app/components/ui/landing-layout.component';

@Component({
  selector: 'LandingPage',
  standalone: true,
  imports: [LoginComponent, SignupComponent, CommonModule, RouterModule, LandingLayoutComponent],
  template: `
    <landing-layout>
      <router-outlet />
    </landing-layout>

  `,
})
export class LandingComponent implements OnInit {
  // isLogin = signal(true);
  authService = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  // ngZone = inject(NgZone);
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
        error: () => this.spinner.hide()
      });
  }
}
