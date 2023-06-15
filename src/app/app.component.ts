import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="h-screen w-screen">
      <router-outlet />
    </div>
  `,
})
export class AppComponent {
  title = 'capstone-client-app';
}
