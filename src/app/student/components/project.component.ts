import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ParticipantCardComponent } from 'src/app/components/card/participant-card.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/types/collection';
import { AddParticipantModalComponent } from './modals/addParticipant.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'project',
  standalone: true,
  imports: [
    FeatherIconsModule,
    ParticipantCardComponent,
    CommonModule,
    AddParticipantModalComponent,
    RouterModule,
  ],
  template: `
    <div
      class="flex h-fit sm1:h-full  flex-col gap-[16px] overflow-y-clip"
    >
      <h1 class="text-[24px] text-base-content sm1:text-[32px] hidden min-[998px]:block">Project</h1>

      <div
        class="flex  flex-col gap-[16px] sm1:grid sm1:grid-cols-[auto_1fr] sm1:flex-1 overflow-y-scroll md:grid-cols-[1fr_3fr] pb-[16px] sm1:pb-0"
      >
        <ul class="flex w-full flex-col gap-[4px] overflow-y-scroll">
          <a
            [routerLink]="['general']"
            routerLinkActive="btn-active"
            class="btn-ghost btn flex-col items-start justify-center rounded-[3px]  normal-case"
            ><span>General</span></a
          >
          <a
            class="btn-ghost btn flex-col items-start justify-center rounded-[3px]  normal-case"
            ><span>Notifications</span></a
          >
          <a
            [routerLink]="['reports']"
            routerLinkActive="btn-active"
            class="btn-ghost btn flex-col items-start justify-center rounded-[3px]  normal-case"
            ><span>Reports</span></a
          >
          <a
            [routerLink]="['forms']"
            routerLinkActive="btn-active"
            class="btn-ghost btn flex-col items-start justify-center rounded-[3px]  normal-case"
            ><span>Forms</span></a
          >
          <a
            [routerLink]="['danger-zone']"
            routerLinkActive="btn-active"
            class="btn-ghost btn flex-col items-start justify-center rounded-[3px]  normal-case"
            ><span>Danger Zone</span></a
          >
        </ul>

        <div
          class="h-full overflow-y-scroll w-full overflow-x-scroll sm1:pr-[32px] min-[998px]:h-full"
        >
          <router-outlet />
        </div>
      </div>
    </div>
    <AddParticipantModal />
  `,
})
export class ProjectComponent {
  constructor() {
    console.log("project omponent renders");
  }
}
