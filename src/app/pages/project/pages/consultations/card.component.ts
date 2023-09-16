import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { Consultation } from 'src/app/types/collection';
import { convertUnixEpochToDateString } from 'src/app/utils/convertUnixEpochToDateString';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';

@Component({
  selector: 'consultation-card',
  standalone: true,
  imports: [CommonModule, FeatherIconsModule],
  template: `
    <div
      class="flex w-[260px] flex-wrap justify-center gap-[24px] sm1:justify-start"
    >
      <div
        class="card card-compact h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
      >
        <figure class="h-[92px] bg-primary">
          <ng-container [ngSwitch]="buttonId">
            <!-- todo: move switch cases id in constant -->
            <ng-container *ngSwitchCase="'studentPending'">
              <button
                onclick="pendingConsultationsModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-primary-content"
              >
                {{ epochToDateString(data.date_time) }}
              </button>
            </ng-container>
            <ng-container *ngSwitchCase="'techAdPending'">
              <button
                onclick="techAdPendingConsultationsModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-primary-content"
              >
                {{ epochToDateString(data.date_time) }}
              </button>
            </ng-container>
            <ng-container *ngSwitchCase="'techAdScheduled'">
              <button
                onclick="scheduledConsultationsModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-primary-content"
              >
                {{ epochToDateString(data.date_time) }}
              </button>
            </ng-container>

            <ng-container *ngSwitchCase="'techAdCompleted'">
              <button
                onclick="completedConsultationsModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-primary-content"
              >
                {{ epochToDateString(data.date_time) }}
              </button>
            </ng-container>

            <ng-container *ngSwitchDefault>
              <button
                onclick="consultationModal.showModal()"
                class="link-hover link card-title  w-full px-4 text-left text-primary-content"
              >
                {{ epochToDateString(data.date_time) }}
              </button>
            </ng-container>
          </ng-container>
        </figure>
        <div class="card-body">
          <p class="text-sm">
            {{ data.location }} | {{ getEpochTime(data.date_time) }}
          </p>
          <p class="text-sm">
            {{ data.description }}
          </p>

          <div class="card-actions justify-end">
            <ng-container [ngSwitch]="buttonId">
              <!-- todo: move switch cases id in constant -->
              <ng-container *ngSwitchCase="'studentPending'">
                <button
                  onclick="pendingConsultationsModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </ng-container>

              <ng-container *ngSwitchCase="'techAdPending'">
                <button
                  onclick="techAdPendingConsultationsModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </ng-container>

              <ng-container *ngSwitchCase="'techAdScheduled'">
                <button
                  onclick="scheduledConsultationsModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </ng-container>

              <ng-container *ngSwitchCase="'techAdCompleted'">
                <button
                  onclick="completedConsultationsModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </ng-container>

              <ng-container *ngSwitchDefault>
                <button
                  onclick="consultationModal.showModal()"
                  class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
                >
                  <i-feather class="text-base-content/70" name="log-in" />
                </button>
              </ng-container>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConsultationCardComponent {
  @Input({ required: true }) data!: Consultation;
  @Input() buttonId?: string;

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }
  getEpochTime(unixEpoch: number) {
    return getTimeFromEpoch(unixEpoch);
  }
}
