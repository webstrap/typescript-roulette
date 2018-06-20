import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js';
import { DataService } from '../../data/data.service';
import { Observable } from 'rxjs';
import { DataModel } from '../../data/data.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  dataList$: Observable<DataModel[]>;
  dataList: DataModel[];
  data: DataModel;
  colorPieChart;

  displayedColumns = ['odd', 'even', 'red', 'black', 'low', 'high', 'dozen_1', 'dozen_2', 'dozen_3',
                      'column_1', 'column_2', 'column_3', ];
  displayedColumns2 = ['transversale_01_06', 'transversale_07_12', 'transversale_13_18', 'transversale_19_24',
                      'transversale_25_30', 'transversale_31_36', ];

  constructor(private dataService: DataService,
              private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.dataList$ = this.dataService.getList();
    this.dataList = this.dataService.list;
    this.route.params.subscribe(
      params => {
        const id = +params['id'];
        if ( isNaN(id)  ) {
          this.data = this.dataService.lastActive;
        } else {
          this.data = this.dataService.getById(id);
        }
        this.createGraphs();
      }
    );
  }

  ngAfterViewInit() {
    this.createGraphs();
  }

  changeDataUrl($event) {
    const id = +_.get($event, 'value.id');
    if (!isNaN(id)) {
      this.router.navigateByUrl(`/statistics/${id}`);
    }
  }

  createGraphs() {
    if ( this.data ) {
      const stats = this.data.getStatistics();
      this.buildColorGraph(stats);
      this.buildParityGraph(stats);
      this.buildLowHeighGraph(stats);
      this.buildDozenGraph(stats);
      this.buildColumnGraph(stats);
      this.buildTransversaleGraph(stats);
    }
  }

  ngOnChanges() {
    this.createGraphs();
  }

  ngOnDestroy(): void {
    // TODO destroy chart objects
  }

  getSuccessBasedColor(percent, elements) {
    if ( percent < 100 / elements ) {
      return 'red';
    }
    return 'green';
  }

  buildColorGraph(stats) {
    const data = {
      labels: ['0', 'Red', 'Black'],
      datasets: [{
        data: [stats.numbers[0], stats.red, stats.black],
        backgroundColor: ['rgba(75, 192, 192, 1)', this.getSuccessBasedColor(stats.red, 2), this.getSuccessBasedColor(stats.black, 2)],
      }],
      };
    this.colorPieChart = new Chart('colorCanvas', {
      type: 'pie',
      data,
    });
  }

  buildParityGraph(stats) {
    const data = {
      labels: ['0', 'Odd', 'Even'],
      datasets: [{
        data: [stats.numbers[0], stats.odd, stats.even],
        backgroundColor: ['rgba(75, 192, 192, 1)',  this.getSuccessBasedColor(stats.odd, 2), this.getSuccessBasedColor(stats.even, 2)],
      }],
      };
    this.colorPieChart = new Chart('parityCanvas', {
      type: 'pie',
      data,
    });
  }

  buildLowHeighGraph(stats) {
    const data = {
      labels: ['0', 'Low', 'High'],
      datasets: [{
        data: [stats.numbers[0], stats.low, stats.high],
        backgroundColor: ['rgba(75, 192, 192, 1)', this.getSuccessBasedColor(stats.low, 2), this.getSuccessBasedColor(stats.high, 2)],
      }],
      };
    this.colorPieChart = new Chart('lowHeighCanvas', {
      type: 'pie',
      data,
    });
  }

  buildDozenGraph(stats) {
    const data = {
      labels: ['0', 'First Dozen', 'Second Dozen', 'Third Dozen'],
      datasets: [{
        data: [stats.numbers[0], stats.dozen_1, stats.dozen_2, stats.dozen_3],
        backgroundColor: ['rgba(75, 192, 192, 1)',  this.getSuccessBasedColor(stats.dozen_1, 3),
                          this.getSuccessBasedColor(stats.dozen_2, 3), this.getSuccessBasedColor(stats.dozen_3, 3)],
      }],
      };
    this.colorPieChart = new Chart('dozenCanvas', {
      type: 'pie',
      data,
    });
  }

  buildColumnGraph(stats) {
    const data = {
      labels: ['0', 'First Column', 'Second Column', 'Third Column'],
      datasets: [{
        data: [stats.numbers[0], stats.column_1, stats.column_2, stats.column_3],
        backgroundColor: ['rgba(75, 192, 192, 1)', this.getSuccessBasedColor(stats.column_1, 3),
        this.getSuccessBasedColor(stats.column_2, 3), this.getSuccessBasedColor(stats.column_3, 3)],
      }],
      };
    this.colorPieChart = new Chart('columnCanvas', {
      type: 'pie',
      data,
    });
  }

  buildTransversaleGraph(stats) {
    const data = {
      labels: ['0', 'Transversale 1-6', 'Transversale 7-12', 'Transversale 13-18',
               'Transversale 19-24', 'Transversale 25-30', 'Transversale 31-36'],
      datasets: [{
        data: [stats.numbers[0], stats.transversale_01_06, stats.transversale_07_12, stats.transversale_13_18,
               stats.transversale_19_24, stats.transversale_25_30, stats.transversale_31_36],
        backgroundColor: ['rgba(75, 192, 192, 1)', this.getSuccessBasedColor(stats.transversale_01_06, 6),
                          this.getSuccessBasedColor(stats.transversale_07_12, 6), this.getSuccessBasedColor(stats.transversale_13_18, 6),
                          this.getSuccessBasedColor(stats.transversale_19_24, 6), this.getSuccessBasedColor(stats.transversale_25_30, 6),
                          this.getSuccessBasedColor(stats.transversale_31_36, 6)],
      }],
    };
    this.colorPieChart = new Chart('transversaleCanvas', {
      type: 'pie',
      data,
    });
  }
}
