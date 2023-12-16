import {NgForOf} from '@angular/common';
import {Directive, inject, Input, NgIterable} from '@angular/core';

@Directive({
  selector: '[ngForTrackByProp]',
  standalone: true
})
export class NgForTrackByPropDirective<T> {
  @Input() ngForOf!: NgIterable<T> | null;

  private readonly ngFor = inject(NgForOf<T | null>, {self: true});

  @Input()
  public set ngForTrackByProp(ngForTrackBy: keyof T) {
    this.ngFor.ngForTrackBy = (index: number, item: T) => item[ngForTrackBy];
  }
}
