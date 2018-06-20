import { Injectable } from '@angular/core';
import { StrategyModel, StrategyMode } from './strategy.model';
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  // Elements are added to the front of the array, this allows to get
  // the lastActive at [0] and as well in the table the most recent are at the top
  list: StrategyModel[] = [];
  lastActive: StrategyModel;
  lastActiveObservers: Set<Observer<StrategyModel>> = new Set();
  lastActive$: Observable<StrategyModel> = new Observable((observer) => {
    this.lastActiveObservers.add(observer);
    observer.next(this.lastActive);
    return {unsubscribe: () => this.lastActiveObservers.delete(observer)};
  });
  listObservers: Set<Observer<StrategyModel[]>> = new Set();
  list$: Observable<StrategyModel[]> = new Observable((observer) => {
    this.listObservers.add(observer);
    observer.next(this.list);
    return {unsubscribe: () => this.listObservers.delete(observer)};
  });

  constructor() {
    const isDataLoaded = this.fromLocalStorage();
    if ( ! isDataLoaded ) {
      this.add(new StrategyModel());
    }
  }

  getList(): Observable<StrategyModel[]> {
    return this.list$;
  }

  getById(id: number) {
    return this.list.find( (element) => element.id === id);
  }

  getLastActive(): Observable<StrategyModel> {
    return this.lastActive$;
  }

  toLocalStorage() {
    localStorage.setItem('strategy', JSON.stringify(this.list));
  }

  /**
   * return is data loaded from local storage
   */
  fromLocalStorage(): boolean {
    const localData = localStorage.getItem('strategy');

    const list = JSON.parse(localData);
    if ( !list ) {
      return false;
    }
    // add elements from highest to lowest, since [0] is the lastActive
    for (let index = list.length - 1 ; index > -1 ; index--) {
      this.add(new StrategyModel(list[index]));
    }
    return true;
  }

  add(data: StrategyModel ): void {
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

}
