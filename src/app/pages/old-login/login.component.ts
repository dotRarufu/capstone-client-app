import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  title = 'capstone-client-app';
  email: string = '';
  password: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  register() {
    // todo: fill this up with actual user data
    const dummyUser = { name: 'dummy', roleId: 1 };
    this.supabaseService
      .registerUser(this.email, this.password, dummyUser)
      .subscribe((v) => {
        // console.log('register res:', v);
      });
  }

  login() {
    const signIn$ = this.supabaseService.signInUser(this.email, this.password);
    signIn$.subscribe((v) => {
      console.log('signIn$ emits');
      this.router.navigate(['home']);
    });
  }
}
