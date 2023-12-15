import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {interval, startWith, Subscription, tap} from 'rxjs';

import {COLS, ROWS} from '@/app/@constants/common.constants';
import {Plate, WinnerEnum} from '@/app/@models/plate.models';
import {GameService} from '@/app/@services/game.service';
import {isNumber} from '@/app/@utils/numbers/is-number.util';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [GameService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  public readonly gameService = inject(GameService);
  public readonly cdr = inject(ChangeDetectorRef);
  public readonly destroyRef = inject(DestroyRef);
  public readonly winnerEnum = WinnerEnum;

  public readonly intervalControl = new FormControl(null, [Validators.required]);
  public currentInterval: number = 0;

  private intervalSub!: Subscription;

  trackByFn(index: number) {
    return index;
  }

  public get gridTemplateRows(): string {
    return `repeat(${ROWS}, 1fr)`;
  }

  public get gridTemplateColumns(): string {
    return `repeat(${COLS}, 1fr)`;
  }

  public ngOnInit(): void {
    this.initializeListeners();
  }

  private initializeListeners(): void {
    this.gameService.changeDetectorNotifier$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.cdr.detectChanges();
    });

    this.gameService.score$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.gameService.isWinnerExists) {
        this.intervalSub.unsubscribe();
        alert('some text');
      }
    });
  }

  public onStartGame(): void {
    if (this.intervalControl.invalid && isNumber(this.intervalControl.value)) return;

    this.currentInterval = this.intervalControl.value!;

    this.intervalSub?.unsubscribe();
    this.gameService.resetState();
    this.initializeGame();
  }

  public onUserActivatePlate(plate: Plate): void {
    this.gameService.activatePlateByUser(plate);

    if (this.gameService.isWinnerExists) {
      return;
    }

    this.continueGame();
  }

  private initializeGame(): void {
    this.intervalSub = interval(this.currentInterval)
      .pipe(
        startWith(0),
        tap(() => {
          this.gameService.setComputerWinnerForPendingPlates();
          this.gameService.activateRandomPlate();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(null);
  }

  private continueGame(): void {
    this.intervalSub.unsubscribe();
    this.initializeGame();
  }
}
