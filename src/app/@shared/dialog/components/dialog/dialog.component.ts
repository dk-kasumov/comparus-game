import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  inject,
  OnDestroy,
  Type,
  ViewChild
} from '@angular/core';

import {Subject} from 'rxjs';

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

  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly config = inject(DialogConfig);
  public readonly dialogRef = inject(DialogRef);

  private readonly _onClose = new Subject<never>();

  public componentRef!: ComponentRef<any>;
  public childComponentType!: Type<any>;
  public onClose = this._onClose.asObservable();

  ngAfterViewInit() {
    this.loadChildComponent(this.childComponentType);
    this.cdr.detectChanges();
  }

  loadChildComponent(componentType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
  }

  ngOnDestroy() {
    if (this.componentRef) this.componentRef.destroy();
  }
}
