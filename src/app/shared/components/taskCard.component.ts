import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-task-card',
  template: `
  <label class="" for="app-modal">
    <div class="rounded-[3px]  bg-base-100 border border-base-content/50 cursor-pointer"> 
      <div class="bg-secondary p-[16px] text-secondary-content">
        <ng-content></ng-content>
      </div>
      <div class="text-base text-base-content py-[8px] px-[16px] flex justify-end gap-[8px]">
        Adviser name 
        <div class="avatar rounded-full bg-primary/50">

          <i-feather name="user"></i-feather>
        </div>
      </div>
    </div>
  </label>
  `,
})
export class TaskCardComponent {
  
}
