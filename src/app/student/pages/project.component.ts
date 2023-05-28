import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterEvent } from '@angular/router';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-student-project',
  template: `
    <!-- <div class="flex h-screen">
      <app-nav-rail></app-nav-rail>
      <app-student-side-bar></app-student-side-bar>

      <div
        class="w-full px-[16px] sm1:px-[32px] sm2:px-0 md:px-[200px] lg:px-0"
      >
        <div class="w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]">
          <app-form-generator></app-form-generator>
        </div>
      </div>
    </div> -->
    <div class="flex">
      <div class="hidden sm2:block">
      <app-nav-rail (toggleDrawer)="toggleDrawer(myDrawer)"></app-nav-rail>
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
          <!-- Page content here -->
          <div class="dropdown dropdown-top dropdown-end absolute bottom-4 right-4 sm2:hidden">
            <label tabindex="0" class="btn btn-primary  rounded-[3px]"><i-feather name="menu"></i-feather></label>
            <div
              tabindex="0"
              class="dropdown-content  menu rounded-box w-fit"
            >
              <app-nav-rail
                [isFab]="true"
                (toggleDrawer)="toggleDrawer(myDrawer)"
              ></app-nav-rail>
            </div>
          </div>

          <div
            class="w-full px-[16px] sm1:px-[32px] sm2:px-0 md:px-[200px] lg:px-0"
          >
            <div
              class="h-screen w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
            >
              <!-- <label for="my-drawer" class="btn-primary drawer-button btn"
            >Open drawer</label
          > -->
              <!-- <app-form-generator></app-form-generator> -->
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-fit bg-base-100 text-base-content">
            <!-- Sidebar content here -->
            <app-student-side-bar></app-student-side-bar>
          </ul>
        </div>
      </div>
    </div>

    <!-- scrapped bottom bar -->
    <!-- <div class=" btm-nav bg-primary text-primary-content flex">
     
     <button class="btn-ghost btn flex-1 rounded-[3px] bg-base-100 text-base-content">
       <div class="h-5 w-5">
         <i-feather name="trello"></i-feather>
       </div>
       <span class="btm-nav-label text-[10px]">Tasks</span>
     </button>
     <button class="btn-ghost btn flex-1 rounded-[3px]">
       <div class="h-5 w-5">
         <i-feather name="monitor"></i-feather>
       </div>
       <span class="btm-nav-label text-[10px]">Dashboard</span>
     </button>
     <button class="btn-ghost btn flex-1 rounded-[3px]">
       <div class="h-5 w-5">
         <i-feather name="clipboard"></i-feather>
       </div>
       <span class="btm-nav-label text-[10px]">Consult</span>
     </button>
     <button class="btn-ghost btn flex-1 rounded-[3px]">
       <div class="h-5 w-5">
         <i-feather name="users"></i-feather>
       </div>
       <span class="btm-nav-label text-[10px]">Participants</span>
     </button>
     <button class="btn-ghost btn flex-1 rounded-[3px]">
       <div class="h-5 w-5">
         <i-feather name="file-text"></i-feather>
       </div>
       <span class="btm-nav-label text-[10px]">Forms</span>
     </button>
   </div> -->
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
