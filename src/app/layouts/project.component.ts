import { Component } from '@angular/core';
import { NavigationRailComponent } from '../components/nav-rail.component';
import { FeatherIconsModule } from '../modules/feather-icons.module';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BottomNavComponent } from '../components/bottom-nav.component';
import { MobileHeaderComponent } from '../components/mobile-header.component';

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
    <div class="flex">
      <mobile-header />

      <!-- "min-[998px]" makes up for the space taken by navrail -->
      <div class="hidden min-[998px]:block">
        <NavigationRail />
      </div>

      <div
        class="h-screen w-screen overflow-y-scroll p-4 px-[16px] sm1:px-[32px] sm2:w-full sm2:px-0 md:px-[200px] lg:px-0"
      >
        <div class=" w-full sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]">
          <router-outlet />
        </div>
      </div>
      <bottom-nav />
    </div>

    <ngx-spinner
      bdColor="rgba(0, 0, 0, 0.8)"
      size="default"
      color="#fff"
      type="square-loader"
      [fullScreen]="true"
      ><p style="color: white">Loading...</p></ngx-spinner
    >
  `,
})
export class ProjectLayoutComponent {
  urls: string[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.url.subscribe({
      next: (url) => {
        this.urls = url.map((u) => u.path);
      },
    });
  }
}
