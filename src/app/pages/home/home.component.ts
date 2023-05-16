import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CapstoolUser } from 'src/app/models/capstool-user';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  user: CapstoolUser | null = null;
  title: string = '';
  result: any = 'Loading';

  constructor(
    public supabaseService: SupabaseService,
    private router: Router
  ) {}

  async signOut() {
    await this.supabaseService.signOutUser();
    await this.router.navigate(['login']);
  }

  checkTitleQuality() {
    this.supabaseService.checkTitleQuality(this.title).subscribe((v) => {
      // console.log('res', v);
      this.result = v.data;
    });
  }

  removeResult() {
    this.result = 'Loading';
  }
}
