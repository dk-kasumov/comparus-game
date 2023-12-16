import {Component, inject} from '@angular/core';

import {DialogConfig} from '@/app/@shared/dialog/dialog.config';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  public readonly config = inject(DialogConfig);
}
