import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { BehaviorSubject, filter, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { isNotNull } from 'src/app/utils/isNotNull';

@Component({
  selector: 'ProjectCard',
  standalone: true,
  imports: [FeatherIconsModule, CommonModule],
  template: `
    <div
      class="h-[300px] w-[262px] rounded-[4px] border border-neutral/50 bg-base-100 drop-shadow"
      *ngIf="{ project: project$ | async } as observables"
    >
      <h2
        (click)="handleCardClick()"
        class="link-hover link flex h-[92px] w-full flex-col justify-center bg-secondary p-[1rem] text-[20px] font-bold text-secondary-content"
      >
        {{ observables.project?.name }}
      </h2>
      <div
        class="h-[106px] w-full gap-[8px] p-[1rem] text-base text-base-content"
      >
        <p class="line-clamp-3 h-full text-base">
          {{ observables.project?.title }}
        </p>
      </div>
      <div class="line-clamp-2 h-[48px] w-full px-[1rem] text-base">
        {{ observables.project?.members }}
      </div>
      <div class="flex w-full justify-end px-[1rem] text-base ">
        <button
          (click)="handleCardClick()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="log-in" />
        </button>
        <button
          (click)="removeProjectId.emit(this.projectSubject.getValue()!.id)"
          onclick="removeProjectModal.showModal()"
          class="btn-ghost btn-sm btn text-base-content hover:rounded-[3px]"
        >
          <i-feather class="text-base-content/70" name="trash" />
        </button>
      </div>
    </div>
  `,
})
export class ProjectCardComponent implements OnChanges {
  projectSubject = new BehaviorSubject<Project | null>(null);
  project$ = this.projectSubject.pipe(
    filter(isNotNull),
    map((project) => ({
      ...project,
      members: this.project.members.map((s) => ' ' + s),
    }))
  );
  @Input({ required: true }) project!: Project;
  @Input() role = '';
  @Output() removeProjectId = new EventEmitter<number>();

  router = inject(Router);

  handleCardClick() {
    this.project$.subscribe({
      next: (project) => {
        const studentPath = [this.role, 'p', project.id];
        const adviserPath = [this.role, 'p', project.id];

        this.router.navigate(this.role === 's' ? studentPath : adviserPath);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const newValue = changes['project'].currentValue as Project;

    this.projectSubject.next(newValue);
  }
}
