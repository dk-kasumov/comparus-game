import {AsyncPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-score',
  standalone: true,
  templateUrl: './score.component.html',
  imports: [AsyncPipe, NgIf, NgOptimizedImage],
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  @Input({required: true}) userScore!: number;
  @Input({required: true}) computerScore!: number;
}
