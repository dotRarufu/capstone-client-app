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
  selector: 'app-project',
  template: `
    <!-- <div class="flex h-screen">
      <app-nav-rail></app-nav-rail>
      <app-capstone-adviser-side-bar></app-capstone-adviser-side-bar>

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
            <app-capstone-adviser-side-bar></app-capstone-adviser-side-bar>
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
