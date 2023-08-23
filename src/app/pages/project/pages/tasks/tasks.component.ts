import {
  Component,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { from, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TodoAccordionComponent } from 'src/app/pages/project/pages/tasks/todo-accordion.component';
import { TaskDetailsModalComponent } from 'src/app/pages/project/pages/tasks/task-details-modal.component';
import { TaskCardComponent } from 'src/app/components/card/task-card.component';
import { AddTaskModalComponent } from 'src/app/pages/project/pages/tasks/add-task-modal.component';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

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
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="hidden text-2xl text-base-content min-[998px]:block">
          Tasks
        </h1>
        <button
          *ngIf="!isStudent"
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
          >
            <div
              class="flex w-full flex-col gap-[16px]  pt-[16px]"
              isTodo
              cdkDropList
              [cdkDropListData]="category.tasks"
              (cdkDropListDropped)="drop($event, category.statusId)"
            >
              <TaskCard
                *ngFor="let item of category.tasks"
                cdkDrag
                [cdkDragData]="item"
                [cdkDragDisabled]="!isStudent"
                [task]="item"
                (click)="setActiveTask(item)"
              />
            </div>
          </todo-accordion>
        </div>
      </div>

      <task-details-modal [task]="activeTask()" />
      <add-task-modal *ngIf="!isStudent" />
    </div>
  `,
})
export class TasksPageComponent implements OnInit {
  categories: { title: string; statusId: number; tasks: Task[] }[] = [
    {
      title: 'Todo',
      tasks: [],
      statusId: 0,
    },
    {
      title: 'Doing',
      tasks: [],
      statusId: 1,
    },
    {
      title: 'Done',
      tasks: [],
      statusId: 2,
    },
  ];
  isStudent = true;
  activeTask = signal<Task | null>(null);

  authService = inject(AuthService);
  taskService = inject(TaskService);
  projectService = inject(ProjectService);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);

  setActiveTask(task: Task) {
    this.activeTask.set(task);
  }

  ngOnInit(): void {
    this.spinner.show();

    const user$ = from(this.authService.getAuthenticatedUser());
    user$
      .pipe(
        map((user) => {
          if (user === null) {
            throw new Error('user cant be null');
          }

          return user;
        })
      )
      .subscribe({
        next: (user) => {
          const isStudent = user.role_id === 0;
          this.isStudent = isStudent;

          this.spinner.hide();
        },
      });

    const projectId = Number(this.route.parent!.snapshot.url[0].path);

    // todo: make this observable complete
    this.taskService
      .getTasks(0, projectId)
      .subscribe((tasks) => (this.categories[0].tasks = tasks));
    this.taskService
      .getTasks(1, projectId)
      .subscribe((tasks) => (this.categories[1].tasks = tasks));
    this.taskService
      .getTasks(2, projectId)
      .subscribe((tasks) => (this.categories[2].tasks = tasks));
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
