import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent, MatTableDataSource, MatPaginator } from '@angular/material';
import { DataModel } from '../../data/data.model';
import { GameService } from '../../game/game.service';
import { GameModel, LogEntryModel } from '../../game/game.model';
import { BET_TO_NUMBER } from '../../strategy/strategy.model';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.scss']
})
export class GameLogComponent implements OnInit {

  data: GameModel;
  logLength;
  dataSource;

  // Table pagination options
  displayedColumns = ['number', 'balance'];
  length = 100;
  pageSize = 100;
  pageSizeOptions = [50, 100, 1000];
  pageEvent: PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  JSON;

  constructor( private gameService: GameService, private route: ActivatedRoute ) { }

  ngOnInit() {
    this.JSON = JSON;
    const dataId = +this.route.snapshot.paramMap.get('id');
    if ( dataId ) {
      this.data = this.gameService.getById(dataId);
    } else {
      this.data = this.gameService.lastActive;
    }

    if ( this.data ) {
      this.gameService.processGame(this.data, true);
      this.data.strategy.bets.forEach(bet => {
        this.displayedColumns.push(bet);
      });
      this.dataSource = new MatTableDataSource<LogEntryModel>(this.data.log);
      this.dataSource.paginator = this.paginator;
    }
  }

  getColor(number: number) {
    if (number === 0) {
      return 'green';
    }
    if ( BET_TO_NUMBER.red.includes(number) ) {
      return 'red';
    }
    return 'black';
  }

  backToTop() {
    window.scrollTo(0, 0);
  }

}
