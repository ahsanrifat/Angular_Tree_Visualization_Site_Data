import { Component, EventEmitter } from '@angular/core';
import * as shape from 'd3-shape';
import { DataServiceService } from './data-service.service';
import ForceGraph3D from '3d-force-graph';
import { NodeDataView, PeriodicElement } from './data-models/data-models';
// import SpriteText from 'three-spritetext';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Graph Explorer';
  graph_type = 'd3-3d-graph-text';
  graph_data = new EventEmitter<[]>();
  option: any[] = [];
  show_loading = false;

  displayedColumns: string[] = [
    'source',
    'interface',
    'time',
    'capacity',
    'utilization avg',
    'utilization max',
    'target',
  ];
  ELEMENT_DATA: PeriodicElement[] = [
    {
      source: 'WR-7080-TN01',
      interface: '1/3/1',
      time: '2021-08-11 14:30',
      capacity: '1100.0 Mbps',
      utilization_avg: '12.579727',
      utilization_max: '30.544182',
      target: 'WR-2543-TN01',
    },
    {
      source: 'WR-7080-TN01',
      interface: '1/3/1',
      time: '2021-08-11 14:30',
      capacity: '1100.0 Mbps',
      utilization_avg: '12.579727',
      utilization_max: '30.544182',
      target: 'WR-2543-TN01',
    },
    {
      source: 'WR-7080-TN01',
      interface: '1/3/1',
      time: '2021-08-11 14:30',
      capacity: '1100.0 Mbps',
      utilization_avg: '12.579727',
      utilization_max: '30.544182',
      target: 'WR-2543-TN01',
    },
  ];
  dataSource = this.ELEMENT_DATA;
  constructor(public dataService: DataServiceService) {}
  public ngOnInit(): void {
    this.dataService.api_loading.subscribe((data) => {
      if (data == false) {
        this.show_loading = false;
      } else {
        this.show_loading = true;
      }
    });
  }

  showGraph(site_name) {
    this.dataService.test_api(site_name).subscribe((data: []) => {
      this.dataService.current_source = site_name;
      this.graph_data.emit(data);
      console.log('API Root Data-->', data);
    });
  }
  graphChange(event) {
    this.graph_type = event.target.value;
  }
  graphNatureChange(event) {
    this.dataService.graph_type = event.target.value;
  }
  on_option_select(op1) {
    console.log(op1);
    if (op1 == 'Voice') {
      this.option = ['2G', '3G'];
    } else if ((op1 = '3G')) {
      this.option = ['2G', '3G', '4G'];
    }
  }
}
