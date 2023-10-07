import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabDefinition } from 'src/app/models/tab';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { ProjectService } from 'src/app/services/project.service';
import { FormGeneratorService } from 'src/app/services/form-generator.service';
import { TabsService } from 'src/app/services/tabs.service';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../../components/ui/tabs.component';
import { SpinnerComponent } from 'src/app/components/spinner.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    FeatherIconsModule,
    TabsComponent,
    CommonModule,
    RouterModule,
    SpinnerComponent,
  ],
  template: `
    <ng-container
      *ngIf="{ formUrl: formGeneratorService.formUrl$ | async } as observables"
    >
      <div
        class="flex h-full w-full flex-col gap-[16px] overflow-y-clip sm1:overflow-y-visible"
      >
        <div class="w-full">
          <tabs [isResponsive]="false" />
        </div>

        <div class="relative h-[calc(100vh-60px)] overflow-x-clip">
          <router-outlet #myOutlet="outlet" />
          <button
            *ngIf="observables.formUrl !== ''"
            [class.hidden]="!myOutlet.isActivated"
            (click)="anchor.click()"
            class="btn-ghost btn absolute bottom-0 right-0 gap-2 rounded-[3px] border-base-content/30 bg-base-content/10 text-base-content hover:border-base-content/30"
          >
            <i-feather class="text-base-content/70" name="download" />
          </button>
        </div>
      </div>

      <a #anchor class="hidden" [href]="observables.formUrl" download></a>
    </ng-container>

    <spinner />
  `,
})
export class FormGeneratorComponent implements OnInit {
  projectService = inject(ProjectService);
  tabsService = inject(TabsService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  formGeneratorService = inject(FormGeneratorService);

  @ViewChild('#anchor') anchor!: ElementRef<HTMLAnchorElement>;

  handleDownloadClick() {
    this.anchor.nativeElement.click();
  }

  ngOnInit(): void {
    const tabs: TabDefinition[] = [
      {
        name: 'Form 1',
        id: '1',
      },
      {
        name: 'Form 2',
        id: '2',
      },
      {
        name: 'Form 3',
        id: '3',
      },
      {
        name: 'Form 4',
        id: '4',
      },
    ];
    const child1 = this.route.parent!.parent!.snapshot.firstChild;
    const active = child1?.url[0].path;
    const projectId = Number(this.route.parent!.parent!.snapshot.url[0].path);
    const role: string = this.route.snapshot.data['role'];

    let route = [role, 'p', projectId.toString(), 'project', 'forms'];
    if (role !== 's') {
      route = [ role, 'p', projectId.toString(), 'project', 'forms'];
    }

    this.tabsService.setTabs(tabs, route, active);
  }

  resetterSubscription = this.router.events
    .pipe(
      takeUntilDestroyed(),
      filter((event) => event.constructor.name === 'NavigationStart')
    )
    .subscribe({
      next: (url) => this.formGeneratorService.clearFormUrl(),
    });
}
