import { Component, OnInit, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project.service';
import { fromEvent, map } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationRailComponent } from 'src/app/pages/project/nav-rail.component';
import { CommonModule } from '@angular/common';
import { MobileHeaderComponent } from 'src/app/pages/project/mobile-header.component';
import { SpinnerComponent } from 'src/app/components/spinner.component';
import { BottomNavComponent } from 'src/app/pages/project/bottom-nav.component';
import { ArchivedMarkComponent } from './archived-mark.component';

@Component({
  standalone: true,
  imports: [
    NavigationRailComponent,
    CommonModule,
    MobileHeaderComponent,
    SpinnerComponent,
    BottomNavComponent,
    RouterModule,
    ArchivedMarkComponent,
  ],
  selector: 'project-page',
  template: `
    <div class="flex h-full flex-col min-[998px]:flex-row">
      <div class="hidden min-[998px]:block">
        <navigation-rail />
      </div>

      <archived-mark *ngIf="isInArchive$ | async" />

      <div class="basis-[64px] min-[998px]:hidden">
        <mobile-header />
      </div>

      <div
        class="w-screen flex-1  overflow-y-auto p-4 px-[16px] sm1:px-[32px] sm2:w-full sm2:px-0 md:px-[200px] lg:px-0"
      >
        <div
          class="h-full w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
        >
          <router-outlet />
        </div>
      </div>

      <div class="basis-[64px] min-[998px]:hidden">
        <bottom-nav />
      </div>
    </div>

    <spinner />
  `,
})
export class ProjectPageComponent {
  toastrService = inject(ToastrService);
  projectService = inject(ProjectService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  projectId = Number(this.route.snapshot.url[0].path);
  isInArchive$ = this.projectService
    .getProjectInfo(this.projectId)
    .pipe(map((p) => p.is_done));
}
