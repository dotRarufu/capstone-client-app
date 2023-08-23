import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddMilestoneModalComponent } from 'src/app/pages/project/pages/milestones/add-milestone.component';
import { MilestoneService } from 'src/app/services/milestone.service';
import { FeatherIconsModule } from '../../../../components/icons/feather-icons.module';
import { AuthService } from 'src/app/services/auth.service';
import { from } from 'rxjs';
import { getRolePath } from 'src/app/utils/getRolePath';

type Milestone = {
  title: string;
  isAchieved: boolean;
  dueDate: string;
  id: number;
};

@Component({
  selector: 'milestones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AddMilestoneModalComponent,
    FeatherIconsModule,
  ],
  template: `
    <h1 class="hidden text-2xl text-base-content min-[998px]:block">
      Milestones
    </h1>

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
          *ngIf="isCapstoneAdviser"
          onclick="addMilestone.showModal()"
          class="btn-ghost btn-sm flex flex-row items-center justify-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
        >
          <i-feather
            class="h-[20px] w-[20px] text-base-content/70"
            name="plus"
          />
          <span class="uppercase"> Add </span>
        </li>
      </ul>

      <div>
        <router-outlet #myOutlet="outlet" />
        <div class="hidden pt-[20px] sm1:block" *ngIf="!myOutlet.isActivated">
          <div
            class=" flex flex-col items-center justify-center gap-[8px] text-base-content/50"
          >
            <i-feather name="flag" class="" />
            <span class="text-base">Select a milestone</span>
          </div>
        </div>
      </div>
    </div>

    <add-milestone-modal />
  `,
})
export class MilestonesComponent implements OnInit {
  data = [0, 1, 2];
  milestones: Milestone[] = [];

  milestoneService = inject(MilestoneService);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  isCapstoneAdviser = false;

  ngOnInit(): void {
    const user$ = from(this.authService.getAuthenticatedUser());
    user$.subscribe({
      next: (u) => {
        if (u === null) return;

        this.isCapstoneAdviser = getRolePath(u.role_id) === 'c';
      },
    });

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
