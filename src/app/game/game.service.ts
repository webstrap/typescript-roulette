import { Injectable } from '@angular/core';
import { GameModel, LogEntryModel } from './game.model';
import { Observable, Observer } from 'rxjs';
import { StrategySimulator } from '../strategy/strategy-simulator';
import { DataService } from '../data/data.service';
import { StrategyService } from '../strategy/strategy.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // Elements are added to the front of the array, this allows to get
  // the lastActive at [0] and as well in the table the most recent are at the top
  list: GameModel[] = [];
  lastActive: GameModel;
  lastActiveObservers: Set<Observer<GameModel>> = new Set();
  lastActive$: Observable<GameModel> = new Observable((observer) => {
    this.lastActiveObservers.add(observer);
    observer.next(this.lastActive);
    return {unsubscribe: () => this.lastActiveObservers.delete(observer)};
  });
  listObservers: Set<Observer<GameModel[]>> = new Set();
  list$: Observable<GameModel[]> = new Observable((observer) => {
    this.listObservers.add(observer);
    observer.next(this.list);
    return {unsubscribe: () => this.listObservers.delete(observer)};
  });

  constructor(private dataService: DataService, private strategyService: StrategyService) {
    // Will dependencies lead to the right initialization order?
    // make sure this is initialized after the other services
    // setTimeout( () => , 0);
    this.fromLocalStorage();
  }

  getList(): Observable<GameModel[]> {
    return this.list$;
  }

  getById(id: number) {
    return this.list.find( (element) => element.id === id);
  }

  getLastActive(): Observable<GameModel> {
    return this.lastActive$;
  }

  toLocalStorage() {
    const localStorageList = this.list.map( element => {
      const reducedElement: any = Object.assign({}, element);
      reducedElement.data = reducedElement.data.id;
      reducedElement.strategy = reducedElement.strategy.id;
      delete reducedElement.log;
      return reducedElement;
    });
    localStorage.setItem('game', JSON.stringify(localStorageList));
  }

  /**
   * return is data loaded from local storage
   */
  fromLocalStorage(): boolean {
    const localData = localStorage.getItem('game');

    const list = JSON.parse(localData);
    if ( !list ) {
      return false;
    }
    // add elements from highest to lowest, since [0] is the lastActive
    for (let index = list.length - 1 ; index > -1 ; index--) {
      list[index].data = this.dataService.getById(list[index].data);
      list[index].strategy = this.strategyService.getById(list[index].strategy);
      if ( !list[index].data || !list[index].strategy ) {
        console.log('BOOOM', list[index]);
      }
      this.add(new GameModel(list[index]));
    }
    return true;
  }

  /**
   * TODO: do a shallow compare to prevent duplicates
   * @param data
   */
  add(data: GameModel ): void {
    this.processGame(data);
    const index = this.list.findIndex( e => e.equals(data) );
    if (index !== -1) {
      this.list.splice(index, 1);
    }
    this.list.unshift(data);
    this.toLocalStorage();
    this.lastActive = data;
    this.listObservers.forEach((observer) => { observer.next(this.list); });
    this.lastActiveObservers.forEach( (observer) => { observer.next(this.lastActive); });
  }

  processGame(game: GameModel, log = false): void {
    if ( !game && (!game.strategy || !game.data) ) {
      console.warn('gameData is not populated');
    }

    if ( log ) {
      game.log = [];
    }
    game.maxBalance = 0;
    game.minBalance = 0;
    game.finalBalance = 0;
    game.played = 0;
    // create a simulator for each bet
    const simulators = [];
    game.strategy.bets.forEach(bet => {
      simulators.push(new StrategySimulator(game.strategy, bet));
    });

    let balanceSum = 0;
    // enter one number a time to all simulators
    game.data.numbers.forEach(number => {
      let entry: LogEntryModel;
      if ( log ) {
        entry = new LogEntryModel();
        entry.number = number;
      }
      balanceSum = 0;
      simulators.forEach(simulator => {
        if ( log ) {
          if ( simulator.getNextBet() ) {
            entry.bets[simulator.bet] = simulator.getNextBet();
          }
        }
        simulator.roll(number);
        balanceSum += simulator.getBalance();
        if ( simulator.getNextBet() > 0 ) {
          game.played++;
        }
      });

      if ( balanceSum > game.maxBalance ) {
        game.maxBalance = balanceSum;
      }
      if ( balanceSum < game.minBalance ) {
        game.minBalance = balanceSum;
      }
      if ( log ) {
        entry.balance = balanceSum;
        game.log.push(entry);
      }
    });
    game.finalBalance = balanceSum;

  }
}
