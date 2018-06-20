import { BET_TO_NUMBER } from '../strategy/strategy.model';

let idCounter = 0;

export class DataModel {
  timeCreated: Date;
  id: number;
  name: string;
  type: GameDataType = GameDataType.random;
  numbers: number[];
  statistics?;
  private isDirty: boolean;

  constructor(model?: Partial<DataModel>) {
    // timeCreated needs to be initialised with null, because undefined creates an invalid date
    model = model || {timeCreated: null};
    this.id = model.id || ++idCounter;
    if ( this.id > idCounter ) {
      idCounter = this.id;
    }
    this.timeCreated = new Date(model.timeCreated);
    this.name = model.name || '';
    this.statistics = model.statistics || {
      numbers: {}
    };
    this.numbers = model.numbers || [];
  }

  equals(otherData: DataModel) {
    if (!otherData) {
      return false;
    }
    if (this.numbers === otherData.numbers) {
      return true;
    }
    return false;
  }

  addNumber(number: number) {
    this.isDirty = true;
    this.numbers.push(number);
  }

  setNumbers(numbers: number[]) {
    this.isDirty = true;
    this.numbers = numbers;

  }

  getStatistics() {
    if ( this.isDirty ) {
      this.generateStatistics();
    }
    return this.statistics;
  }

  toString() {
    return `${this.timeCreated.toLocaleTimeString()}-${this.name}`;
  }

  /**
   * Currently is generating the statistics completely new. In general
   * incremental update could make sense as well.
   */
  generateStatistics() {
    this.statistics = { numbers: {}};
    this.numbers.forEach( (number) => {
      this.statistics.numbers[number] = ++this.statistics.numbers[number] || 1;
      NUMBER_TO_BETS[number].forEach(bet => {
        this.statistics[bet] = ++this.statistics[bet] || 1;
      });
    });
    Object.keys(this.statistics).forEach( (bet) => {
      if ( bet !== 'numbers' ) {
        this.statistics[bet] = (this.statistics[bet] / this.numbers.length * 100).toFixed(2);
      }
    });
    Object.keys(this.statistics.numbers).forEach( (bet) => {
      this.statistics.numbers[bet] = (this.statistics.numbers[bet] / this.numbers.length * 100).toFixed(2);
    });
  }
}

export enum GameDataType {
  random = 'random',
  csv = 'csv',
}

// will get initialized below
export const NUMBER_TO_BETS = {
  0: [],
};

// initialize {NUMBER_TO_BETS} for 0-36
// by looking them up in {BET_TO_NUMBER}
for (let index = 1; index < 37; index++) {
  NUMBER_TO_BETS[index] = [];
  Object.keys(BET_TO_NUMBER).forEach(element => {
    if (BET_TO_NUMBER[element].includes(index)) {
      NUMBER_TO_BETS[index].push(element);
    }
  });
}
