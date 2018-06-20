import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameModel } from '../../../game/game.model';
import { GameService } from '../../../game/game.service';
import { StrategyService } from '../../../strategy/strategy.service';
import { DataService } from '../../../data/data.service';
import { DataModel } from '../../../data/data.model';
import { StrategyModel } from '../../../strategy/strategy.model';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  game: GameModel;
  dataList: DataModel[];
  strategyList: StrategyModel[];
  selectedData: DataModel;
  selectedStrategy: StrategyModel;

  constructor(  private gameService: GameService,
                private strategyService: StrategyService,
                private dataService: DataService ) { }

  ngOnInit() {
    this.dataList = this.dataService.list;
    this.strategyList = this.strategyService.list;
    this.dataService.getLastActive().subscribe(data => this.selectedData = data);
    this.strategyService.getLastActive().subscribe(strategy => this.selectedStrategy = strategy);
  }

  onClickPlayGame() {
    const newGame = new GameModel();
    newGame.data = this.selectedData;
    newGame.strategy = this.selectedStrategy;
    this.gameService.add(newGame);
  }
}
