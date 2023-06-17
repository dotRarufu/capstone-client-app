import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/types/collection';

@Component({
  selector: 'TechnicalAdviserParticipants',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex items-center justify-between">
        <h1 class="text-[24px] text-base-content sm1:text-[32px]">
          Participants
        </h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div class="flex w-full flex-col justify-center gap-2">
      <TechnicalAdviserParticipantCard *ngFor="let participant of participants" [user]="participant"/>
      </div>
    </div>
  `,
})
export class ParticipantsComponent implements OnInit {
  participants: User[] = []

  constructor(private projectService: ProjectService,  private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    const participants$ =this.projectService.getParticipants();
    participants$.subscribe({
     

      next: (p) => {
        if (p === null) {
          this.participants = [];
          this.spinner.show();
  
          return;
        }
        this.spinner.hide();

        this.participants = p;
      }
    })

  }
}
