import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'Unauthorized',
  template: `
    <h1 class="text-[48px] text-blue-500">
    Unauthorized. WIP
</h1>
  `,
})
export class UnauthorizedComponent {

 
}
