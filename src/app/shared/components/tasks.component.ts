import { Component, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/types/collection';

@Component({
  selector: 'app-tasks',
  template: `
    

    <div class="flex flex-col gap-[16px]">
      <div class="flex justify-between ">
        <h1 class="text-[32px] text-base-content">Tasks</h1>
        <button
          class="btn-ghost btn gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
        >
          <i-feather name="plus"></i-feather>

          Add
        </button>
      </div>

      <div class="h-[2px] w-full bg-base-content/10"></div>

      <div cdkDropListGroup class="flex gap-[32px]">
        <div class="w-[294px] ">
          <app-shared-accordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="'To do'"
            [isHeadingCentered]="true"
          >
            <div
              class="flex flex-col gap-[16px] p-[16px]"
              cdkDropList
              [cdkDropListData]="todo"
              (cdkDropListDropped)="drop($event)"
            >
              <app-task-card *ngFor="let item of todo" cdkDrag [cdkDragDisabled]="isDraggingDisabled">
                {{ item.title }}
              </app-task-card>
            </div>
          </app-shared-accordion>
        </div>

        <!-- use ngfor directive instead -->
        <div class="w-[294px] ">
          <app-shared-accordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="'Doing'"
            [isHeadingCentered]="true"
          >
            <div
              class="flex flex-col gap-[16px] p-[16px]"
              cdkDropList
              [cdkDropListData]="doing"
              (cdkDropListDropped)="drop($event)"
            >
              
                <app-task-card *ngFor="let item of doing" cdkDrag [cdkDragDisabled]="isDraggingDisabled">
                  {{ item.title }}
                </app-task-card>
             
            </div>
          </app-shared-accordion>
        </div>
        
        <div class="w-[294px] ">
          <app-shared-accordion
            [withArrow]="false"
            [forcedOpen]="true"
            [heading]="'Done'"
            [isHeadingCentered]="true"
          >
            <div
              class="flex flex-col gap-[16px] p-[16px]"
              cdkDropList
              [cdkDropListData]="done"
              (cdkDropListDropped)="drop($event)"
            >
              <app-task-card *ngFor="let item of done" cdkDrag [cdkDragDisabled]="isDraggingDisabled">
                {{ item.title }}
              </app-task-card>
            </div>
          </app-shared-accordion>
        </div>
       
      </div>
    </div>

    <app-modal>
      <div class="flex flex-col border border-base-content/10 rounded-[3px]">
        <div class="bg-primary p-[24px] flex justify-between">
          <div class="flex flex-col justify-between">
            <h1 class="text-primary-content text-[24px]">Task title placeholder </h1>

            <div class="text-primary-content/50 text-[12px]">Created at 5/1/23 by Adviser Name | Currently in Doing</div>
          </div>
          <label for="app-modal" class="btn btn-sm btn-ghost btn-circle text-primary-content/60"><i-feather name="x"></i-feather></label>
        </div>  
        <div class="flex">
          <div class="w-full bg-base-100 px-6 py-4 flex flex-col gap-2">
            <div class="flex justify-between items-center ">
              <h1 class="text-[20px] text-base-content">Description</h1>
              <!-- border-base-content/30 bg-base-content/10 hover:border-base-content/30  -->
              <button
                class="px-[14px] py-2 btn-ghost btn gap-2 rounded-[3px] text-base-content "
              >
                <i-feather name="plus"></i-feather>

                Edit
              </button>
            </div>

            <div class="h-[2px] w-full bg-base-content/10"></div>
            
            <div class="text-base-content text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit 
            </div>
            
          </div>
          <ul class=" bg-neutral/20 w-[223px]  px-[24px] py-[16px] flex flex-col ">
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              delete <i-feather name="trash"></i-feather>
            </li>
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              move <i-feather name="trash"></i-feather>
            </li>
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              edit <i-feather name="trash"></i-feather>
            </li>
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              verify <i-feather name="trash"></i-feather>
            </li>
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              save <i-feather name="trash"></i-feather>
            </li>
            
            <div class="h-full">
              
            </div>
              
            <li class="rounded-[3px] justify-end btn btn-ghost flex gap-2">
              close <i-feather name="trash"></i-feather>
            </li>
            
          </ul>
        </div>
      </div>  
    </app-modal>
  `,
})
export class TasksComponent implements OnInit{
  // - todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  todo: Task[] = [];
  done: Task[] = [];
  doing: Task[] = [];

  // done = [
  //   'Hire roadie for Gardo Versoza Hire roadie for Gardo Versoza',
  //   'Brush teeth',
  //   'Take a shower',
  //   'Check e-mail',
  //   'Walk dog',
  // ];

  // doing: string[] = [];

  isDraggingDisabled: boolean;

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
    const projectId = this.projectService.activeProjectIdSignal();
    // todo: make this observable complete 
    // todo: improve these
    this.taskService.getTasks(0, projectId).subscribe((task) => 
      this.todo = task
    ) 
    this.taskService.getTasks(1, projectId).subscribe((task) => 
      this.doing = task
    ) 
    this.taskService.getTasks(2, projectId).subscribe((task) => 
      this.done = task
    ) 
  }

  constructor(private authService: AuthService, public taskService: TaskService, public projectService: ProjectService) {
    const isStudent = this.authService.getCurrentUser()?.role_id === 0
    this.isDraggingDisabled = !isStudent;

    // console.log('projectid changed:', this.projectService.activeProjectIdSignal())
  }
}
