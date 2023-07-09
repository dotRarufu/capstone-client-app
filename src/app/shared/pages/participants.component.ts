import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'StudentParticipants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex items-center justify-between">
        <h1 class="text-[24px] text-base-content sm1:text-[32px]">
          Participants
        </h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex gap-4">
        <table
          class="flex table w-fit flex-col gap-2  sm1:items-center sm2:items-start"
        >
          <!-- <li  *ngFor="let participant of participants"> -->
          <!-- <a class="p-0 btn btn-ghost"> -->
          <tbody>
            <tr *ngFor="let participant of participants">
              <td class="p-2">
                <ParticipantCard [user]="participant" />
              </td>
            </tr>
          </tbody>
        </table>
        <!-- </a> -->
        <!-- </li> -->
        <!-- </> -->
        <div class="border-neutrla hidden h-full w-full border-l sm2:block">
          WIP name, uid, role, profile picture, reports
          <!-- <div class="placeholder avatar">
            <div
              class="w-24 rounded-full bg-neutral-focus text-neutral-content"
            >
              <span class="text-3xl">K</span>
            </div>
          </div> -->
        </div>
        <!-- </div> -->
      </div>
    </div>
  `,
})
export class ParticipantsPageComponent implements OnInit {
  participants: User[] = [];

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    const participants$ = this.projectService.getParticipants();

    participants$.subscribe({
      next: (p) => {
        if (p === null) {
          this.participants = [];
          this.spinner.show();

          return;
        }
        this.spinner.hide();

        this.participants = p;
      },
      complete: () => console.log('getParticipants complete'),
    });
  }
}
