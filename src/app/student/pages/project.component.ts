import { Component } from '@angular/core';

@Component({
  selector: 'StudentProject',
  template: `
    <ProjectLayout>
      <StudentSideBar />
    </ProjectLayout>
  `,
})
export class StudentProjectComponent {}

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
