import {Routes} from '@angular/router';
import {RoutePaths} from '@/app/@constants/route-path.constant';

export const routes: Routes = [
  {
    path: RoutePaths.GAME,
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent)
  }
];
