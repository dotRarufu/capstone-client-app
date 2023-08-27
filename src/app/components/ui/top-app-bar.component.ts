import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { getRolePath } from 'src/app/utils/getRolePath';

@Component({
  selector: 'top-app-bar',
  standalone: true,
  imports: [FeatherIconsModule, NgxSpinnerModule],
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <h1 class="text-xl ">{{ activePath }}</h1>

        <div class="dropdown-end dropdown ">
          <label tabindex="0"
            ><div
              class="btn-ghost btn flex flex-row items-center gap-2 text-base"
            >
              {{ name }}
              <div class="avatar">
                <div class="w-[40px] rounded-full">
                  <img [src]="profileUrl" />
                </div>
              </div></div
          ></label>
          <ul
            tabindex="0"
            class="dropdown-content menu z-[999] w-52 rounded-[3px] bg-base-100 p-2 shadow"
          >
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="navigateHome()"
              ><i-feather class="text-base-content/70" name="home" />home >
            </a>
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]
              text-base-content"
              (click)="navigateProfile()"
            >
              <i-feather class="text-base-content/70" name="user" />profile
            </a>
            <a
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px]
              text-base-content"
              (click)="signOut()"
              ><i-feather class="text-base-content/70" name="log-out" />sign out
            </a>
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class TopAppBarComponent implements OnInit {
  profileUrl = '';
  name = '';
  @Input() activePath? = 'Home';

  authService = inject(AuthService);
  spinner = inject(NgxSpinnerService);
  router = inject(Router);

  ngOnInit(): void {
    // call an async function here, user's profile does not have to be immediately visible
    this.setupUser();
  }

  async setupUser() {
    const user = await this.authService.getAuthenticatedUser();

    // if (user === null) throw new Error("should be impossiblr")

    this.name = user?.name || 'unnamed';
    this.profileUrl = `https://api.multiavatar.com/${
      user?.uid || 'unnamed'
    }.png`;
  }

  signOut() {
    this.spinner.show();
    // Todo: test for completion
    this.authService.signOut().subscribe((v) => this.spinner.hide());
  }

  navigateProfile() {
    this.router.navigate(['profile', 'view']);
  }

  async navigateHome() {
    const user = await this.authService.getAuthenticatedUser();

    if (user !== null) {
      const rolePath = getRolePath(user.role_id);
      const route = [rolePath, 'home'];

      if (rolePath !== 's') {
        route.unshift('a');
      }

      this.router.navigate(route);
    }
  }
}
