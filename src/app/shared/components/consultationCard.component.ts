import { Component, Input } from '@angular/core';
import { convertUnixEpochToDateString } from 'src/app/capstoneAdviser/utils/convertUnixEpochToDateString';
import { Consultation } from 'src/app/types/collection';
import { getTimeFromEpoch } from 'src/app/utils/getTimeFromEpoch';

@Component({
  selector: 'ConsultationCard',
  template: `
    <div class="flex flex-wrap justify-center gap-[24px] sm1:justify-start w-[260px]">
      <div
        class="card-compact card h-fit w-full max-w-[262px]  rounded-[4px] border border-base-content/50 bg-base-100 shadow-md"
      >
        <figure class="h-[92px] bg-secondary">
          <button
            onclick="consultationModal.showModal()"
            class="link-hover link card-title  w-full px-4 text-left text-secondary-content"
          >
            {{ epochToDateString(data.date_time) }}
          </button>
        </figure>
        <div class="card-body">
          <p class="text-sm">{{ data.location }} | {{getEpochTime(data.date_time)}}</p>
          <p class="text-sm">
            {{ data.description }}
          </p>

          <div class="card-actions justify-end">
            <button
              onclick="consultationModal.showModal()"
              class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
            >
              <i-feather class="text-base-content/70" name="log-in" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ConsultationCardComponent {
    @Input() data: Consultation = {date_time: 1, description: '', id: -1, is_accepted: false, location: '', organizer_id: '', project_id: -1};

  epochToDateString(unixEpoch: number) {
    return convertUnixEpochToDateString(unixEpoch);
  }
  getEpochTime(unixEpoch: number) {
    console.log("runsasda");
    return getTimeFromEpoch(unixEpoch)
  }
}
