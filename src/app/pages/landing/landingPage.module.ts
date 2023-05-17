import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './components/login.component';
import { SignupComponent } from './components/signup.component';
import { LandingComponent } from './components/landing.component';

@NgModule({
  declarations: [LandingComponent, SignupComponent, LoginComponent],
  imports: [SharedModule],
  exports: [LandingComponent],
})
export class LandingPageModule {}
