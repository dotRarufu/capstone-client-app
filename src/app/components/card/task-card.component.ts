import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Task } from 'src/app/types/collection';

@Component({
  selector: 'TaskCard',
  standalone: true,
  imports: [],
  template: `
    <div
      onclick="taskDetails.showModal()"
      class="cursor-pointer rounded-[3px]  border border-base-content/50 bg-base-100 shadow-md"
    >
      <div class="bg-secondary p-[16px] text-secondary-content">
        {{ task.title }}
      </div>
      <div
        class="flex items-center justify-end gap-[8px] px-[16px] py-[8px] text-base text-base-content"
      >
        <span class="text-[12px] text-base-content/70"> BY </span>

        {{ adviserName }}

        <img
          class="avatar w-8 rounded-full bg-primary/50"
          src="https://api.multiavatar.com/test.png"
          alt="assigner profile"
          srcset=""
        />
      </div>
    </div>
  `,
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task = {
    assigner_id: '',
    description: '',
    id: 0,
    
    project_id: 0,
    status_id: 0,
    title: '',
  };
  adviserName = '';

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.getAdviserName();
  }

  async getAdviserName() {
    const adviser = await this.databaseService.getUserData(
      this.task.assigner_id
    );
    this.adviserName = adviser.name || 'unnamed';
  }
}
