import { Component, OnInit } from '@angular/core';
import { StrategyModel } from '../../strategy/strategy.model';
import { StrategyService } from '../../strategy/strategy.service';

@Component({
  selector: 'app-live-mode',
  templateUrl: './live-mode.component.html',
  styleUrls: ['./live-mode.component.scss']
})
export class LiveModeComponent implements OnInit {

  number: string;
  strategyList: StrategyModel[];
  selectedStrategy: StrategyModel;

  constructor(private strategyService: StrategyService) { }

  ngOnInit() {
    this.strategyList = this.strategyService.list;
    this.strategyService.getLastActive().subscribe(strategy => this.selectedStrategy = strategy);
  }

}
