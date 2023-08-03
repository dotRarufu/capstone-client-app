import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { from, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TodoAccordionComponent } from 'src/app/components/accordion/todo.component';
import { TaskDetailsModalComponent } from 'src/app/components/modal/task-details.component';
import { TaskCardComponent } from 'src/app/components/card/task-card.component';
import { AddTaskModalComponent } from 'src/app/components/modal/add-task.component';
import { FeatherIconsModule } from 'src/app/modules/feather-icons.module';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'Tasks',
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
        <h1 class="text-[32px] text-base-content hidden min-[998px]:block">Tasks</h1>
        <button
          *ngIf="!isStudent"
          onclick="addTask.showModal()"
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather class="text-base-content/70" name="plus" />

          Add
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
          <TodoAccordion
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
          </TodoAccordion>
        </div>
      </div>

      <TaskDetailsModal [task]="activeTask()" />

      <AddTaskModal *ngIf="!isStudent" />
    </div>
  `,
})
export class TasksComponent implements OnInit {
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
  activeTask: WritableSignal<Task | null>;

  constructor(
    private authService: AuthService,
    public taskService: TaskService,
    public projectService: ProjectService,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.spinner.show();

    this.activeTask = signal<Task | null>(null);
    console.log('active task test:', this.activeTask());

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
  }

  setActiveTask(task: Task) {
    this.activeTask.set(task);
  }

  ngOnInit(): void {
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
