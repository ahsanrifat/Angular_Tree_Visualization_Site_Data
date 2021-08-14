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
    'demo-position',
    'demo-name',
    'demo-weight',
    'demo-symbol',
  ];
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];
  dataSource = [];
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
