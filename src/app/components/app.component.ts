import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="h-screen w-screen">
      <router-outlet />
    </div>
  `,
})
export class AppComponent {}
