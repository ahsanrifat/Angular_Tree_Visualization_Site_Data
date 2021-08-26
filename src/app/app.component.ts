import { Component, EventEmitter } from '@angular/core';
import * as shape from 'd3-shape';
import { DataServiceService } from './data-service.service';
import ForceGraph3D from '3d-force-graph';
import { LinkData } from './data-models/data-models';
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
  // dataSource: MatTableDataSource<LinkData>;
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
    if (site_name.length > 3) {
      this.dataService.search_btn_clicked.emit(true);
      this.dataService.is_topology_loading = true;
      this.dataService.test_api(site_name).subscribe((data: []) => {
        this.dataService.panel_current_view_data = [];
        this.dataService.current_source = site_name;
        this.graph_data.emit(data);
        this.dataService.is_topology_loading = false;
        console.log('API Root Data-->', data);
      });
    } else {
      alert('Search node must comtain at least 4 characters!');
    }
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
