import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../standalone/input-field/input-field.component';
import { DialogComponent } from '../standalone/dialog/dialog.component';




@NgModule({
  imports: [
    CommonModule,
    InputFieldComponent,
    DialogComponent
  ],
  declarations: [],
  exports: [
    InputFieldComponent,
    DialogComponent
  ]
})
export class SharedModule { }
