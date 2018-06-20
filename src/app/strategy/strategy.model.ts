let idCounter = 0;

export class StrategyModel {
  mode?: StrategyMode;
  bets: string[];
  misses: number;
  stopLoss: number;
  id: number;

  constructor(model?: Partial<StrategyModel>) {
    model = model || {};
    this.id = model.id || ++idCounter;
    if ( this.id > idCounter ) {
      idCounter = this.id;
    }
    this.mode = model.mode || StrategyMode.TRANSVERSALE;
    this.bets = model.bets || MODE_TO_BET[this.mode] || [];
    this.misses = model.misses || 21;
    this.stopLoss = model.stopLoss || 15;
  }

  equals(otherStrategy: StrategyModel) {
    if (!otherStrategy) {
      return false;
    }
    if (this.mode === otherStrategy.mode
      && this.misses === otherStrategy.misses
      && this.stopLoss === otherStrategy.stopLoss ) {
      return true;
    }
    return false;
  }

  toString() {
    return `${this.mode}-${this.misses}-${this.stopLoss}`;
  }
}

export enum StrategyMode {
  TRANSVERSALE = 'Transversale Simple',
  COLOR = 'Color',
  PARITY = 'Parity',
  SINGLE_NUMBER = 'Single Number',
  DOZEN = 'Dozen',
  COLUMN = 'Column',
  LOW_HIGH = 'Low/High',
}

export enum StrategyBet {
  ODD = 'odd',
  EVEN = 'even',
  RED = 'red',
  BLACK = 'black',
  LOW = 'low',
  HIGH = 'high',
  DOZEN_1 = 'dozen_1',
  DOZEN_2 = 'dozen_2',
  DOZEN_3 = 'dozen_3',
  COLUMN_1 = 'column_1',
  COLUMN_2 = 'column_2',
  COLUMN_3 = 'column_3',
  TRANSVERSALE_01_06 = 'transversale_01_06',
  TRANSVERSALE_07_12 = 'transversale_07_12',
  TRANSVERSALE_13_18 = 'transversale_13_18',
  TRANSVERSALE_19_24 = 'transversale_19_24',
  TRANSVERSALE_25_30 = 'transversale_25_30',
  TRANSVERSALE_31_36 = 'transversale_31_36',
}

export const MODE_TO_BET = {
    [ StrategyMode.PARITY ]: [ StrategyBet.ODD, StrategyBet.EVEN ],
    [ StrategyMode.COLOR ]: [ StrategyBet.RED, StrategyBet.BLACK ],
    [ StrategyMode.LOW_HIGH ]: [ StrategyBet.LOW, StrategyBet.HIGH ],
    [ StrategyMode.DOZEN ]: [ StrategyBet.DOZEN_1, StrategyBet.DOZEN_2, StrategyBet.DOZEN_3 ],
    [ StrategyMode.COLUMN ]: [ StrategyBet.COLUMN_1, StrategyBet.COLUMN_2, StrategyBet.COLUMN_3 ],
    [ StrategyMode.TRANSVERSALE ]: [ StrategyBet.TRANSVERSALE_01_06, StrategyBet.TRANSVERSALE_07_12, StrategyBet.TRANSVERSALE_13_18,
                                     StrategyBet.TRANSVERSALE_19_24, StrategyBet.TRANSVERSALE_25_30, StrategyBet.TRANSVERSALE_31_36 ],
};

export const BET_TO_NUMBER = {
  [StrategyBet.ODD] : [1, 3, 5, 7,  9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
  [StrategyBet.EVEN] : [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],

  [StrategyBet.RED] : [1, 3, 5, 7,  9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  [StrategyBet.BLACK] : [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],

  [StrategyBet.LOW] : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  [StrategyBet.HIGH] : [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],

  [StrategyBet.DOZEN_1] : [ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12],
  [StrategyBet.DOZEN_2] : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  [StrategyBet.DOZEN_3] : [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],

  [StrategyBet.COLUMN_1] : [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [StrategyBet.COLUMN_2] : [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  [StrategyBet.COLUMN_3] : [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],

  [StrategyBet.TRANSVERSALE_01_06] : [1, 2, 3, 4, 5, 6],
  [StrategyBet.TRANSVERSALE_07_12] : [7, 8, 9, 10, 11, 12],
  [StrategyBet.TRANSVERSALE_13_18] : [13, 14, 15, 16, 17, 18],
  [StrategyBet.TRANSVERSALE_19_24] : [19, 20, 21, 22, 23, 24],
  [StrategyBet.TRANSVERSALE_25_30] : [25, 26, 27, 28, 29, 30],
  [StrategyBet.TRANSVERSALE_31_36] : [31, 32, 33, 34, 35, 36],
};
