import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
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
        <ng-container *ngIf="isLogin">
          <Login (toSignUp)="toSignUp()" />
        </ng-container>

        <ng-container *ngIf="!isLogin">
          <SignUp (toLogin)="toLogin()" />
        </ng-container>

        <img
          class="hidden bg-primary object-cover md:block"
          src="assets/high-five.png"
          alt=""
        />
      </div>
    </div>
  `,
})
export class LandingComponent implements OnInit {
  isLogin = true;

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser();
    if (user != null) {
      if (user.role_id === null) throw new Error('user has no role id');
      const rolePath = getRolePath(user.role_id);
      this.router.navigate([rolePath, 'home']);
    }
  }

  ngOnInit(): void {}

  toSignUp() {
    this.isLogin = false;
  }

  toLogin() {
    this.isLogin = true;
  }
}
