import { bootstrapApplication } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { AppComponent } from './app/components/app.component';
import { app } from './app/routes/app';
import { ThemeService } from './app/services/theme.service';

const initialize = (theme: ThemeService) => {
  return () => console.log(theme.theme());
};

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initialize,
      multi: true,
      deps: [ThemeService],
    },
    provideAnimations(),
    provideToastr({ preventDuplicates: true, progressBar: true }),
    importProvidersFrom([
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      NgChartsModule,
    ]),
    provideRouter([...app]),
  ],
}).catch((err) => console.error(err));
