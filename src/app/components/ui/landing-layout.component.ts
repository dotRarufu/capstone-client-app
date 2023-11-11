import { Component } from '@angular/core';

@Component({
  selector: 'landing-layout',
  standalone: true,
  imports: [],
  template: `
    <div class="relative grid h-screen w-full place-content-center py-16">
      <img
        src="assets/plv-100.jpg"
        alt=""
        srcset=""
        class="absolute -z-[1] h-full w-full object-cover object-top brightness-75 md:object-center"
      />

      <div
        class="mx-auto px-[1rem] sm1:px-[2rem] sm2:flex sm2:w-[840px] sm2:justify-center sm2:p-0 md:w-full md:flex-row md:px-[200px] lg:w-[1040px] lg:px-0"
      >
        <ng-content />
        <img
          class="hidden bg-primary object-cover md:block"
          src="assets/high-five.png"
          alt=""
        />
      </div>
      <div class="absolute bottom-4 right-4 text-sm">Version 2.3.4</div>
    </div>
  `,
})
export class LandingLayoutComponent {}
