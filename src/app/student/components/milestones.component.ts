import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MilestoneCardComponent } from 'src/app/components/milestone/card.component';
import { MilestoneListItemComponent } from 'src/app/components/milestone/list-item.component';
import { AddMilestoneModalComponent } from 'src/app/components/modal/add-milestone.component';
import { MilestoneService } from 'src/app/services/milestone.service';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'milestones',
  standalone: true,
  imports: [
    MilestoneCardComponent,
    CommonModule,
    RouterModule,
    MilestoneListItemComponent,
    AddMilestoneModalComponent,
  ],
  template: `
    <h1 class="text-[32px] text-base-content hidden min-[998px]:block">Milestones</h1>

    <div
      class="flex h-full flex-col justify-start gap-x-[16px] sm1:grid sm1:grid-cols-[auto_1fr] md:grid-cols-[1fr_3fr]"
    >
      <ul
        [class.hidden]="myOutlet.isActivated"
        class="steps steps-vertical sm1:block "
      >
        <li
          *ngFor="let milestone of milestones"
          class="step"
          [class.step-primary]="milestone.isAchieved"
        >
          <div class="flex w-full items-center justify-between">
            <span
              class="btn-link btn px-0 text-left text-base-content no-underline"
              [routerLink]="[milestone.id]"
              routerLinkActive="text-primary"
            >
              {{ milestone.title }}
            </span>
            <div class="badge badge-secondary sm1:hidden">
              {{ milestone.dueDate }}
            </div>
          </div>
        </li>
        <li
          onclick="addMilestone.showModal()"
          class="btn-ghost btn-sm btn w-full"
        >
          Add
        </li>
      </ul>

      <div>
        <router-outlet #myOutlet="outlet" />
        <div
          class="hidden pt-[16px] text-base text-base-content/50 sm1:block"
          *ngIf="!myOutlet.isActivated"
        >
          Select a milestone
        </div>
      </div>
    </div>

    <add-milestone-modal />
  `,
})
export class MilestonesComponent implements OnInit {
  data = [0, 1, 2];
  milestones: {
    title: string;
    isAchieved: boolean;
    dueDate: string;
    id: number;
  }[] = [];

  constructor(
    private milestoneService: MilestoneService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const projectId = Number(this.route.parent!.snapshot.url[0].path);

    this.milestoneService.getMilestones(projectId).subscribe({
      next: (milestones) => {
        const a = milestones.map((m) => {
          return {
            dueDate: new Date(m.due_date),
            title: m.title,
            isAchieved: m.is_achieved,
            id: m.milestone_id,
          };
        });

        const sorted = a
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
          .map((a) => ({
            ...a,
            isAchieved: !!a.isAchieved,
            dueDate: a.dueDate.toDateString(),
          }));

        this.milestones = sorted;
      },
      error: (err) => {
        this.toastr.error('error getting milestones:', err);
      },
    });
  }
}
