import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { BehaviorSubject, filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { isNotNull } from 'src/app/utils/isNotNull';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/project.service';
import { dateToDateStringWithTime } from 'src/app/utils/dateToDateStringWithTime';
import short from 'short-uuid';
import { AiServiceRequestRow } from 'src/app/types/collection';
import { HomeStateService } from './data-access/home-state.service';

@Component({
  selector: 'request-card',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <div
      class="w-[262px]  rounded-[4px] border border-neutral/50 bg-base-100 drop-shadow"
    >
      <h2
        *ngIf="!finished()"
        (click)="handleClick()"
        class=" flex w-full flex-col justify-center break-words bg-primary p-[1rem] text-base text-primary-content "
      >
        {{ shortUuid() }}
      </h2>
      <h2
        *ngIf="finished()"
        (click)="handleClick()"
        class="link-hover link flex w-full flex-col justify-center break-words bg-primary p-[1rem] text-base text-primary-content "
      >
        {{ shortUuid() }}
      </h2>

      <div class=" w-full px-[1rem] py-2 text-base">
        <div class="flex justify-between">
          <span>Sent:</span>
          <span>{{ sent() }}</span>
        </div>
        <div class="flex justify-between">
          <span>Finished:</span>
          <span>{{ finished() || 'Not yet' }}</span>
        </div>
      </div>
      <div class="flex w-full justify-end px-[1rem] py-4 text-base ">
        <button
          *ngIf="!finished()"
          onclick="cancelRequestModal.showModal()"
          (click)="handleXClick()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="x" />
        </button>

        <button
          *ngIf="finished()"
          (click)="handleClick()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="log-in" />
        </button>
        <!-- show only if request is not yet finished -->
      </div>
    </div>
  `,
})
export class RequestCardComponent implements OnInit {
  @Input() data: Pick<AiServiceRequestRow, 'id' | 'sent' | 'finished'> = {
    id: '',
    sent: '',
    finished: '',
  };
  shortUuid = signal('');

  sent = signal(dateToDateStringWithTime(new Date()));
  finished = signal('');

  projectService = inject(ProjectService);
  router = inject(Router);
  homeStateService = inject(HomeStateService);

  ngOnInit(): void {
    const sentDate = dateToDateStringWithTime(new Date(this.data.sent || ''));
    const finished = this.data.finished;
    const finishedDate = finished
      ? dateToDateStringWithTime(new Date(finished))
      : '';
    this.sent.set(sentDate);
    this.finished.set(finishedDate);
    const translator = short();
    const shorted = translator.fromUUID(this.data.id);
    this.shortUuid.set(shorted);
    this.projectService.getTitleAnayzeResult(this.data.id).subscribe({
      // todo: add sent and finished fields in db

      error: () => {
        console.error('Error getting request result:', this.data.id);
      },
    });
  }

  handleXClick() {
    this.homeStateService.setActiveRequestId(this.data.id);
  }

  handleClick() {
    if (!this.finished()) return;

    this.router.navigate(['s', 'home', 'title-analyzer', this.data.id]);
  }
}
