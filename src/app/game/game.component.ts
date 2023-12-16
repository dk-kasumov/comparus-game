import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {DigitOnlyModule} from '@uiowa/digit-only';

import {interval, startWith, Subscription, tap} from 'rxjs';

import {COLS, ROWS} from '@/app/@constants/common.constants';
import {NgForTrackByPropDirective} from '@/app/@directives/track-by/track-by-prop.directive';
import {Plate, WinnerEnum} from '@/app/@models/game.models';
import {GameService} from '@/app/@services/game.service';
import {AlertComponent} from '@/app/@shared/alert/alert.component';
import {DialogService} from '@/app/@shared/dialog/services/dialog.service';
import {gameConfig} from '@/app/game/game.config';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, DigitOnlyModule, NgForTrackByPropDirective],
  providers: [GameService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {
  public readonly gameService = inject(GameService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);

  public readonly winnerEnum = WinnerEnum;

  public readonly MIN_INTERVAL = 200;
  public readonly MAX_INTERVAL = 5_000;

  public readonly intervalControl = new FormControl(null, [
    Validators.required,
    Validators.min(this.MIN_INTERVAL),
    Validators.max(this.MAX_INTERVAL)
  ]);

  public currentInterval: number = 0;
  private intervalSub!: Subscription;

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
    this.gameService.score$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (!this.gameService.isWinnerExists) return;

      this.intervalSub?.unsubscribe();

      if (this.gameService.isUserWinner) {
        this.showAlert(gameConfig.userWonAlert.title, gameConfig.userWonAlert.text);
        return;
      }

      if (this.gameService.isComputerWinner) {
        this.showAlert(gameConfig.computerWonAlert.title, gameConfig.computerWonAlert.text);
        return;
      }
    });
  }

  public onStartGame(): void {
    if (this.intervalControl.invalid) return;

    this.currentInterval = this.intervalControl.value!;

    this.gameService.resetState();
    this.initializeGame();
  }

  public onUserActivatePlate(plate: Plate): void {
    this.gameService.setWinnerForPlate(plate, WinnerEnum.USER);

    if (this.gameService.isWinnerExists) return;

    this.initializeGame();
  }

  private initializeGame(): void {
    this.intervalSub?.unsubscribe();

    this.intervalSub = interval(this.currentInterval)
      .pipe(
        startWith(0),
        tap(() => {
          this.gameService.setComputerWinnerForPendingPlates();
          this.gameService.activateRandomPlate();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private showAlert(title: string, text: string): void {
    const ref = this.dialogService.open(AlertComponent, {title, data: {text}});

    ref.afterClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.gameService.resetState();
    });
  }
}
