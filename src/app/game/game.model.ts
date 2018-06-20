import { DataModel } from '../data/data.model';
import { StrategyModel } from '../strategy/strategy.model';

let idCounter = 0;

export class GameModel {
  id: number;
  data?: DataModel;
  strategy?: StrategyModel;
  log?: LogEntryModel[]; // [numbers],einsatz, balance
  minBalance: number;
  maxBalance: number;
  finalBalance: number;
  played: number;

  constructor(model?: Partial<GameModel>) {
    model = model || {};
    this.id = model.id || ++idCounter;
    if ( this.id > idCounter ) {
      idCounter = this.id;
    }
    this.data = model.data;
    this.strategy = model.strategy;
    this.minBalance = model.minBalance || 0;
    this.maxBalance = model.maxBalance || 0;
    this.finalBalance = model.finalBalance || 0;
    this.played = model.played || 0;
  }

  equals(otherGame: GameModel): boolean {
      if (!otherGame) {
          return false;
      }
      if (this.data === otherGame.data && this.strategy === otherGame.strategy ) {
          return true;
      }
      return false;
  }

  toString() {
    return `${this.id}-${this.data}-${this.strategy}`;
  }
}

export class LogEntryModel {
    bets: object;
    balance: number;
    number: number;

    constructor() {
      this.bets = {};
      this.balance = 0;
    }

    toString() {
      return JSON.stringify(this.bets);
    }
}
