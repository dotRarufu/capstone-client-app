import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ParticipantCardComponent } from 'src/app/components/card/participant-card.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/types/collection';
import { AddParticipantModalComponent } from './modals/addParticipant.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Participants',
  standalone: true,
  imports: [
    FeatherIconsModule,
    ParticipantCardComponent,
    CommonModule,
    AddParticipantModalComponent,
  ],
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

      <div class="border border-red-500">test</div>

      <AddParticipantModal />
    </div>
  `,
})
export class ParticipantsComponent implements OnInit {
  participants: User[] = [];

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('debuyg:', this.route.parent!.snapshot.url[0].path);
    const projectId = Number(this.route.parent!.snapshot.url[0].path);
    // console.log("debug | projectId:", projectId);
    const participants$ = this.projectService.getParticipants(projectId);

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
