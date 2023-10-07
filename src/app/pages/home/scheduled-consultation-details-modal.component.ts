import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { CommonModule } from '@angular/common';
import { HomeStateService } from './data-access/home-state.service';
import { AccomplishmentsComponent } from '../project/pages/consultations/accomplishments.component';
import { OutcomeComponent } from 'src/app/pages/project/pages/consultations/outcome.component';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

export type ModalDialog = { close: () => void };

@Component({
  selector: 'scheduled-consultation-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    FeatherIconsModule,
    AccomplishmentsComponent,
    OutcomeComponent,
  ],
  template: `
    <modal [inputId]="id || 'consultationModal'">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        *ngIf="{
          accomplishedTasks: accomplishedTasks$ | async,
          consultation: consultation$ | async
        } as observables"
      >
        <div
          class="flex h-full items-center justify-between bg-primary p-[24px]"
        >
          <h1 class="text-[20px] text-primary-content">
            {{ epochToDate(observables.consultation?.date_time || 0) }}
            {{ epochToTime(observables.consultation?.date_time || 0) }}
          </h1>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-auto"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.description }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Time</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.scheduleData?.startTime }} to
              {{ observables.consultation?.scheduleData?.endTime }}
            </div>
            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Location</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.location }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Scheduled by</h1>
            </div>

            <div class="text-base text-base-content">
              {{ observables.consultation?.organizer?.name }}
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Project</h1>
            </div>
            <div class="text-base text-base-content">
              {{ observables.consultation?.project?.name }}
            </div>

            <accomplishments
              [data]="observables.accomplishedTasks || []"
              [hideInput]="true"
            />

            <outcome
              heading="Actual Accomplishments"
              (addItem)="addActualAccomplishment($event)"
              (deleteItem)="deleteActualAccomplishment($event)"
              [data]="actualAccomplishments()"
            />

            <outcome
              heading="Proposed Next Steps"
              (addItem)="addProposedNextStep($event)"
              (deleteItem)="deleteProposedNextStep($event)"
              [data]="proposedNextSteps()"
            />

            <outcome
              heading="Next Deliverables"
              (addItem)="addNextDeliverable($event)"
              (deleteItem)="deleteNextDeliverable($event)"
              [data]="nextDeliverables()"
            />
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <ng-content />

            <button
           
              (click)="handleCompleteClick(); closeModal();"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="check-circle" />
              Complete
            </button>

            <div class="h-full"></div>

            <button
              (click)="closeModal()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> close
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class ScheduledConsultationDetailsModalComponent {
  @Input() id = 'consultationModal';
  taskService = inject(TaskService);
  consultationService = inject(ConsultationService);
  homeStateService = inject(HomeStateService);
  toastr = inject(ToastrService);
  spinner = inject(NgxSpinnerService);

  consultation$ = this.homeStateService.activeConsultation$.pipe(
    filter(isNotNull)
  );
  accomplishedTasks$ = this.consultation$.pipe(
    switchMap((c) => this.taskService.getAccompishedTasks(c.id))
  );

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }

  handleCompleteClick() {
    const consultation = this.homeStateService.getActiveConsultation();

    if (consultation === null) throw new Error('cant do this without id');
    this.spinner.show();

    const id = consultation.id;
    const completeScheduled = this.consultationService.completeScheduled(
      id,
      this.actualAccomplishments(),
      this.proposedNextSteps(),
      this.nextDeliverables()
    );
    completeScheduled.subscribe({
      next: (res) => {
        this.spinner.hide();
        this.toastr.success('Success');
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(`Failed to complete schedule: ${err}`);
      },
    });
  }

  actualAccomplishments = signal<string[]>([]);
  proposedNextSteps = signal<string[]>([]);
  nextDeliverables = signal<string[]>([]);

  addNextDeliverable(value: string) {
    this.nextDeliverables.update((old) => [...old, value]);
  }
  addProposedNextStep(value: string) {
    this.proposedNextSteps.update((old) => [...old, value]);
  }
  addActualAccomplishment(value: string) {
    this.actualAccomplishments.update((old) => [...old, value]);
  }
  deleteNextDeliverable(value: string) {
    this.nextDeliverables.update((old) => old.filter((v) => v !== value));
  }
  deleteProposedNextStep(value: string) {
    this.proposedNextSteps.update((old) => old.filter((v) => v !== value));
  }
  deleteActualAccomplishment(value: string) {
    this.actualAccomplishments.update((old) => old.filter((v) => v !== value));
  }

  @ViewChild(ModalComponent, { static: false }) modalComponent!: ModalComponent;

  closeModal() {
    this.modalComponent.close();
  }
}
