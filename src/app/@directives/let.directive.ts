import {Directive, inject, Input, TemplateRef, ViewContainerRef} from '@angular/core';

export class LetContext<T> {
  constructor(private readonly letDirective: LetDirective<T>) {}

  get ngLet(): T {
    return this.letDirective.ngLet;
  }
}

@Directive({
  selector: '[ngLet]',
  standalone: true
})
export class LetDirective<T> {
  @Input({required: true}) ngLet!: T;

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef: TemplateRef<LetContext<T>> = inject(TemplateRef);

  constructor() {
    this.viewContainerRef.createEmbeddedView(this.templateRef, new LetContext<T>(this));
  }
}
