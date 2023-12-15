import {Injectable} from '@angular/core';
import {TARGET_SCORE, TOTAL_PLATES} from '@/app/@constants/common.constants';
import {Plate, WinnerEnum} from '@/app/@models/plate.models';
import {getRandomNumber} from '@/app/@utils/numbers/get-random-number.util';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class GameService {
  public plates: Plate[] = this.generatePlates();
  public readonly score$: BehaviorSubject<Record<'user' | 'computer', number>> = new BehaviorSubject({
    user: 0,
    computer: 0
  });

  private readonly changeDetectorNotifier$$ = new Subject<void>();

  public readonly changeDetectorNotifier$ = this.changeDetectorNotifier$$.asObservable();

  public resetState(): void {
    this.plates = this.generatePlates();
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

  public setComputerWinnerForPendingPlates(): void {
    const score = this.score$.value;

    for (const plate of this.plates) {
      if (plate.winner !== WinnerEnum.PENDING) continue;

      score.computer += 1;
      plate.winner = WinnerEnum.COMPUTER;
    }

    this.score$.next(score);
    this.changeDetectorNotifier$$.next();
  }

  public activatePlateByUser(plate: Plate): void {
    plate.winner = WinnerEnum.USER;

    const platesCopy = this.plates.slice();
    platesCopy.splice(plate.id, 1, plate);
    this.plates = platesCopy;

    const score = this.score$.value;
    score.user += 1;

    this.score$.next(score);
    this.changeDetectorNotifier$$.next();
  }

  public activateRandomPlate(): void {
    const platesWithUndefinedWinner = this.plates.filter(plate => !plate.winner);
    const randomIndex = getRandomNumber(0, platesWithUndefinedWinner.length);
    const randomPlate = platesWithUndefinedWinner[randomIndex];
    randomPlate.winner = WinnerEnum.PENDING;

    this.changeDetectorNotifier$$.next();
  }
}
