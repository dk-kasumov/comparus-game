import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {TARGET_SCORE, TOTAL_PLATES} from '@/app/@constants/game.constants';
import {Plate, Score, WinnerEnum} from '@/app/@models/game.models';
import {getRandomNumber} from '@/app/@utils/numbers/get-random-number.util';

@Injectable()
export class GameService {
  private readonly _plates$: BehaviorSubject<Plate[]> = new BehaviorSubject(this.generatePlates());
  private readonly _score$: BehaviorSubject<Score> = new BehaviorSubject(new Score(0, 0));

  public readonly plates$ = this._plates$.asObservable();
  public readonly score$ = this._score$.asObservable();

  public get isWinnerExists(): boolean {
    return Object.values(this._score$.value).some(value => value >= TARGET_SCORE);
  }

  public get isUserWinner(): boolean {
    return this._score$.value.user >= TARGET_SCORE;
  }

  public get isComputerWinner(): boolean {
    return this._score$.value.computer >= TARGET_SCORE;
  }

  public resetState(): void {
    this._plates$.next(this.generatePlates());
    this._score$.next(new Score(0, 0));
  }

  private generatePlates(): Plate[] {
    return Array(TOTAL_PLATES)
      .fill(null)
      .map((_, index) => new Plate(index, null));
  }

  public setComputerWinnerOfPendingPlates(): void {
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

  public setWinnerOfPlate(plate: Plate, winner: WinnerEnum): void {
    const platesCopy = structuredClone(this._plates$.value);
    const scoreCopy = structuredClone(this._score$.value);

    platesCopy.splice(plate.index, 1, {...plate, winner});
    scoreCopy.user += 1;

    this._plates$.next(platesCopy);
    this._score$.next(scoreCopy);
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
