import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopAppBarService } from 'src/app/services/top-app-bar.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-app-bar',
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <h1 class="text-2xl ">{{ activePath || 'Home' }}</h1>

        <div class="dropdown-end dropdown">
          <label tabindex="0"
            ><div class="btn btn-ghost flex flex-row items-center gap-2 text-base">
              <!-- todo: fetch data from user service -->
              {{name}}
              <div class="avatar">
                <div class="w-[40px] rounded-full">
                  <img [src]="profileUrl" />
                </div>
              </div></div
          ></label>
          <ul
            tabindex="0"
            class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            <!-- <li><a class="">Profile</a></li> -->
            <li><a class="flex justify-between" (click)="signOut()">Sign Out <i-feather name="log-out"></i-feather></a></li>
          </ul>
        </div>

        
      </div>
    </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class TopAppBarComponent implements OnInit{
  profileUrl = '';
  name = '';
  activePath = '';

  // watch for changes in
  constructor(private topAppBarService: TopAppBarService, private authService: AuthService) {
    // todo: add unsubscribe or convert to signal
    this.topAppBarService.activePath$
      .subscribe
      // (path) => (this.activePath = path)
      ();
  }

  signOut() {
    this.authService.signOut()
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.name = user?.name || 'unnamed'
    this.profileUrl = `https://api.multiavatar.com/${user?.uid || 'unnamed'}.png`
  }
}
