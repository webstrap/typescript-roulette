import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFormComponent } from './component/strategy-analyser/game-form/game-form.component';
import { StatisticsComponent } from './component/statistics/statistics.component';
import { GameLogComponent } from './component/game-log/game-log.component';
import { LiveModeComponent } from './component/live-mode/live-mode.component';

const routes: Routes = [
  { path: '', redirectTo: '/analyser', pathMatch: 'full' },
  { path: 'analyser', component: GameFormComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'statistics/:id', component: StatisticsComponent },
  { path: 'live', component: LiveModeComponent },
  { path: 'log', component: GameLogComponent },
  { path: 'log/:id', component: GameLogComponent },
];


@NgModule({
  exports: [ RouterModule ],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }

