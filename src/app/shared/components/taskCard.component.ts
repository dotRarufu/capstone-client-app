import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from 'src/app/models/tab';
import { DatabaseService } from 'src/app/services/database.service';
import { ProjectService } from 'src/app/services/project.service';
import { Task } from 'src/app/types/collection';

@Component({
  selector: 'app-task-card',
  template: `
  <label class="" for="app-modal">
   
    <div class="shadow-md rounded-[3px]  bg-base-100 border border-base-content/50 cursor-pointer"> 
      <div class="bg-secondary p-[16px] text-secondary-content">
        {{task.title}}
      </div>
      <div class="text-base text-base-content py-[8px] px-[16px] flex items-center justify-end gap-[8px]">
        <span class="text-[12px] text-base-content/70">
          BY
        </span>

        {{adviserName}}
        

          <img class="w-8 avatar rounded-full bg-primary/50" src="https://api.multiavatar.com/test.png" alt="assigner profile" srcset="">
  
      </div>
    </div>

  </label>
  `,
})
export class TaskCardComponent implements OnInit{
  @Input() task: Task = {assigner_id: '', description: '', id: 0, is_validated: false, project_id: 0, status_id: 0, title: ''};
  adviserName = ''

  constructor(private databaseService: DatabaseService) {

  }

  ngOnInit(): void {
    this.getAdviserName();
  }  

  async getAdviserName() {
    const adviser = await this.databaseService.getUserData(this.task.assigner_id);
    this.adviserName = adviser.name || 'unnamed';
  }
}
