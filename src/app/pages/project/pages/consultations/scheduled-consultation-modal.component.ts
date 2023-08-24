import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {  filter, switchMap, tap } from 'rxjs';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { TaskService } from 'src/app/services/task.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ToastrService } from 'ngx-toastr';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from 'src/app/pages/project/pages/consultations/accomplishments.component';
import { OutcomeComponent } from 'src/app/pages/project/pages/consultations/outcome.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';

@Component({
  standalone: true,
  imports: [
    FeatherIconsModule,
    ModalComponent,
    AccomplishmentsComponent,
    OutcomeComponent,
  ],
  selector: 'scheduled-consultation-modal',
  template: `
    <modal inputId="scheduledConsultationsModal">
      <div
        class="flex w-full flex-col rounded-[3px] border border-base-content/10"
      >
        <div class="flex h-fit justify-between bg-primary p-[24px]">
          <div class="flex w-full flex-col justify-between gap-4">
            <h1 class="text-[20px] text-primary-content">
              {{ epochToDate(consultation?.date_time || 0) }}
              {{ epochToTime(consultation?.date_time || 0) }}
            </h1>
          </div>
        </div>
        <div
          class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
        >
          <div
            class="flex w-full flex-col gap-2 bg-base-100 px-6 py-4 sm1:overflow-y-scroll"
          >
            <div class="flex items-center justify-between ">
              <h1 class="text-[20px] text-base-content">Description</h1>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>

            <div class="text-base text-base-content">
              {{ consultation?.description }}
            </div>

            <div class="text-base text-base-content">
              {{ consultation?.location }}
            </div>

            <accomplishments [data]="accomplishedTasks" />

            <outcome
              heading="Actual Accomplishments"
              (addItem)="addActualAccomplishment($event)"
              (deleteItem)="deleteActualAccomplishment($event)"
              [data]="actualAccomplishments"
            />

            <outcome
              heading="Proposed Next Steps"
              (addItem)="addProposedNextStep($event)"
              (deleteItem)="deleteProposedNextStep($event)"
              [data]="proposedNextSteps"
            />

            <outcome
              heading="Next Deliverables"
              (addItem)="addNextDeliverable($event)"
              (deleteItem)="deleteNextDeliverable($event)"
              [data]="nextDeliverables"
            />
          </div>

          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <button
              (click)="handleCompleteClick()"
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
            >
              <i-feather class="text-base-content/70" name="x" /> Complete
            </button>

            <div class="h-full"></div>

            <button
              class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              (click)="clearAccomplishedTasks()"
            >
              <i-feather class="text-base-content/70" name="x" /> close
            </button>
          </ul>
        </div>
      </div>
    </modal>
  `,
})
export class ScheduledConsultationModalComponent implements OnInit {
  accomplishedTasks: Task[] = [];
  consultation: Consultation | null = null;
  actualAccomplishments: string[] = [];
  proposedNextSteps: string[] = [];
  nextDeliverables: string[] = [];

  taskService = inject(TaskService);
  consultationService = inject(ConsultationService);
  toastr = inject(ToastrService);
  consultationStateService = inject(ConsultationStateService);

  addNextDeliverable(value: string) {
    const old = [...this.nextDeliverables];
    this.nextDeliverables = [...old, value];
  }
  addProposedNextStep(value: string) {
    const old = [...this.proposedNextSteps];
    this.proposedNextSteps = [...old, value];
  }
  addActualAccomplishment(value: string) {
    const old = [...this.actualAccomplishments];
    this.actualAccomplishments = [...old, value];
  }
  deleteNextDeliverable(value: string) {
    const newVal = this.nextDeliverables.filter((v) => v !== value);
    this.nextDeliverables = newVal;
  }
  deleteProposedNextStep(value: string) {
    const newVal = this.proposedNextSteps.filter((v) => v !== value);
    this.proposedNextSteps = newVal;
  }
  deleteActualAccomplishment(value: string) {
    const newVal = this.actualAccomplishments.filter((v) => v !== value);
    this.actualAccomplishments = newVal;
  }

  handleCompleteClick() {
    if (this.consultation === null) throw new Error('cant do this without id');

    const id = this.consultation.id;
    const completeScheduled = this.consultationService.completeScheduled(
      id,
      this.actualAccomplishments,
      this.proposedNextSteps,
      this.nextDeliverables
    );
    completeScheduled.subscribe({
      next: (res) => {
        this.toastr.success('success');
      },
      error: (err) => {
        this.toastr.error('err');
      },
    });

    this.actualAccomplishments = [];
    this.proposedNextSteps = [];
    this.nextDeliverables = [];
  }

  ngOnInit(): void {
    console.log('i run:', this.actualAccomplishments);

    this.consultationStateService.consultation$
      .pipe(
        filter(isNotNull),
        tap((c) => {
          this.consultation = c;
        }),
        switchMap((c) => this.taskService.getAccompishedTasks(c.id))
      )
      .subscribe({
        next: (tasks) => (this.accomplishedTasks = tasks),
      });
  }

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }

  clearAccomplishedTasks() {
    this.accomplishedTasks = [];
  }
}
