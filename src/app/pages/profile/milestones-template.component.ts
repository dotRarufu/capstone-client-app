import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { MilestoneService } from 'src/app/services/milestone.service';
import { MilestoneTemplateInfoComponent } from './milestone-info.component';
import { AuthService } from 'src/app/services/auth.service';
import { EMPTY, catchError, delay, from, map, switchMap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileStateService } from './data-access/profile-state.service';

@Component({
  selector: 'milestones-template',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FeatherIconsModule,
    MilestoneTemplateInfoComponent,
  ],
  template: `
    <ng-container
      *ngIf="{
        milestones: milestones$ | async,
        selectedMilestoneId: profileStateService.selectedMilestoneId$ | async
      } as observables"
    >
      <ng-container *ngIf="!sideColumn">
        <div
          class="flex flex-col gap-2 rounded-[5px] border-base-content/50 bg-base-100"
        >
          <div class="flex items-center justify-between">
            <h1 class="text-[18px] font-semibold">Milestones Template</h1>
            <button
              (click)="reapplyTemplates()"
              class="btn-ghost btn-sm flex flex-row items-center justify-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
            >
              <i-feather
                class="h-[20px] w-[20px] text-base-content/70"
                name="plus"
              />
              <span class="uppercase"> Re-apply milestones</span>
            </button>
          </div>

          <div
            class="flex h-full flex-col justify-start gap-x-[16px] sm1:grid sm1:grid-cols-[1fr_3fr] md:grid-cols-[1fr_3fr]"
          >
            <ul class="steps steps-vertical px-4 pt-0 sm1:block">
              <li
                *ngFor="let milestone of observables.milestones"
                class="step"
                [class.step-primary]="false"
              >
                <div class="flex w-full items-center justify-between">
                  <span
                    class="btn-link btn px-0 text-left text-base-content no-underline"
                    (click)="
                      profileStateService.setSelectedMilestoneId(milestone.id)
                    "
                    [class.text-primary]="
                      observables.selectedMilestoneId === milestone.id
                    "
                  >
                    {{ milestone.title }}
                  </span>
                  <div class="badge badge-primary sm1:hidden">
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
                <span class="uppercase"> Add Milestone </span>
              </li>
            </ul>

            <div class="pt-[20px]">
              <milestone-template-info
                *ngIf="observables.selectedMilestoneId !== null; else empty"
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
          <div class="flex w-full justify-between ">
            <h1 class=" text-[18px] font-semibold">Milestones Template</h1>
            <button
              onclick="addMilestone.showModal()"
              class="btn-ghost btn-sm flex w-fit flex-row items-center justify-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
            >
              <i-feather
                class="h-[20px] w-[20px] text-base-content/70"
                name="plus"
              />
              <span class="uppercase"> Add Milestone</span>
            </button>
          </div>

          <div class="flex h-full flex-col justify-start gap-x-[16px] ">
            <ul class="steps steps-vertical sm1:block ">
              <li
                *ngFor="let milestone of observables.milestones"
                class="step"
                [class.step-primary]="false"
              >
                <div class="flex w-full items-center justify-between">
                  <span
                    class="btn-link btn px-0 text-left text-base-content no-underline"
                    (click)="
                      profileStateService.setSelectedMilestoneId(milestone.id)
                    "
                    [class.text-primary]="
                      observables.selectedMilestoneId === milestone.id
                    "
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
                *ngIf="observables.selectedMilestoneId !== null; else empty"
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
    </ng-container>
  `,
})
export class MilestonesTemplateComponent {
  authService = inject(AuthService);
  milestoneService = inject(MilestoneService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);
  profileStateService = inject(ProfileStateService);

  @Input() sideColumn? = false;

  data = [0, 1, 2];
  milestones$ = this.authService.getAuthenticatedUser().pipe(
    map((user) => {
      if (user === null) throw new Error('!#');
      return user.uid;
    }),
    switchMap((id) => this.milestoneService.getMilestoneTemplates(id)),
    map((milestones) => {
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

      return sorted;
    }),
    catchError((err) => {
      this.toastr.error('Error getting milestone templates:', err);

      return EMPTY;
    })
  );

  reapplyTemplates() {
    console.log('Reapply template start');
    this.spinner.show();

    const reapply$ = this.milestoneService.reapplyTemplates();

    reapply$.subscribe({
      next: (a) => {
        console.log('Reapply done | res:', a);
        this.spinner.hide();
        this.toastr.success('Sucessfully re-applied templates');
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to re-apply templates');
      },
    });
  }
}
