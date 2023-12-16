import {Observable, Subject} from 'rxjs';

export class DialogRef {
  private readonly _afterClosed$ = new Subject<any>();

  public afterClosed$: Observable<any> = this._afterClosed$.asObservable();

  public close(result?: any): void {
    this._afterClosed$.next(result);
  }
}
