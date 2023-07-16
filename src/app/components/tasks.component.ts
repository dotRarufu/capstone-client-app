import { Component, OnInit } from '@angular/core';
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
        <h1 class="text-[32px] text-base-content">Tasks</h1>
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
                [cdkDragDisabled]="!isStudent"
                [task]="item"
              />
            </div>
          </TodoAccordion>
        </div>
      </div>

      <TaskDetailsModal />

      <AddTaskModal *ngIf="!isStudent" />
    </div>
  `,
})
export class TasksComponent implements OnInit {
  categories: { title: string; tasks: Task[] }[] = [
    {
      title: 'Todo',
      tasks: [],
    },
    {
      title: 'Doing',
      tasks: [],
    },
    {
      title: 'Done',
      tasks: [],
    },
  ];
  isStudent = true;

  constructor(
    private authService: AuthService,
    public taskService: TaskService,
    public projectService: ProjectService,
    public spinner: NgxSpinnerService
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
          this.isStudent = isStudent;

          this.spinner.hide();
        },
      });
  }

  ngOnInit(): void {
    // todo: make this observable complete
    this.taskService.getTasks(0).subscribe((tasks) => 
      this.categories[0].tasks = tasks
    );
    this.taskService
      .getTasks(1)
      .subscribe((tasks) => (this.categories[1].tasks = tasks));
    this.taskService
      .getTasks(2)
      .subscribe((tasks) => (this.categories[2].tasks = tasks));
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
