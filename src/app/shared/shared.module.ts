import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGeneratorComponent} from './components/formGenerator.component'

@NgModule({
  declarations: [FormGeneratorComponent],
  imports: [CommonModule, FormsModule, ],
  exports: [FormsModule, CommonModule, FormGeneratorComponent],
})
export class SharedModule {}
