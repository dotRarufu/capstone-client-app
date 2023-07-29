import { Component, OnInit } from '@angular/core';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ParticipantCardComponent } from '../card/participant-card.component';
import { CommonModule } from '@angular/common';
import { AddParticipantModalComponent } from 'src/app/student/components/modals/addParticipant.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/collection';
import { ProjectCardPreviewComponent } from './project-card-preview.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'general',
  standalone: true,
  imports: [
    FeatherIconsModule,
    ParticipantCardComponent,
    CommonModule,
    AddParticipantModalComponent,
    ProjectCardPreviewComponent,
    FormsModule
  ],

  template: `
    <div class="flex flex-col gap-[16px]">
      <div class="w-full flex flex-col sm2:flex-row gap-[16px]">
        <div class="flex flex-col gap-[8px] w-full">
          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Name</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <input
            [(ngModel)]="name"
              type="text"
              placeholder="Type here"
              class="input-bordered input input-md w-full rounded-[3px] focus:input-primary  focus:outline-0"
            />
          </div>

          <div class="flex flex-col gap-[4px]">
            <div class="text-base font-semibold">Full Title</div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <textarea
            [(ngModel)]="title"
              type="text"
              placeholder="Type here"
              class="textarea-bordered textarea input-md w-full rounded-[3px] focus:textarea-primary h-[85px] focus:outline-0"
            ></textarea>
          </div>
        </div>

        <div class="w-[320px] flex flex-col gap-[4px]">
        <div class="text-base font-semibold">Preview</div>
          <project-card-preview [name]="name" [title]="title" />
        </div>
      </div>

      <div class="flex flex-col gap-[8px]">
        <div class="flex items-center justify-between text-base font-semibold">
          Participants

          <button
            onclick="addParticipant.showModal()"
            class="btn-ghost btn-sm btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="plus" />

            Add
          </button>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
        <ParticipantCard
          *ngFor="let participant of participants"
          [user]="participant"
        />
      </div>
      
     
    </div>
  `,
})
export class GeneralComponent implements OnInit {
  participants: User[] = [];
  name = "";
  title= "";

  constructor(
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
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
