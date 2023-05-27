import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-nav-rail',
  template: `
    <div
      class="flex h-full w-fit flex-col items-center justify-between gap-[12px] bg-primary px-[4px] py-[24px] text-primary-content"
    >
      <div class="hidden lg:block h-[48px]"></div>
      <button
        (click)="handleMenuClick()"
        class="lg:hidden 0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
      >
      <i-feather name="sidebar" ></i-feather>
      </button>

      <div class="flex h-fit  flex-col items-center gap-[12px]">
        <button
        (click)="navigateTo('tasks')"
          class="btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px] "
        >
        <i-feather name="trello" ></i-feather>
          Tasks
        </button>
        <button
        (click)="navigateTo('dashboard')"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
        <i-feather name="monitor" ></i-feather>
          Dashboard
        </button>
        <button
        (click)="navigateTo('consultations')"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
        <i-feather name="clipboard" ></i-feather>
          Consult
        </button>
        <button
          (click)="navigateTo('participants')"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
        <i-feather name="users" ></i-feather>
          Participants
        </button>
        <button
          (click)="navigateTo('forms')"
          class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
        >
        <i-feather name="file-text" ></i-feather>
          Forms
        </button>
      </div>

      <button
       (click)="navigateToHome()"
        class="0 btn-ghost btn flex h-fit w-full flex-col items-center gap-[4px] rounded-[3px] px-[4px] py-[8px] text-[10px]"
      >
        <i-feather name="arrow-left" ></i-feather>
     
      </button>
    </div>
  `,
})
export class NavigationRailComponent implements OnInit {
  search: string = '';
  @Output() toggleDrawer: EventEmitter<string> = new EventEmitter();
  projectId = -1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectId = this.projectService.activeProjectIdSignal();
  }

  navigateTo(path: string) {
    console.log('path:', path);
    // todo: make the "c" dynamic
    console.log('navigate with:', this.projectId);
    this.router.navigate(['s', 'project', this.projectId, path]);
  
  }

  navigateToHome() {
    this.router.navigate(['s', 'home']);
  }

  handleMenuClick() {
    this.toggleDrawer.emit();
  }
}
