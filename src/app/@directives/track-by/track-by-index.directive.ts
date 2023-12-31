import {NgForOf} from '@angular/common';
import {Directive, inject, Input, NgIterable} from '@angular/core';

@Directive({
  selector: '[ngForTrackByIndex]',
  standalone: true
})
export class NgForTrackByIndexDirective<T> {
  @Input() ngForOf!: NgIterable<T> | null;

  private readonly ngFor = inject(NgForOf<T | null>, {self: true});

  constructor() {
    this.ngFor.ngForTrackBy = (index: number) => index;
  }
}
