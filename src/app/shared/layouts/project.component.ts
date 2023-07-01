import { Component } from '@angular/core';

@Component({
  selector: 'ProjectLayout',
  template: `
    <div class="flex">
      <!-- "min-[998px]" makes up for the space taken by navrail -->
      <div class="hidden min-[998px]:block">
        <NavigationRail (toggleDrawer)="toggleDrawer(myDrawer)" />
      </div>

      <div class="drawer lg:drawer-open">
        <input
          type="checkbox"
          #myDrawer
          (change)="changeDrawerState($event)"
          id="my-drawer"
          class="drawer-toggle"
        />
        <div class="drawer-content ">
          <!-- navrail fab-->
          <div
            class="dropdown-top dropdown-end dropdown absolute bottom-4 right-4 min-[998px]:hidden"
          >
            <label tabindex="0" class="btn-primary btn  rounded-[3px]"
              ><i-feather name="menu" />
            </label>
            <div tabindex="0" class="dropdown-content  menu rounded-box w-fit">
              <NavigationRail
                [isFab]="true"
                (toggleDrawer)="toggleDrawer(myDrawer)"
              />
            </div>
          </div>

          <!-- page content -->
          <div
            class="h-screen w-screen overflow-y-scroll p-4 px-[16px] sm1:px-[32px] sm2:w-full sm2:px-0 md:px-[200px] lg:px-0"
          >
            <div
              class=" w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
            >
              <router-outlet />
            </div>
          </div>
        </div>

        <!-- milestone sidebar -->
        <!-- "absolute" fixes the problem of not attaching in navrail -->
        <div class="drawer-side absolute">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-fit bg-base-100 text-base-content">
            <ng-content />
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
export class ProjectLayoutComponent {
  isDrawerOpen: boolean = false;

  toggleDrawer(inputRef: HTMLInputElement) {
    this.isDrawerOpen = !this.isDrawerOpen;
    inputRef.checked = this.isDrawerOpen;
  }

  changeDrawerState(e: Event) {
    this.isDrawerOpen = (e.currentTarget as HTMLInputElement).checked;
  }
}
