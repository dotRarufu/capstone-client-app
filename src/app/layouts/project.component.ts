import { Component, OnDestroy, inject, signal } from '@angular/core';
import { NavigationRailComponent } from '../components/nav-rail.component';
import { FeatherIconsModule } from '../modules/feather-icons.module';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BottomNavComponent } from '../components/bottom-nav.component';
import { MobileHeaderComponent } from '../components/mobile-header.component';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../services/project.service';
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'ProjectLayout',
  standalone: true,
  imports: [
    NavigationRailComponent,
    FeatherIconsModule,
    NgxSpinnerModule,
    RouterModule,
    BottomNavComponent,
    CommonModule,
    MobileHeaderComponent,
  ],
  template: `
    <div class="flex h-full flex-col min-[998px]:flex-row">
      <div class="hidden min-[998px]:block">
        <NavigationRail />
      </div>

      <ng-container *ngIf="isInArchive()">
        <div
          class="absolute bottom-[32px] right-[32px] z-[99999] hidden min-[998px]:block"
        >
          <div class="alert alert-info rounded-[5px] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>This project is in archived</span>
          </div>
        </div>

        <div class="basis-[48px] min-[998px]:hidden">
          <div class="flex h-full w-full items-center justify-center  bg-info">
            <span class="text-base text-info-content">
              This project is in archived
            </span>
          </div>
        </div>
      </ng-container>

      <div class="basis-[64px] min-[998px]:hidden">
        <mobile-header />
      </div>

      <div
        class="w-screen flex-1  overflow-y-scroll p-4 px-[16px] sm1:px-[32px] sm2:w-full sm2:px-0 md:px-[200px] lg:px-0"
      >
        <div
          class="h-full w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
        >
          <router-outlet />
        </div>
      </div>

      <div class="basis-[64px] min-[998px]:hidden">
        <bottom-nav />
        <div></div>

        <ngx-spinner
          bdColor="rgba(0, 0, 0, 0.8)"
          size="default"
          color="#fff"
          type="square-loader"
          [fullScreen]="true"
          ><p style="color: white">Loading...</p></ngx-spinner
        >
      </div>
    </div>
  `,
})
export class ProjectLayoutComponent {
  urls: string[] = [];
  toastrService = inject(ToastrService);
  projectService = inject(ProjectService);
  toastId: number | null = null;
  isDesktop = false;
  isInArchive = signal(false);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.watchWindowSize();
    const projectId = Number(this.route.snapshot.url[0].path);
    console.log('projet id from project layout:', projectId);
    this.projectService.getProjectInfo(projectId).subscribe({
      next: (p) => {
        this.isInArchive.set(p.is_done);
      },
    });

    this.route.url.subscribe({
      next: (url) => {
        this.urls = url.map((u) => u.path);
      },
    });
  }

  watchWindowSize() {
    const windowResize$ = fromEvent(window, 'resize');
    this.isDesktop = window.innerWidth >= 1240;
    windowResize$.pipe(map((_) => window.innerWidth)).subscribe({
      next: (width) => {
        this.isDesktop = width >= 1240;
      },
    });
  }
}
