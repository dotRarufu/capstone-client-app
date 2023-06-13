import { Component } from '@angular/core';

@Component({
  template: `
    <div class="flex">
      <div class="hidden sm2:block">
        <app-nav-rail (toggleDrawer)="toggleDrawer(myDrawer)" />
      </div>

      <div class="drawer lg:drawer-mobile">
        <input
          type="checkbox"
          #myDrawer
          (change)="changeDrawerState($event)"
          id="my-drawer"
          class="drawer-toggle"
        />
        <div class="drawer-content p-4">
          <!-- navrail -->
          <div
            class="dropdown-top dropdown-end dropdown absolute bottom-4 right-4 sm2:hidden"
          >
            <label tabindex="0" class="btn-primary btn  rounded-[3px]"
              ><i-feather name="menu" />
            </label>
            <div tabindex="0" class="dropdown-content  menu rounded-box w-fit">
              <app-nav-rail
                [isFab]="true"
                (toggleDrawer)="toggleDrawer(myDrawer)"
              />
            </div>
          </div>

          <!-- page content -->
          <div
            class="w-full px-[16px] sm1:px-[32px] sm2:px-0 md:px-[200px] lg:px-0"
          >
            <div
              class="h-screen w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
            >
              <router-outlet />
            </div>
          </div>
        </div>

        <!-- milestone sidebar -->
        <div class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-fit bg-base-100 text-base-content">
            <app-capstone-adviser-side-bar />
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class ProjectComponent {
  isDrawerOpen: boolean = false;

  toggleDrawer(inputRef: HTMLInputElement) {
    this.isDrawerOpen = !this.isDrawerOpen;
    inputRef.checked = this.isDrawerOpen;
  }

  changeDrawerState(e: Event) {
    this.isDrawerOpen = (e.currentTarget as HTMLInputElement).checked;
  }
}
