import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';
import { from, map } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'Tasks',
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Tasks</h1>
        <button
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
        class="flex h-full gap-[32px] overflow-x-scroll lg:justify-center "
      >
        <div *ngFor="let category of categories" class="w-[294px] shrink-0">
          <Accordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="category.title"
            [isHeadingCentered]="true"
          >
            <div
              isTodo
              class="flex flex-col gap-[16px] pt-[16px]"
              cdkDropList
              [cdkDropListData]="category.tasks"
              (cdkDropListDropped)="drop($event)"
            >
              <TaskCard
                *ngFor="let item of category.tasks"
                cdkDrag
                [cdkDragDisabled]="isDraggingDisabled"
                [task]="item"
              />
            </div>
          </Accordion>
        </div>
      </div>
    </div>

    <TaskDetailsModal />

    <AddTaskModal />
  `,
})
export class TasksPageComponent implements OnInit {
  categories: { title: string; tasks: Task[] }[] = [];
  isDraggingDisabled = false;

  constructor(
    private authService: AuthService,
    public taskService: TaskService,
    public projectService: ProjectService,
    private spinner: NgxSpinnerService
  ) {
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
          this.isDraggingDisabled = !isStudent;

          this.spinner.hide();
        },
      });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  ngOnInit(): void {
    const projectId = this.projectService.activeProjectId();
    // todo: make this observable complete

    this.taskService
      .getTasks(0, projectId)
      .subscribe((tasks) => this.categories.push({ title: 'Todo', tasks }));
    this.taskService
      .getTasks(1, projectId)
      .subscribe((tasks) => this.categories.push({ title: 'Doing', tasks }));
    this.taskService
      .getTasks(2, projectId)
      .subscribe((tasks) => this.categories.push({ title: 'Done', tasks }));
  }
}
