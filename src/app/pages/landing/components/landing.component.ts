import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <div
      class="h-screen relative grid w-full place-content-center py-16"
    >
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
          <app-login (toSignUp)="toSignUp()"></app-login>
        </ng-container>

        <ng-container *ngIf="!isLogin">
          <app-signup (toLogin)="toLogin()"></app-signup>
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
export class LandingComponent {
  isLogin = true;
 

  constructor() {
    // window.addEventListener('keydown', () => {this.isLoading = !this.isLoading; console.log('keypress')})
  }

  toSignUp() {
    this.isLogin = false;
  }

  toLogin() {
    this.isLogin = true;
  }
}
