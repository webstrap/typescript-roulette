import { Component, OnInit } from '@angular/core';
import { StrategyService } from '../../../strategy/strategy.service';
import { StrategyModel, StrategyMode } from '../../../strategy/strategy.model';

@Component({
  selector: 'app-strategy-form',
  templateUrl: './strategy-form.component.html',
  styleUrls: ['./strategy-form.component.scss']
})
export class StrategyFormComponent implements OnInit {

  strategy: StrategyModel;
  modes: StrategyMode[];

  constructor(private strategyService: StrategyService) { }

  ngOnInit() {
    this.strategy = Object.assign({}, this.strategyService.lastActive);
    this.modes = [StrategyMode.COLOR, StrategyMode.COLUMN, StrategyMode.DOZEN,
                  StrategyMode.LOW_HIGH, StrategyMode.PARITY, StrategyMode.TRANSVERSALE];

  }

  onClickAddStrategy() {
    const {mode, misses, stopLoss} = this.strategy;
    const newStrategy = new StrategyModel({mode, misses, stopLoss});
    this.strategyService.add(newStrategy);
  }
}
