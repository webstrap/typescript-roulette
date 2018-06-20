import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameFormComponent } from './component/strategy-analyser/game-form/game-form.component';
import { DataFormComponent } from './component/strategy-analyser/data-form/data-form.component';
import { StrategyFormComponent } from './component/strategy-analyser/strategy-form/strategy-form.component';

import {  MatButtonModule,
          MatFormFieldModule,
          MatInputModule,
          MatExpansionModule,
          MatTableModule,
          MatTabsModule,
          MatToolbarModule,
          MatSelectModule,
          MatPaginatorModule} from '@angular/material';
import { GameListComponent } from './component/strategy-analyser/game-list/game-list.component';
import { StrategyService } from './strategy/strategy.service';
import { DataService } from './data/data.service';
import { GameService } from './game/game.service';
import { AppRoutingModule } from './/app-routing.module';
import { StatisticsComponent } from './component/statistics/statistics.component';
import { GameLogComponent } from './component/game-log/game-log.component';
import { LiveModeComponent } from './component/live-mode/live-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    GameFormComponent,
    DataFormComponent,
    StrategyFormComponent,
    GameListComponent,
    StatisticsComponent,
    GameLogComponent,
    LiveModeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatTableModule,
    MatTabsModule,
    AppRoutingModule,
    MatSelectModule,
    MatPaginatorModule,
  ],
  providers: [
    StrategyService,
    DataService,
    GameService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
