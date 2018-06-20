import { Component, OnInit } from '@angular/core';
import { GameModel } from '../../../game/game.model';
import { GameService } from '../../../game/game.service';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  gameList$;

  displayedColumns = ['data', 'strategy', 'maxBalance', 'minBalance', 'finalBalance', 'played', 'statistics', 'log'];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameList$ = this.gameService.getList();
  }

}
