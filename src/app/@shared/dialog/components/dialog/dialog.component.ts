import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  OnDestroy,
  Type,
  ViewChild
} from '@angular/core';

import {DialogConfig} from '@/app/@shared/dialog/dialog.config';
import {DialogRef} from '@/app/@shared/dialog/dialog.ref';
import {InsertionDirective} from '@/app/@shared/dialog/directives/insertion.directive';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(InsertionDirective) private readonly insertionPoint!: InsertionDirective;

  private readonly cdr = inject(ChangeDetectorRef);
  public readonly config = inject(DialogConfig);
  public readonly dialogRef = inject(DialogRef);

  public componentRef!: ComponentRef<any>;
  public childComponentType!: Type<any>;

  ngAfterViewInit(): void {
    this.loadChildComponent(this.childComponentType);
  }

  private loadChildComponent(componentType: Type<any>): void {
    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.componentRef) this.componentRef.destroy();
  }
}
