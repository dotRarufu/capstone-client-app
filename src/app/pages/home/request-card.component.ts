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

@Component({
  selector: 'request-card',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <div
      class="w-[262px]  rounded-[4px] border border-neutral/50 bg-base-100 drop-shadow"
    >
      <h2
        (click)="handleClick()"
        class="link-hover link flex w-full flex-col justify-center break-words bg-primary p-[1rem] text-base text-primary-content"
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
          <span>{{ finished() }}</span>
        </div>
      </div>
      <div class="flex w-full justify-end px-[1rem] py-4 text-base ">
        <button
          onclick="removeProjectModal.showModal()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="x" />
        </button>
        <button
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
  @Input() id = '';
  shortUuid = signal('');
  title = signal('Untitled request');
  sent = signal(dateToDateStringWithTime(new Date()));
  finished = signal(dateToDateStringWithTime(new Date()));

  projectService = inject(ProjectService);
  router = inject(Router);

  ngOnInit(): void {
  
    const translator = short();
    const shorted = translator.fromUUID(this.id);
    this.shortUuid.set(shorted);
    this.projectService.getTitleAnayzeResult(this.id).subscribe({
      // todo: add sent and finished fields in db
      next: ({ title }) => {
        this.title.set(title);
      },
      error: () => {
        console.error('Error getting request result:', this.id);
      },
    });
  }

  handleClick() {
    this.router.navigate(['s', 'home', 'title-analyzer', this.id]);
  }
}
