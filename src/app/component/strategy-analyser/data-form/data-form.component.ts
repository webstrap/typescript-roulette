import { Component, OnInit } from '@angular/core';
import { DataModel, GameDataType } from '../../../data/data.model';
import { DataService } from '../../../data/data.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  data: DataModel;
  count: number;
  type: GameDataType;
  typeList: GameDataType[];
  import: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.data = Object.assign({}, this.dataService.lastActive);
    this.count = this.data.numbers.length;
    this.typeList = [GameDataType.random, GameDataType.csv];
    this.type = this.data.type;
  }

  onClickCreateData() {
    if ( !this.count || !this.type) {
      console.warn('Error: nothing to generate');
      return;
    }
    if (this.type === GameDataType.random) {
      this.dataService.generateRandomData(this.count, this.data.name);
    } else {
      this.dataService.createFromCSV(this.import, this.data.name);
    }
  }

  isRandom(): boolean {
    return this.type === GameDataType.random;
  }
}
