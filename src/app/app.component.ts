import { Component, EventEmitter } from '@angular/core';
import * as shape from 'd3-shape';
import { DataServiceService } from './data-service.service';
import ForceGraph3D from '3d-force-graph';
// import SpriteText from 'three-spritetext';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Graph Explorer';
  graph_type = 'ngx-forced';
  graph_data = new EventEmitter<[]>();
  constructor(private dataService: DataServiceService) {}
  public ngOnInit(): void {}

  showGraph(site_name) {
    this.dataService.test_api(site_name).subscribe((data: []) => {
      if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
        this.graph_data.emit(data);
        console.log('API Data', this.graph_data);
      }
    });
  }
  graphChange(event) {
    this.graph_type = event.target.value;
  }
}
