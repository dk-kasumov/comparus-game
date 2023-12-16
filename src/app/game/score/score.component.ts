import {NgOptimizedImage} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-score',
  standalone: true,
  templateUrl: './score.component.html',
  imports: [NgOptimizedImage],
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  @Input({required: true}) userScore!: number;
  @Input({required: true}) computerScore!: number;
}
