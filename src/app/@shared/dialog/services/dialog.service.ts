import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  inject,
  Injectable,
  Injector,
  Type
} from '@angular/core';

import {first} from 'rxjs';

import {DialogComponent} from '@/app/@shared/dialog/components/dialog/dialog.component';
import {DialogConfig} from '@/app/@shared/dialog/dialog.config';
import {DialogRef} from '@/app/@shared/dialog/dialog.ref';
import {DialogInjector} from '@/app/@shared/dialog/injectors/dialog.injector';

@Injectable()
export class DialogService {
  private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);

  public dialogComponentRef!: ComponentRef<DialogComponent>;

  public open(componentType: Type<any>, config: DialogConfig): DialogRef {
    const dialogRef = this.appendDialogComponentToBody(config);

    this.dialogComponentRef.instance.childComponentType = componentType;

    return dialogRef;
  }

  private appendDialogComponentToBody(config: DialogConfig): DialogRef {
    const map = new WeakMap();
    map.set(DialogConfig, config);

    const dialogRef = new DialogRef();
    map.set(DialogRef, dialogRef);

    dialogRef.afterClosed$.pipe(first()).subscribe(() => {
      this.removeDialogComponentFromBody();
    });

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const componentRef = componentFactory.create(new DialogInjector(this.injector, map));

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    return dialogRef;
  }

  private removeDialogComponentFromBody(): void {
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
  }
}
