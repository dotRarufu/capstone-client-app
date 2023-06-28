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

@Component({
  template: `
    <div class="flex h-full flex-col gap-[16px] ">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Tasks</h1>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div
        cdkDropListGroup
        class="flex h-full gap-[32px] overflow-x-scroll lg:justify-center "
      >
        <div *ngFor="let category of categories" class="w-[294px] shrink-0">
          <TodoAccordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="category.title"
            [isHeadingCentered]="true"
          >
            <div
              isTodo
              class="flex w-full flex-col gap-[16px] pt-[16px]"
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
          </TodoAccordion>
        </div>
      </div>

      <Modal inputId="taskDetails">
        <div
          class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        >
          <div class="flex justify-between bg-primary p-[24px]">
            <div class="flex flex-col justify-between">
              <h1 class="text-[24px] text-primary-content">
                Task title placeholder
              </h1>

              <div class="text-[12px] text-primary-content/50">
                Created at 5/1/23 by Adviser Name | Currently in Doing
              </div>
            </div>
          </div>
          <div
            class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
          >
            <div class="flex w-full flex-col gap-2 bg-base-100 p-6">
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Description</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div class="text-base text-base-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
                ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem
                ipsum dolor sit
              </div>
            </div>
            <ul class=" flex w-full sm1:w-[223px]  flex-col bg-neutral/20 py-2 ">
              <div class="h-full"></div>

              <button
                class="btn-ghost btn flex justify-start gap-2 rounded-[3px] text-base-content"
              >
                <i-feather class="text-base-content/70" name="x-circle" /> close
              </button>
            </ul>
          </div>
        </div>
      </Modal>

      <Modal inputId="addTask">
        <div
          class="flex w-full flex-col rounded-[3px] border border-base-content/10"
        >
          <div class="flex justify-between bg-primary p-[24px]">
            <div class="flex w-full flex-col justify-between">
              <input
                type="text"
                placeholder="Task Title"
                class="input w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 bg-primary px-3 py-2 text-[20px] text-primary-content placeholder:text-[20px] placeholder:text-primary-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0 "
              />
            </div>
          </div>
          <div
            class="flex flex-col bg-base-100 sm1:h-[calc(100%-96px)] sm1:flex-row"
          >
            <div class="flex w-full flex-col gap-2 bg-base-100 p-6">
              <div class="flex items-center justify-between ">
                <h1 class="text-[20px] text-base-content">Description</h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <textarea
                class="textarea h-[117px] w-full rounded-[3px] border-y-0 border-l-[2px] border-r-0 border-l-primary-content/50 leading-normal placeholder:text-base-content placeholder:opacity-70 focus:border-l-[2px] focus:border-l-secondary focus:outline-0"
                placeholder="Description"
              ></textarea>
            </div>
            <ul class=" flex w-[223px]  flex-col bg-neutral/20 p-0 ">
              <button
                class="btn-ghost btn flex justify-end gap-2 rounded-[3px] text-base-content"
              >
                done
                <i-feather class="text-base-content/70" name="check-square" />
              </button>

              <div class="h-full"></div>

              <button
                class="btn-ghost btn flex justify-end gap-2 rounded-[3px] text-base-content"
              >
                close <i-feather class="text-base-content/70" name="x-square" />
              </button>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  `,
})
export class TasksComponent implements OnInit {
  categories: { title: string; tasks: Task[] }[] = [];
  isDraggingDisabled: boolean;

  constructor(
    private authService: AuthService,
    public taskService: TaskService,
    public projectService: ProjectService
  ) {
    const isStudent = this.authService.getCurrentUser()?.role_id === 0;
    this.isDraggingDisabled = !isStudent;
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
}
