import { Component, EventEmitter } from '@angular/core';
import * as shape from 'd3-shape';
import { DataServiceService } from './data-service.service';
import ForceGraph3D from '3d-force-graph';
import { NodeDataView } from './data-models/data-models';
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
  constructor(public dataService: DataServiceService) {}
  public ngOnInit(): void {}

  showGraph(site_name) {
    this.dataService.test_api(site_name).subscribe((data: []) => {
      if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
        this.dataService.current_source = site_name;
        this.graph_data.emit(data);
        console.log('API Root Data-->', data);
      }
    });
  }
  graphChange(event) {
    this.graph_type = event.target.value;
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
