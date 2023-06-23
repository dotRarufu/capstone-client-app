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
        <button
          onclick="addParticipant.showModal()"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus" />

          Add
        </button>
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
                <StudentParticipantCard [user]="participant" />
              </td>
            </tr>
          </tbody>
        </table>
        <!-- </a> -->
        <!-- </li> -->
        <!-- </> -->
        <div class="border-neutrla hidden h-full w-full border-l sm2:block">
          WIP name, uid, role, profile picture, dashboard
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

      <Modal inputId="addParticipant">
        <div
          class="flex w-[712px] flex-col rounded-[3px] border border-base-content/10"
        >
          <div class="flex justify-between bg-primary p-[24px]">
            <div class="flex w-full flex-col justify-between">
              <input
                [(ngModel)]="userUid"
                type="text"
                placeholder="User ID"
                class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
              />
            </div>
          </div>

          <div class="flex bg-base-100">
            <div class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4">
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Role</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="form-control rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50"
              >
                <div
                  class="input-group rounded-[3px] border border-base-content/50"
                >
                  <select
                    class="select-bordered select w-full rounded-[3px] border-none text-base font-normal  outline-0  focus:rounded-[3px] "
                  >
                    <!-- todo: make this dynamic -->
                    <option disabled selected>Select a role</option>
                    <!-- todo: rename roles table to role -->
                    <option (click)="selectRole(0)">Student</option>
                    <option (click)="selectRole(1)">Subject Adviser</option>
                    <option (click)="selectRole(2)">Technical Adviser</option>
                  </select>
                </div>
              </div>
            </div>
            <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 py-2">
              <button
                (click)="addParticipant()"
                class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              >
                <i-feather class="text-base-content/70" r name="check-square" />
                done
              </button>

              <div class="h-full"></div>
              <button
                class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              >
                <i-feather class="text-base-content/70" name="x-circle" />
                close
              </button>
            </ul>
          </div>
        </div>
      </Modal>

      <ngx-spinner
        bdColor="rgba(0, 0, 0, 0.8)"
        size="default"
        color="#fff"
        type="square-loader"
        [fullScreen]="true"
        ><p style="color: white">Loading...</p></ngx-spinner
      >
    </div>
  `,
})
export class ParticipantsComponent implements OnInit {
  roleId = -1;
  userUid = '';
  participants: User[] = [];

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
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

  selectRole(id: number) {
    this.roleId = id;
  }

  addParticipant() {
    this.spinner.show();
    const projectId = this.projectService.activeProjectId();
    const addParticipant$ = this.projectService.addParticipant(
      this.roleId,
      this.userUid,
      projectId
    );

    addParticipant$.subscribe({
      error: (e) => {
        this.spinner.hide();
        this.toastr.error(e);
      },
      complete: () => {
        this.spinner.hide();
        this.toastr.success('Participant added successfully');
      },
    });
  }
}
