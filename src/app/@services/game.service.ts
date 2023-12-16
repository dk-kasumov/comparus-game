import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {TARGET_SCORE, TOTAL_PLATES} from '@/app/@constants/common.constants';
import {Plate, WinnerEnum} from '@/app/@models/plate.models';
import {getRandomNumber} from '@/app/@utils/numbers/get-random-number.util';

@Injectable()
export class GameService {
  public plates$: BehaviorSubject<Plate[]> = new BehaviorSubject(this.generatePlates());
  public readonly score$: BehaviorSubject<Record<'user' | 'computer', number>> = new BehaviorSubject({
    user: 0,
    computer: 0
  });

  public resetState(): void {
    this.plates$.next(this.generatePlates());
    this.score$.next({user: 0, computer: 0});
  }

  private generatePlates(): Plate[] {
    return Array(TOTAL_PLATES)
      .fill(null)
      .map((_, index) => {
        return new Plate(index, null);
      });
  }

  public get isWinnerExists(): boolean {
    return Object.values(this.score$.value).some(value => value >= TARGET_SCORE);
  }

  public get isUserWinner(): boolean {
    return this.score$.value.user >= TARGET_SCORE;
  }

  public get isComputerWinner(): boolean {
    return this.score$.value.computer >= TARGET_SCORE;
  }

  public setComputerWinnerForPendingPlates(): void {
    const scoreCopy = structuredClone(this.score$.value);
    const platesCopy = structuredClone(this.plates$.value);

    for (const plate of platesCopy) {
      if (plate.winner !== WinnerEnum.PENDING) continue;

      scoreCopy.computer += 1;
      plate.winner = WinnerEnum.COMPUTER;
    }

    this.score$.next(scoreCopy);
    this.plates$.next(platesCopy);
  }

  public activatePlateByUser(plate: Plate): void {
    plate.winner = WinnerEnum.USER;

    const platesCopy = structuredClone(this.plates$.value);

    platesCopy.splice(plate.id, 1, plate);

    const score = structuredClone(this.score$.value);
    score.user += 1;

    this.plates$.next(platesCopy);
    this.score$.next(score);
  }

  public activateRandomPlate(): void {
    const platesCopy = structuredClone(this.plates$.value);

    const platesWithUndefinedWinner = platesCopy.filter(plate => !plate.winner);
    const randomIndex = getRandomNumber(0, platesWithUndefinedWinner.length);
    const randomPlate = platesWithUndefinedWinner[randomIndex];
    randomPlate.winner = WinnerEnum.PENDING;

    this.plates$.next(platesCopy);
  }
}
