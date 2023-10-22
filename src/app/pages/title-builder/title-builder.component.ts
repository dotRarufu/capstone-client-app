import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { from, tap } from 'rxjs';
import { FeatherIconsModule } from 'src/app/components/icons/feather-icons.module';
import { TopAppBarComponent } from 'src/app/components/ui/top-app-bar.component';
import { ProjectService } from 'src/app/services/project.service';
import { HomeStateService } from '../home/data-access/home-state.service';

type Action =
  | 'defaultPrefix'
  | 'customPrefix'
  | 'noAppName'
  | 'appName'
  | 'setApart'
  | 'clientName';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TopAppBarComponent,
    FeatherIconsModule,
    NgxSpinnerModule,
  ],
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <top-app-bar activePath="Title Builder" />
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:mx-auto lg:w-[1040px] lg:px-0"
      >
        <div class="w-full ">
          <ng-container *ngIf="step === 1">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-xl text-base-content sm2:text-2xl">
                  Are you planning to do a project with development and
                  evaluation?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <p>
                  Usually, capstone project titles start with Development and
                  Evaluation. You can select "No" if you think this is not
                  applicable to your project.
                </p>
                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2 sm1:flex-col sm1:justify-between"
                >
                  <button
                    (click)="navigateToHome()"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70" name="x-circle" />
                    <span class="uppercase"> cancel </span>
                  </button>
                  <button
                    (click)="nextStep(2)"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70" name="slash" />
                    <span class="uppercase"> no </span>
                  </button>
                  <div class=" w-full"></div>
                  <button
                    (click)="nextStep(3, 'defaultPrefix')"
                    class="btn-primary btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70" name="check" />
                    <span class="uppercase"> Yes </span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 2">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-xl text-base-content sm2:text-2xl">
                  What kind of project are you doing?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    It is better to consult it to the current chairperson and
                    faculty members before proceeding with this in your title.
                  </p>
                  <input
                    #customPrefix
                    type="text"
                    placeholder="Design and Analysis"
                    class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
                  />
                </div>

                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2 sm1:flex-col sm1:justify-between"
                >
                  <button
                    (click)="nextStep(1)"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-base-content/70"
                      name="chevron-left"
                    />
                    <span class="uppercase"> back </span>
                  </button>
                  <button
                    (click)="nextStep(3, 'customPrefix', customPrefix.value)"
                    class="btn-primary btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-primary-content/70"
                      name="chevron-right"
                    />
                    <span class="uppercase"> next </span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 3">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-xl text-base-content sm2:text-2xl">
                  Does your project have an application name?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    Commonly, a capstone project will have a name, to easily
                    identify and set it apart from others. This also creates a
                    brand, so think it through before picking one. Make sure it
                    represents what your project can do.
                  </p>
                  <input
                    #appName
                    type="text"
                    placeholder="Capstool"
                    class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
                  />
                </div>
                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2   sm1:flex-col sm1:justify-between"
                >
                  <button
                    (click)="nextStep(2)"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-base-content/70"
                      name="chevron-left"
                    />
                    <span class="uppercase"> back </span>
                  </button>
                  <button
                    (click)="nextStep(4, 'noAppName')"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70" name="slash" />
                    <span class="uppercase"> no </span>
                  </button>
                  <div class="grow-1 h-full w-full"></div>
                  <button
                    (click)="nextStep(4, 'appName', appName.value)"
                    class="btn-primary btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70" name="check" />
                    <span class="uppercase"> Yes </span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 4">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-xl text-base-content sm2:text-2xl">
                  Describe your system that set it apart from others
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    These are the words the describes your system and sets it
                    apart from others. Be very careful in selecting these words,
                    as this can mean a 'life or death' situation for your
                    project.
                  </p>
                  <input
                    #setApart
                    type="text"
                    placeholder="Android-based Ordering System with QR Code ..."
                    class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
                  />
                </div>
                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2   sm1:flex-col sm1:justify-between"
                >
                  <button
                    (click)="nextStep(3)"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-base-content/70"
                      name="chevron-left"
                    />
                    <span class="uppercase"> back </span>
                  </button>

                  <div class="grow-1 h-full w-full"></div>
                  <button
                    (click)="nextStep(5, 'setApart', setApart.value)"
                    class="btn-primary btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-primary-content/70"
                      name="chevron-right"
                    />
                    <span class="uppercase"> next </span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 5">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-xl text-base-content sm2:text-2xl">
                  Who is the client of the project?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    The client represents the individual, organization, or
                    entity for whom you are conducting this capstone project. It
                    adds real-world context to your project and helps you tailor
                    your solutions to meet the client's specific needs and
                    expectations. Your project's success may be directly tied to
                    how well you address your client's requirements.
                  </p>
                  <input
                    #clientName
                    type="text"
                    placeholder="Maysan National Highschool"
                    class=" input w-full rounded-[3px] border border-base-content/50 px-3 py-2 placeholder:text-base placeholder:text-base-content placeholder:opacity-70"
                  />
                </div>
                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2   sm1:flex-col sm1:justify-between"
                >
                  <button
                    (click)="nextStep(4)"
                    class="btn-ghost btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-base-content/70"
                      name="chevron-left"
                    />
                    <span class="uppercase"> back </span>
                  </button>

                  <div class="grow-1 h-full w-full"></div>
                  <button
                    (click)="nextStep(6, 'clientName', clientName.value)"
                    class="btn-primary btn flex flex-row gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather
                      class="text-primary-content/70"
                      name="chevron-right"
                    />
                    <span class="uppercase"> next </span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
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
export class TitleBuilderComponent {
  step = 1;
  title: {
    prefix: string;
    name: string | null;
    description: string;
    client: string;
  } = { prefix: '', name: null, description: '', client: '' };

  projectService = inject(ProjectService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);
  toastr = inject(ToastrService);
  homeStateService = inject(HomeStateService);

  analyzeTitle() {
    this.spinner.show();
    const prefix = this.title.prefix;
    const name = this.title.name;
    const description = this.title.description;
    const client = this.title.client;

    const title = `${prefix} of ${
      name ? `${name}:` : description
    } ${description} for ${client} `;

    const req = from(this.projectService.analyzeTitle(title))
      .pipe(tap(() => this.homeStateService.updateRequests()))
      .subscribe({
        next: (res) => {
          this.toastr.success(`Request ${res.id} has been placed in queue `);
          this.router.navigate(['s', 'home', 'title-analyzer']);
          this.spinner.hide();
        },
        error: (err) => {
          const message = err as string;
          this.toastr.error(message);

          this.spinner.hide();
        },
      });
  }

  editTitle(action: Action, ...params: string[]) {
    // todo: capitalize string
    const actions = {
      defaultPrefix: () => (this.title.prefix = 'Development and Evaluation'),
      customPrefix: (prefix: string) =>
        (this.title.prefix = [...prefix].join('')),
      appName: (name: string) => (this.title.name = name),
      noAppName: () => (this.title.name = null),
      setApart: (description: string) => (this.title.description = description),
      clientName: (name: string) => (this.title.client = name),
    };

    actions[action](params[0]);
  }

  nextStep(step: number, action?: Action, ...params: string[]) {
    if (params.includes('')) {
      this.toastr.error('Input cannot be empty');

      return;
    }

    // todo: implement history
    if (step === 6) {
      this.editTitle('clientName', ...params);
      this.analyzeTitle();
    } else this.step = step;

    if (action) this.editTitle(action, ...params);
  }

  navigateToHome() {
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }
}
