import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './components/button.component';

@NgModule({
  declarations: [InputComponent, ButtonComponent],
  imports: [CommonModule, FormsModule],
  exports: [InputComponent, ButtonComponent, FormsModule],
})
export class SharedModule {}
