import {Directive, inject, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appInsertion]'
})
export class InsertionDirective {
  public readonly viewContainerRef = inject(ViewContainerRef);
}
