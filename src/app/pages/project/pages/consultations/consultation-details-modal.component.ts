import {
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { filter, switchMap, tap } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { Consultation, Task } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { AccomplishmentsComponent } from './accomplishments.component';
import { ConsultationStateService } from './data-access/consultations-state.service';
import { ModalComponent } from 'src/app/components/ui/modal.component';
import { isNotNull } from 'src/app/utils/isNotNull';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';

@Component({
  selector: 'consultation-details-modal',
  standalone: true,
  imports: [ModalComponent, FeatherIconsModule, AccomplishmentsComponent],
  template: `
    <modal [inputId]="id || 'consultationModal'">
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

            <accomplishments [data]="accomplishedTasks" [hideInput]="true" />
          </div>
          <ul
            class="flex h-full w-full flex-col  bg-neutral/20 p-0 py-2 sm1:w-[223px]"
          >
            <ng-content />

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
export class ConsultationDetailsModalComponent implements OnInit {
  @Input() id = 'consultationModal';

  accomplishedTasks: Task[] = [];
  consultation: Consultation | null = null;

  taskService = inject(TaskService);
  consultationStateService = inject(ConsultationStateService);

  clearAccomplishedTasks() {
    this.accomplishedTasks = [];
  }

  ngOnInit(): void {
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
}