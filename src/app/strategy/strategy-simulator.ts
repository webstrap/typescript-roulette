import { StrategyModel, BET_TO_NUMBER } from './strategy.model';

/**
 * TODO: return an observable from the strategy service, which returns
 * entries from here.
 */
export class StrategySimulator {

  strategy: StrategyModel;

  bet: string;
  balance: number;
  curMiss: number;
  curLoss: number;
  placeBet: number;
  lastRoll: number;
  betNumbers: number[];
  winRatio: number;


  constructor(strategy: StrategyModel, bet: string) {
    this.strategy = strategy;
    this.bet = bet;
    this.betNumbers = BET_TO_NUMBER[bet] || [];
    this.balance = 0;
    this.curMiss =  0;
    this.curLoss =  0;
    this.placeBet =  0;
    this.lastRoll =  0;
    this.winRatio = ( 36 / this.betNumbers.length ) - 1;
  }

  getNextBet() {
    return this.placeBet;
  }

  getBalance() {
    return this.balance;
  }

  getWinRatio() {
    return this.winRatio;
  }

  private resetStreak() {
    this.curMiss = 0;
    this.curLoss = 0;
    this.placeBet = 0;
  }

  roll(number: number) {
    this.lastRoll = number;
    this.processBet();
    this.updatePrediction();
  }

  private processBet() {
    if ( this.betNumbers.includes(this.lastRoll) ) {
      if ( this.placeBet ) {
        this.balance += this.placeBet * this.winRatio;
      }
      this.resetStreak();
    } else {
      // on simple chances you get half the money back on a zero
      if ( this.placeBet && this.lastRoll === 0 && this.winRatio === 1) {
        this.balance -= (this.placeBet / 2);
        this.curLoss += (this.placeBet / 2);
      } else if ( this.placeBet ) {
        this.balance -= this.placeBet;
        this.curLoss += this.placeBet;
      }
      this.curMiss++;
    }
  }

  private updatePrediction() {
    if ( this.curMiss >= this.strategy.misses ) {
      // do I need to raise the stake
      if (this.needsProgression()) {
        this.placeBet = Math.ceil(( this.curLoss + 1 ) / this.winRatio );
      }
      // would I exceed my progression limit?
      if (this.curLoss + this.placeBet > this.strategy.stopLoss) {
        this.resetStreak();
      }
    }
    return true;
  }

  // it should win at least on piece
  private needsProgression() {
    return ( this.curLoss ) >= this.placeBet * this.winRatio;
  }
}

