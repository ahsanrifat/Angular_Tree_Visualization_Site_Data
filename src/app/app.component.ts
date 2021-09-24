import { Component, EventEmitter } from '@angular/core';
import { DataServiceService } from './data-service.service';
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
  show_map_popup = false;
  // initial center position for the map
  lat: number = 23.8859;
  lng: number = 45.0792;
  zoom: number = 8;
  show_map = false;
  show_map_label = 'Show Map';
  city_loc_dict = [];
  data_center_loc = [];
  node_array_map = [];
  map_site_list_label = 'Site List';
  clickedMarker(label: string, index: number) {
    const city_name = label;
    // console.log(`clicked the marker: ${label || index}`);
    if (this.city_loc_dict.hasOwnProperty(city_name)) {
      // a city has been clicked
      console.log('City Clicked->', city_name);
      this.city_loc_dict = [];
      this.markers = [];
      if (!this.data_center_loc.hasOwnProperty(city_name)) {
        this.data_center_loc[city_name] = true;
        this.node_array_map = [];
        let is_set_label = false;
        for (var obj of this.region_data) {
          if (obj['City'] == city_name) {
            this.data_center_loc[obj['DataCenter']] = true;
            this.markers.push({
              lat: obj['DataCenterLaitude'],
              lng: obj['DataCenterLongitude'],
              label: obj['DataCenter'],
              draggable: false,
            });
          }
        }
      }
    } else if (this.data_center_loc.hasOwnProperty(city_name)) {
      // its a datacenter
      const center = label;
      this.map_site_list_label = label + '- Site List';
      console.log('Data Center->', center);
      this.show_map_popup = true;
      for (var obj of this.region_data) {
        if (obj['DataCenter'] == center) {
          this.node_array_map.push(obj['NodeName']);
        }
      }
      console.log('Node Array->', this.node_array_map);
    }
  }
  mapNodeClicked(node) {
    // this.dataService.node_map_click.emit(node);
    console.log(node);
    this.selected_node = node;
    this.showGraph(node);
  }
  markerDragEnd(m: marker, $event) {
    console.log('dragEnd', m, $event);
  }
  mapClicked($event) {
    console.log($event);
  }
  markers: marker[] = [];
  displayedColumns: string[] = [
    'source',
    'interface',
    'time',
    'capacity',
    'utilization avg',
    'utilization max',
    'target',
  ];
  region_data = [];
  city_options = [];
  center_options = [];
  node_options = [];
  selected_node = 'WR-1330-TN01';
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
  mapToggle() {
    this.show_map = !this.show_map;
    if (this.show_map) {
      this.show_map_label = 'Hide Map';
    } else {
      this.show_map_label = 'Show Map';
    }
  }
  showGraph(site_name) {
    if (site_name.length > 3) {
      this.dataService.panelOpenState = false;
      this.show_map = false;
      this.show_map_label = 'Show Map';
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
  onRegionSelect(event) {
    this.dataService.panelOpenState = false;
    this.dataService.panel_current_view_data = [];
    const region = event.target.value;
    console.log('Region Selected->', region);
    this.dataService.get_region_data(region).subscribe((data) => {
      this.region_data = data;
      let city = new Set();
      for (var obj of data) {
        const city_name = obj['City'];
        city.add(city_name);
        if (!this.city_loc_dict.hasOwnProperty(city_name)) {
          this.city_loc_dict[city_name] = true;
          this.markers.push({
            lat: obj['Latitude'],
            lng: obj['Longitude'],
            label: city_name,
            draggable: false,
          });
        }
      }
      this.show_map = true;
      this.show_map_label = 'Hide Map';
      this.city_options = Array.from(city.values());
      this.city_options.splice(0, 0, '--');
      this.center_options = ['--'];
      this.node_options = ['--'];
    });
  }
  onCitySelect(event) {
    const city = event.target.value;
    if (city != '--') {
      console.log('Region Selected->', city);

      let center = new Set();
      for (var obj of this.region_data) {
        if (obj['City'] == city) {
          center.add(obj['DataCenter']);
        }
      }
      this.center_options = Array.from(center.values());
      this.center_options.splice(0, 0, '--');
    }
  }
  onDataCenterSelect(event) {
    const center = event.target.value;
    console.log('Data Center Selected->', center);

    let node = new Set();
    for (var obj of this.region_data) {
      if (obj['DataCenter'] == center) {
        node.add(obj['NodeID']);
      }
    }
    this.node_options = Array.from(node.values());
    this.node_options.splice(0, 0, '--');
  }
  onNodeSelect(event) {
    this.selected_node = event.target.value;
    this.showGraph(this.selected_node);
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
  getUtilizationColor(utilization_val) {
    if (utilization_val != '') {
      const utilization = Number(utilization_val);
      if (utilization >= 0 && utilization < 70) {
        // green
        // '#029e5f';
        // console.log('Utilization', utilization);
        return 'uti_green';
      } else if (utilization >= 70 && utilization < 90) {
        // orange
        // '#eb847c';
        return 'uti_orange';
      } else if (utilization >= 90) {
        // red
        // '#9e0202';
        return 'uti_red';
      }
    }
    return 'uti';
  }
}
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
