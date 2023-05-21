import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TopAppBarService } from 'src/app/services/top-app-bar.service';

@Component({
  selector: 'app-top-app-bar',
  template: `
    <div
      class=" w-full bg-primary  px-[1rem]  py-[1rem]  sm1:px-[32px] sm2:px-0 md:px-[200px]"
    >
      <div
        class=" flex  w-full flex-row  items-center justify-between text-primary-content   sm2:mx-auto sm2:w-[840px] md:w-full lg:w-[1040px]"
      >
        <h1 class="text-2xl ">{{ activePath || 'Home' }}</h1>
        <div class="flex flex-row items-center gap-2 text-base">
          <!-- todo: fetch data from user service -->
          Markova Tanya
          <div class="avatar">
            <div class="w-[40px] rounded-full">
              <img src="https://api.multiavatar.com/random.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
// todo: fix the background of login at laptop breakpoint
export class TopAppBarComponent {
  profileUrl: string = '';
  name: string = '';
  activePath: string = '';

  // watch for changes in
  constructor(private topAppBarService: TopAppBarService) {
    // todo: add unsubscribe or convert to signal
    this.topAppBarService.activePath$.subscribe(
      // (path) => (this.activePath = path)
    );
  }
}
