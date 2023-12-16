import {AfterViewInit, Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appSetFocus]',
  standalone: true
})
export class SetFocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
