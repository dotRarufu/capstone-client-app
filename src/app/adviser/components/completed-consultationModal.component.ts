import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs';
import { convertUnixEpochToDateString } from 'src/app/student/utils/convertUnixEpochToDateString';
import { isNotNull } from 'src/app/student/utils/isNotNull';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { TaskService } from 'src/app/services/task.service';
import { ConsultationService } from 'src/app/services/consultation.service';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ActualAccomplishmentsComponent } from './actual-accomplishments.component';
import { AccomplishmentsComponent } from 'src/app/components/modal/accomplishments.component';
import { ProposedNextStepsComponent } from './proposed-next-steps.component';
import { NextDeliverablesComponent } from './next-deliverables.component';

@Component({
  standalone: true,
  imports: [
    ActualAccomplishmentsComponent,
    ModalComponent,
    AccomplishmentsComponent,
    ProposedNextStepsComponent,
    NextDeliverablesComponent,
    FeatherIconsModule,
  ],
  selector: 'CompletedConsultationModal',
  template: `
    <Modal inputId="completedConsultationsModal">
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

            <Accomplishments [hideInput]="true" [data]="accomplishedTasks" />

            <ActualAccomplishments
              [hideInput]="true"
              [data]="actualAccomplishments"
            />

            <ProposedNextSteps [hideInput]="true" [data]="proposedNextSteps" />

            <NextDeliverables [hideInput]="true" [data]="nextDeliverables" />
          </div>

          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
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
    </Modal>
  `,
})
export class CompletedConsultationModalComponent implements OnChanges, OnInit {
  @Input() consultation$?: Observable<Consultation | null>;
  accomplishedTasks: Task[] = [];
  consultation: Consultation | null = null;
  actualAccomplishments: string[] = [];
  proposedNextSteps: string[] = [];
  nextDeliverables: string[] = [];

  constructor(
    private taskService: TaskService,
    private consultationService: ConsultationService
  ) {}

  epochToDate(epoch: number) {
    return convertUnixEpochToDateString(epoch);
  }

  epochToTime(epoch: number) {
    return getTimeFromEpoch(epoch);
  }

  clearAccomplishedTasks() {
    this.accomplishedTasks = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleConsultation$Changes(changes);
  }

  ngOnInit(): void {}

  handleConsultation$Changes(changes: SimpleChanges) {
    if (changes['consultation$'] === undefined) return;

    const consultation$ = changes['consultation$'].currentValue as
      | Observable<Consultation | null>
      | undefined;

    if (consultation$ !== undefined) {
      consultation$
        .pipe(
          filter(isNotNull),
          tap((c) => {
            console.log('c:', c);
            this.consultation = c;
          }),
          switchMap((c) => this.taskService.getAccompishedTasks(c.id))
        )
        .subscribe({
          next: (tasks) => (this.accomplishedTasks = tasks),
        });

      consultation$
        .pipe(
          filter(isNotNull),
          switchMap(({ id }) =>
            this.consultationService.getConsultationOutcomes(id)
          )
        )
        .subscribe({
          next: (res) => {
            this.actualAccomplishments = res.actualAccomplishments;
            this.proposedNextSteps = res.proposedNextSteps;
            this.nextDeliverables = res.nextDeliverables;
          },
        });
    }
  }
}
