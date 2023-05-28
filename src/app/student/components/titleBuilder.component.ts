import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tab } from 'src/app/models/tab';
import { ProjectService } from 'src/app/services/project.service';

type Action = "defaultPrefix" | "customPrefix" | "noAppName" | "appName" | "setApart" | "clientName";

@Component({
  selector: 'app-student-title-builder',
  template: `
    <div class="flex flex-col gap-[1rem]">
      <div>
        <app-top-app-bar activePath="Title Builder"></app-top-app-bar>
      </div>

      <div
        class="px-auto flex justify-center px-[1rem] sm1:px-[2rem] sm2:px-0 md:px-[200px] lg:mx-auto lg:w-[1040px] lg:px-0"
      >
        <div class="w-full ">
          <!-- mobile block -->

          <ng-container *ngIf="step === 1">
            <div
              class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
            >
              <div class="flex justify-between ">
                <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                  Are you planning to do a project with development and
                  evaluation?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaec.
                </p>
                <div
                  class="flex shrink-0 basis-[223px] flex-row gap-2   sm1:flex-col sm1:justify-between"
                >
                  <button
                  (click)="navigateToHome()"
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="x-circle"></i-feather> cancel
                  </button>
                  <button
                  (click)="nextStep(2)"
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="slash"></i-feather> no
                  </button>
                  <div class="w-full h-full"></div>
                  <button
                  (click)="nextStep(3, 'defaultPrefix')"
                    class="btn-primary btn flex h-fit w-full flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70"name="check"></i-feather> yes
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
                <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                  What kind of project are you doing?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaec.
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
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="chevron-left"></i-feather> back
                  </button>
                  <button
                  (click)="nextStep(3, 'customPrefix', customPrefix.value)"
                    class="btn-primary btn flex h-fit w-full flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70"name="chevron-right"></i-feather> next
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
                <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                  Does your project have an application name?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaec.
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
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="chevron-left"></i-feather> back
                  </button>
                  <button
                  (click)="nextStep(4, 'noAppName')"
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="slash"></i-feather> no
                  </button>
                  <div class="grow-1 h-full w-full"></div>
                  <button
                  (click)="nextStep(4, 'appName', appName.value)"
                    class="btn-primary btn flex h-fit w-full flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70"name="check"></i-feather> yes
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
                <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                  Describe your system that set it apart from others
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaec.
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
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="chevron-left"></i-feather> back
                  </button>

                  <div class="grow-1 h-full w-full"></div>
                  <button
                  (click)="nextStep(5, 'setApart', setApart.value)"
                    class="btn-primary btn flex h-fit w-full flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70"name="chevron-right"></i-feather> next
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
                <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                  Who is the client of the project?
                </h1>
              </div>

              <div class="h-[2px] w-full bg-base-content/10"></div>

              <div
                class="flex flex-col gap-2 text-base text-base-content sm1:flex-row"
              >
                <div class="flex flex-col gap-2">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaec.
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
                    class="btn-ghost btn flex h-fit flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-base-content/70"name="chevron-left"></i-feather> back
                  </button>

                  <div class="grow-1 h-full w-full"></div>
                  <button
                  (click)="nextStep(6, 'clientName', clientName.value)"
                    class="btn-primary btn flex h-fit w-full flex-1 justify-center gap-2 rounded-[3px] sm1:flex-initial sm1:justify-start"
                  >
                    <i-feather class="text-primary-content/70"name="chevron-right"></i-feather> next
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

        </div>

        <!-- desktop -->
        <!-- <div class=" hidden w-full gap-[1rem]  md:flex lg:w-[1040px]">
          <div class="flex flex-col gap-4">
            <ng-container *ngIf="step === 1">
            <div
              class="w-full md:w-[294px] md:flex-shrink-0  md:basis-[294px] "
            >
              <div
                class="mx-auto flex w-full flex-col gap-[16px] sm2:w-[840px] md:w-full  "
              >
                <div class="flex justify-between ">
                  <h1 class="text-[24px] text-base-content sm2:text-[32px]">
                    Are you planning to do a project with development and
                    evaluation?
                  </h1>
                </div>

                <div class="h-[2px] w-full bg-base-content/10"></div>

                <div
                  class="flex flex-col text-base text-base-content sm1:flex-row"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaec.
                  <div class="flex shrink-0 basis-[223px] flex-col  gap-2 py-2">
                    <li
                      class="btn-ghost btn flex justify-end gap-2 rounded-[3px] sm1:justify-start"
                    >
                      <i-feather class="text-base-content/70"name="trash"></i-feather> yes
                    </li>
                    <li
                      class="btn-ghost btn flex justify-end gap-2 rounded-[3px] sm1:justify-start"
                    >
                      <i-feather class="text-base-content/70"name="trash"></i-feather> no
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
          </div>
        </div> -->
      </div>
    </div>

    <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "default" color = "#fff" type = "square-loader" [fullScreen] = "true"><p style="color: white" > Loading... </p></ngx-spinner>
  `,
})
export class TitleBuilderComponent {
  step = 1;
  title: {
    prefix: string,
    name: string | null ,
    description: string,
    client: string
  } = {prefix: '', name: null, description: '', client: ''};

  // todo: implement history
  nextStep(step: number, action?: Action, ...params: string[]) {
    if (step === 6) this.analyzeTitle()
    else this.step = step;

    if (action)
      this.editTitle(action, ...params);
  }

  editTitle(action: Action, ...params: string[]) {

    // todo: capitalize string
    const actions = {
      "defaultPrefix": () => this.title.prefix = "Development and Evaluation",
      "customPrefix": (prefix: string) => this.title.prefix = [...prefix].join(''),
      "appName": (name: string) => this.title.name = name,
      "noAppName": () => this.title.name = null,
      "setApart": (description: string) => this.title.description = description,
      "clientName": (name: string) => this.title.client = name,
    }

    actions[action](params[0]);
  }

  async analyzeTitle() {
    this.spinner.show();
    const prefix = this.title.prefix;
    const name = this.title.name;
    const description = this.title.description;
    const client = this.title.client;

    const title = `${prefix} of ${name ? `${name}:`  : description} ${description} for ${client} `

    console.log('title:', title);
    await this.projectService.analyzeTitle(title);
    this.spinner.hide();
    this.router.navigate(['s', 'home', 'title-analyzer-result']);
  }

  navigateToHome() {
    this.router.navigate(['s', 'home', 'title-analyzer']);
  }

  constructor(private projectService: ProjectService, private router: Router, private spinner: NgxSpinnerService) {
    window.addEventListener('keydown', () => console.log('title:', this.title))
  }
}
