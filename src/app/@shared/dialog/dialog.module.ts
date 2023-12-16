import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SetFocusDirective} from '@/app/@directives/set-focus.directive';
import {DialogComponent} from '@/app/@shared/dialog/components/dialog/dialog.component';
import {InsertionDirective} from '@/app/@shared/dialog/directives/insertion.directive';
import {DialogService} from '@/app/@shared/dialog/services/dialog.service';

@NgModule({
  imports: [CommonModule, SetFocusDirective],
  declarations: [DialogComponent, InsertionDirective],
  providers: [DialogService]
})
export class DialogModule {}
