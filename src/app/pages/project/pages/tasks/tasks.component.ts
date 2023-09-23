import { Component, OnInit, signal, inject } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { from, map, tap } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TodoAccordionComponent } from 'src/app/pages/project/pages/tasks/todo-accordion.component';
import { TaskDetailsModalComponent } from 'src/app/pages/project/pages/tasks/task-details-modal.component';
import { TaskCardComponent } from 'src/app/pages/project/pages/tasks/task-card.component';
import { AddTaskModalComponent } from 'src/app/pages/project/pages/tasks/add-task-modal.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TaskStateService } from './data-access/tasks-state.service';

@Component({
  selector: 'tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    TodoAccordionComponent,
    TaskDetailsModalComponent,
    DragDropModule,
    TaskCardComponent,
    AddTaskModalComponent,
    FeatherIconsModule,
  ],
  template: `
    <div
      *ngIf="{ isStudent: isStudent$ | async } as observables"
      class="flex h-full flex-col gap-[16px]"
    >
      <div class="flex flex-col gap-2 ">
        <div class="flex justify-between ">
          <h1 class="hidden text-2xl text-base-content min-[998px]:block">
            Tasks
          </h1>
          <button
            *ngIf="!observables.isStudent"
            onclick="addTask.showModal()"
            class="btn-ghost btn-sm flex flex-row items-center gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 font-[500] text-base-content hover:border-base-content/30"
          >
            <i-feather
              class="h-[20px] w-[20px] text-base-content/70"
              name="plus"
            />
            <span class="uppercase"> Add </span>
          </button>
        </div>
        <div class="h-[2px] w-full bg-base-content/10"></div>
      </div>

      <div
        cdkDropListGroup
        class="flex h-full max-h-[calc(100vh-130px)] gap-[32px] overflow-x-scroll  lg:justify-center  "
      >
        <div
          *ngFor="let category of categories"
          class="w-[294px] shrink-0 py-[16px]"
        >
          <todo-accordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="category.title"
            [isHeadingCentered]="true"
            *ngIf="{ tasks: (category.tasks | async) || [] } as taskObservables"
          >
            <div
              class="flex w-full flex-col gap-[16px]  pt-[16px]"
              isTodo
              cdkDropList
              [cdkDropListData]="taskObservables.tasks"
              (cdkDropListDropped)="drop($event, category.statusId)"
            >
              <TaskCard
                *ngFor="let item of taskObservables.tasks"
                cdkDrag
                [cdkDragData]="item"
                [cdkDragDisabled]="!observables.isStudent"
                [task]="item"
                (click)="taskStateService.setActiveTask(item)"
              />
            </div>
          </todo-accordion>
        </div>
      </div>

      <task-details-modal />
      <add-task-modal *ngIf="!observables.isStudent" />
    </div>
  `,
})
export class TasksPageComponent implements OnInit {
  taskStateService = inject(TaskStateService);
  authService = inject(AuthService);
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  projectId = Number(this.route.parent!.snapshot.url[0].path);
  categories = [
    {
      title: 'Todo',
      tasks: this.taskService
        .getTasks(0, this.projectId)
        .pipe(tap((t) => this.taskStateService.setTasks(t))),
      statusId: 0,
    },
    {
      title: 'On going',
      tasks: this.taskService.getTasks(1, this.projectId),
      statusId: 1,
    },
    {
      title: 'Done',
      tasks: this.taskService.getTasks(2, this.projectId),
      statusId: 2,
    },
  ];
  isStudent$ = this.authService.getAuthenticatedUser().pipe(
    map((user) => {
      if (user === null) {
        throw new Error('user cant be null');
      }

      return user;
    }),
    map((user) => {
      const isStudent = user.role_id === 0;

      return isStudent;
    }),
    tap((_) => {
      this.spinner.hide();
    })
  );

  ngOnInit(): void {
    this.spinner.show();
  }

  drop(event: CdkDragDrop<Task[]>, statusId: number) {
    const task = event.item.data as Task;

    // todo: add check if target container's length is already 5
    if (statusId !== 2 && event.container.data.length >= 5) {
      this.toastr.error('Max amount reached');

      return;
    }
    if (event.previousContainer === event.container) return;

    this.taskService.changeStatus(task.id, statusId).subscribe({
      next: () => {},
    });

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
