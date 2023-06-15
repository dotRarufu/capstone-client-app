import { Component } from '@angular/core';

@Component({
  selector: 'StudentProject',
  template: `
    <div class="flex">
      <div class="hidden sm2:block">
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
          <!-- navrail -->
          <div
            class="dropdown-top dropdown-end dropdown absolute bottom-4 right-4 sm2:hidden"
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
        <!-- lg:-z-[1] fixes the bug on drawer size when loader is active -->
        <div class="drawer-side lg:-z-[1]">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-fit bg-base-100 text-base-content">
            <StudentSideBar />
          </ul>
        </div>
      </div>
    </div>
  `,
})
export class StudentProjectComponent {
  isDrawerOpen: boolean = false;

  toggleDrawer(inputRef: HTMLInputElement) {
    this.isDrawerOpen = !this.isDrawerOpen;
    inputRef.checked = this.isDrawerOpen;
  }

  changeDrawerState(e: Event) {
    this.isDrawerOpen = (e.currentTarget as HTMLInputElement).checked;
  }
}

//  <!-- scrapped bottom bar -->
//     <!-- <div class=" btm-nav bg-primary text-primary-content flex">

//      <button class="btn-ghost btn flex-1 rounded-[3px] bg-base-100 text-base-content">
//        <div class="h-5 w-5">
//          <i-feather class="text-base-content/70"name="trello"></i-feather>
//        </div>
//        <span class="btm-nav-label text-[10px]">Tasks</span>
//      </button>
//      <button class="btn-ghost btn flex-1 rounded-[3px]">
//        <div class="h-5 w-5">
//          <i-feather class="text-base-content/70"name="monitor"></i-feather>
//        </div>
//        <span class="btm-nav-label text-[10px]">Dashboard</span>
//      </button>
//      <button class="btn-ghost btn flex-1 rounded-[3px]">
//        <div class="h-5 w-5">
//          <i-feather class="text-base-content/70"name="clipboard"></i-feather>
//        </div>
//        <span class="btm-nav-label text-[10px]">Consult</span>
//      </button>
//      <button class="btn-ghost btn flex-1 rounded-[3px]">
//        <div class="h-5 w-5">
//          <i-feather class="text-base-content/70"name="users"></i-feather>
//        </div>
//        <span class="btm-nav-label text-[10px]">Participants</span>
//      </button>
//      <button class="btn-ghost btn flex-1 rounded-[3px]">
//        <div class="h-5 w-5">
//          <i-feather class="text-base-content/70"name="file-text"></i-feather>
//        </div>
//        <span class="btm-nav-label text-[10px]">Forms</span>
//      </button>
//    </div> -->
