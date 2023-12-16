import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {TARGET_SCORE, TOTAL_PLATES} from '@/app/@constants/common.constants';
import {Plate, WinnerEnum} from '@/app/@models/plate.models';
import {getRandomNumber} from '@/app/@utils/numbers/get-random-number.util';

@Injectable()
export class GameService {
  private readonly _plates$: BehaviorSubject<Plate[]> = new BehaviorSubject(this.generatePlates());
  private readonly _score$: BehaviorSubject<Record<'user' | 'computer', number>> = new BehaviorSubject({
    user: 0,
    computer: 0
  });

  public readonly plates$ = this._plates$.asObservable();
  public readonly score$ = this._score$.asObservable();

  public resetState(): void {
    this._plates$.next(this.generatePlates());
    this._score$.next({user: 0, computer: 0});
  }

  private generatePlates(): Plate[] {
    return Array(TOTAL_PLATES)
      .fill(null)
      .map((_, index) => {
        return new Plate(index, null);
      });
  }

  public get isWinnerExists(): boolean {
    return Object.values(this._score$.value).some(value => value >= TARGET_SCORE);
  }

  public get isUserWinner(): boolean {
    return this._score$.value.user >= TARGET_SCORE;
  }

  public get isComputerWinner(): boolean {
    return this._score$.value.computer >= TARGET_SCORE;
  }

  public setComputerWinnerForPendingPlates(): void {
    const scoreCopy = structuredClone(this._score$.value);
    const platesCopy = structuredClone(this._plates$.value);

    for (const plate of platesCopy) {
      if (plate.winner !== WinnerEnum.PENDING) continue;

      scoreCopy.computer += 1;
      plate.winner = WinnerEnum.COMPUTER;
    }

    this._score$.next(scoreCopy);
    this._plates$.next(platesCopy);
  }

  public activatePlateByUser(plate: Plate): void {
    plate.winner = WinnerEnum.USER;

    const platesCopy = structuredClone(this._plates$.value);

    platesCopy.splice(plate.id, 1, plate);

    const score = structuredClone(this._score$.value);
    score.user += 1;

    this._plates$.next(platesCopy);
    this._score$.next(score);
  }

  public activateRandomPlate(): void {
    const platesCopy = structuredClone(this._plates$.value);

    const platesWithUndefinedWinner = platesCopy.filter(plate => !plate.winner);
    const randomIndex = getRandomNumber(0, platesWithUndefinedWinner.length);
    const randomPlate = platesWithUndefinedWinner[randomIndex];
    randomPlate.winner = WinnerEnum.PENDING;

    this._plates$.next(platesCopy);
  }
}
