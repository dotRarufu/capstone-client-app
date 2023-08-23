import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MilestoneCardComponent } from 'src/app/components/milestone/card.component';
import { MilestoneInfoComponent } from 'src/app/components/milestone/info.component';
import { MilestoneListItemComponent } from 'src/app/components/milestone/list-item.component';
import { AddMilestoneModalComponent } from 'src/app/pages/project/pages/milestones/add-milestone.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { MilestoneService } from 'src/app/services/milestone.service';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { MilestoneTemplateInfoComponent } from './milestone-info.component';
import { AuthService } from 'src/app/services/auth.service';
import { from, map, switchMap } from 'rxjs';

@Component({
  selector: 'milestones-template',
  standalone: true,
  imports: [
    MilestoneCardComponent,
    CommonModule,
    RouterModule,
    MilestoneListItemComponent,
    FeatherIconsModule,
    MilestoneTemplateInfoComponent,
  ],
  template: `
    <ng-container *ngIf="!sideColumn">
      <div
        class="rounded-[5px] border border-base-content/50 bg-base-100 p-[16px] "
      >
        <h1 class="text-[18px] font-semibold ">Milestones Template</h1>

        <div
          class="flex h-full flex-col justify-start gap-x-[16px] sm1:grid sm1:grid-cols-[1fr_3fr] md:grid-cols-[1fr_3fr]"
        >
          <ul class="steps steps-vertical pt-0 sm1:block">
            <li
              *ngFor="let milestone of milestones"
              class="step"
              [class.step-primary]="false"
            >
              <div class="flex w-full items-center justify-between">
                <span
                  class="btn-link btn px-0 text-left text-base-content no-underline"
                  (click)="handleMilestoneClick(milestone.id)"
                  [class.text-primary]="selectedMilestoneId() === milestone.id"
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
              class="btn-ghost btn-sm flex flex-row items-center justify-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
            >
              <i-feather
                class="h-[20px] w-[20px] text-base-content/70"
                name="plus"
              />
              <span class="uppercase"> Add </span>
            </li>
          </ul>

          <div class="pt-[20px]">
            <milestone-template-info
              *ngIf="selectedMilestoneId() !== null; else empty"
              [milestoneId]="selectedMilestoneId()"
              (closed)="selectedMilestoneId.set(null)"
            />

            <ng-template #empty>
              <div
                class=" flex flex-col items-center justify-center gap-[8px] text-base-content/50"
              >
                <i-feather name="flag" class="" />
                <span class="text-base">Select a milestone</span>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-container *ngIf="sideColumn">
      <div
        class="rounded-[5px] border border-base-content/50 bg-base-100 p-[16px]"
      >
        <div class="flex w-full justify-between">
          <h1 class="text-[18px] font-semibold">Milestones Template</h1>
          <button
            onclick="addMilestone.showModal()"
            class="btn-ghost btn-sm flex w-fit flex-row items-center justify-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
          >
            <i-feather
              class="h-[20px] w-[20px] text-base-content/70"
              name="plus"
            />
            <span class="uppercase"> Add </span>
          </button>
        </div>

        <div class="flex h-full flex-col justify-start gap-x-[16px] ">
          <ul class="steps steps-vertical sm1:block ">
            <li
              *ngFor="let milestone of milestones"
              class="step"
              [class.step-primary]="false"
            >
              <div class="flex w-full items-center justify-between">
                <span
                  class="btn-link btn px-0 text-left text-base-content no-underline"
                  (click)="handleMilestoneClick(milestone.id)"
                  [class.text-primary]="selectedMilestoneId() === milestone.id"
                >
                  {{ milestone.title }}
                </span>
                <div class="badge badge-secondary">
                  {{ milestone.dueDate }}
                </div>
              </div>
            </li>
          </ul>

          <div class="rounded-[5px] border p-[16px]">
            <milestone-template-info
              *ngIf="selectedMilestoneId() !== null; else empty"
              [milestoneId]="selectedMilestoneId()"
              (closed)="selectedMilestoneId.set(null)"
            />

            <ng-template #empty>
              <div
                class=" flex flex-col items-center justify-center gap-[8px] text-base-content/50"
              >
                <i-feather name="flag" class="" />
                <span class="text-base">Select a milestone</span>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class MilestonesTemplateComponent implements OnInit {
  data = [0, 1, 2];
  milestones: {
    title: string;
    dueDate: string;
    id: number;
  }[] = [];
  selectedMilestoneId = signal<number | null>(null);
  @Input() sideColumn? = false;
  authService = inject(AuthService);

  constructor(
    private milestoneService: MilestoneService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const user$ = from(this.authService.getAuthenticatedUser());
    user$
      .pipe(
        map((user) => {
          if (user === null) throw new Error('!#');
          return user.uid;
        }),
        switchMap((id) => this.milestoneService.getMilestoneTemplates(id))
      )
      .subscribe({
        next: (milestones) => {
          const a = milestones.map((m) => ({
            dueDate: new Date(m.due_date),
            title: m.title,

            id: m.id,
          }));

          const sorted = a
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
            .map((a) => ({
              ...a,
              dueDate: a.dueDate.toDateString(),
            }));

          this.milestones = sorted;
        },
        error: (err) => {
          this.toastr.error('error getting milestone templates:', err);
        },
      });
  }

  handleMilestoneClick(id: number) {
    this.selectedMilestoneId.update((old) => id);
  }
}
