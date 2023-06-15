import { Component } from '@angular/core';

@Component({
  selector: 'TechnicalAdviserProject',
  template: `
    <div class="flex">
      <div class="hidden sm2:block">
        <!-- desktop navrail -->
        <NavigationRail (toggleDrawer)="toggleDrawer(myDrawer)" />
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
          <div
            class="dropdown-top dropdown-end dropdown absolute bottom-4 right-4 sm2:hidden"
          >
            <!-- mobile navrail -->
            <label tabindex="0" class="btn-primary btn  rounded-[3px]"
              ><i-feather name="menu"
            /></label>
            <div tabindex="0" class="dropdown-content  menu rounded-box w-fit">
              <NavigationRail
                [isFab]="true"
                (toggleDrawer)="toggleDrawer(myDrawer)"
              />
            </div>
          </div>

          <!-- content -->
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

        <!-- side bar -->
        <!-- md:-z-[1] fixes the bug on drawer size when loader is active -->
        <div class="drawer-side md:-z-[1]">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-fit bg-base-100 text-base-content">
            <TechnicalAdviserSideBar />
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class TechnicalAdviserProjectComponent {
  isDrawerOpen: boolean = false;

  changeDrawerState(e: Event) {
    this.isDrawerOpen = (e.currentTarget as HTMLInputElement).checked;
  }

  toggleDrawer(inputRef: HTMLInputElement) {
    this.isDrawerOpen = !this.isDrawerOpen;
    inputRef.checked = this.isDrawerOpen;
  }
}
