import { Injectable } from '@angular/core';
import { DataModel } from './data.model';
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  // Elements are added to the front of the array, this allows to get
  // the lastActive at [0] and as well in the table the most recent are at the top
  list: DataModel[] = [];
  lastActive: DataModel;
  lastActiveObservers: Set<Observer<DataModel>> = new Set();
  lastActive$: Observable<DataModel> = new Observable((observer) => {
    this.lastActiveObservers.add(observer);
    observer.next(this.lastActive);
    return {unsubscribe: () => this.lastActiveObservers.delete(observer)};
  });
  listObservers: Set<Observer<DataModel[]>> = new Set();
  list$: Observable<DataModel[]> = new Observable((observer) => {
    this.listObservers.add(observer);
    observer.next(this.list);
    return {unsubscribe: () => this.listObservers.delete(observer)};
  });

  constructor() {
    const isDataLoaded = this.fromLocalStorage();
    if ( ! isDataLoaded ) {
      this.generateRandomData(1000, 'random-1000');
    }
  }

  getList(): Observable<DataModel[]> {
    return this.list$;
  }

  getById(id: number) {
    return this.list.find( (element) => element.id === id);
  }

  getLastActive(): Observable<DataModel> {
    return this.lastActive$;
  }

  toLocalStorage() {
    localStorage.setItem('data', JSON.stringify(this.list));
  }

  /**
   * return is data loaded from local storage
   */
  fromLocalStorage(): boolean {
    const localData = localStorage.getItem('data');

    const list = JSON.parse(localData);
    if ( !list ) {
      return false;
    }
    // add elements from highest to lowest, since [0] is the lastActive
    for (let index = list.length - 1 ; index > -1 ; index--) {
      this.add(new DataModel(list[index]));
    }
    return true;
  }

  /**
   * TODO: do a shallow compare to prevent duplicates
   * @param data
   */
  add(data: DataModel ): void {
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

  private generateNumbers(count: number): number[] {
    const numbers = [];
    for (let index = 0; index < count; index++) {
      numbers.push(Math.floor(Math.random() * 37));
    }
    return numbers;
  }

  /**
   * Generates random data, adds it to the service.
   * @param count number of random generated numbers
   */
  generateRandomData(count: number, name: string) {
    const data = new DataModel();
    data.name = name;
    data.numbers = this.generateNumbers(count);
    data.generateStatistics();
    this.add(data);
  }

  createFromCSV(csvNumbers: string, name: string) {
    if ( csvNumbers ) {
      // tries to get the numbers in whatever format is passed
      const processedNumbers = csvNumbers.replace(/[^\d]+/g, ',') // clean all not number chars
                              .replace(/^,|,$/g, '')
                              .split(',') // create string array
                              .map((el) => +el) // convert to number arra
                              .filter((el) => (el < 37 && el > -1) ); // remove not valid roulette numbers
      const data = new DataModel();
      data.name = name;
      data.numbers = processedNumbers;
      data.generateStatistics();
      this.add(data);
    }
  }
}
