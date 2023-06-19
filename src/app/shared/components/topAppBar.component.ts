import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopAppBarService } from 'src/app/services/top-app-bar.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'TopAppBar',
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <h1 class="text-2xl ">{{ activePath }}</h1>

        <div class="dropdown-end dropdown ">
          <label tabindex="0"
            ><div
              class="btn-ghost btn flex flex-row items-center gap-2 text-base"
            >
              <!-- todo: fetch data from user service -->
              {{ name }}
              <div class="avatar">
                <div class="w-[40px] rounded-full">
                  <img [src]="profileUrl" />
                </div>
              </div></div
          ></label>
          <ul
            tabindex="0"
            class="dropdown-content menu w-52 rounded-[3px] bg-base-100 p-2 shadow"
          >
            <!-- <li><a class="">Profile</a></li> -->

            <a
              class="btn-ghost btn flex justify-start rounded-[3px] gap-2 text-base-content" (click)="navigateHome()"
              ><i-feather class="text-base-content/70" name="home" />home >
            </a>
            <a
              class="btn-ghost btn flex justify-start rounded-[3px] gap-2
              text-base-content" (click)="navigateProfile()" >
              <i-feather class="text-base-content/70" name="user" />profile
            </a>
            <a
              class="btn-ghost btn flex justify-start rounded-[3px] gap-2
              text-base-content" (click)="signOut()" ><i-feather
                class="text-base-content/70"
                name="log-out"
              />sign out
            </a>
          </ul>
        </div>
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
export class TopAppBarComponent implements OnInit {
  profileUrl = '';
  name = '';
  @Input() activePath? = 'Home';

  // watch for changes in
  constructor(
    private topAppBarService: TopAppBarService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    // todo: add unsubscribe or convert to signal
    this.topAppBarService.activePath$
      .subscribe
      // (path) => (this.activePath = path)
      ();
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.name = user?.name || 'unnamed';
    this.profileUrl = `https://api.multiavatar.com/${
      user?.uid || 'unnamed'
    }.png`;
  }

  signOut() {
    this.spinner.show();
    this.authService.signOut().subscribe((v) => this.spinner.hide());
  }

  navigateProfile() {
    this.router.navigate(['profile', 'view']);
  }

  navigateHome() {
    this.router.navigate(['']);
  }
}
