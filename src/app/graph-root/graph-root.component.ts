import { Component, EventEmitter, OnInit } from '@angular/core';
import { Marker } from '../data-models/data-models';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-graph-root',
  templateUrl: './graph-root.component.html',
  styleUrls: ['./graph-root.component.css'],
})
export class GraphRootComponent implements OnInit {
  graph_data = new EventEmitter<[]>();
  option: any[] = [];
  show_loading = false;
  show_map_popup = false;
  lat: number = 23.8859;
  lng: number = 45.0792;
  zoom: number = 8;
  show_map = false;
  show_map_label = 'Show Map';
  city_loc_dict = [];
  data_center_loc = [];
  node_array_map = [];
  map_site_list_label = 'Site List';
  region_data = [];
  selected_node = 'W0410-MWN-ER-T1-JED';
  markers: Marker[] = [];
  displayedColumns: string[] = [
    'source',
    'interface',
    'time',
    'capacity',
    'utilization avg',
    'utilization max',
    'target',
  ];
  region_options = ['Centeral', 'Eastern', 'North', 'West'];
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
      this.node_array_map = [];
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
  markerDragEnd(m: Marker, $event) {
    console.log('dragEnd', m, $event);
  }
  mapClicked($event) {
    console.log($event);
  }

  mapToggle() {
    this.show_map = !this.show_map;
    if (this.show_map) {
      this.show_map_label = 'Hide Map';
    } else {
      this.show_map_label = 'Show Map';
    }
  }
  reload_page() {
    location.reload();
  }
  showGraph(site_name) {
    site_name = site_name.toUpperCase();
    if (site_name.length > 3) {
      if (
        (site_name.startsWith('W') && site_name.includes('ER')) ||
        site_name.includes('UPE')
      ) {
        this.dataService.panelOpenState = false;
        this.show_map = false;
        this.show_map_label = 'Show Map';
        this.dataService.search_btn_clicked.emit(true);
        this.dataService.is_topology_loading = true;
        this.dataService.get_topology_data(site_name).subscribe((data: []) => {
          this.dataService.panel_current_view_data = [];
          this.dataService.current_source = site_name;
          this.graph_data.emit(data);
          this.dataService.is_topology_loading = false;
          console.log('API Root Data-->', data);
        });
      } else {
        alert('Search node must starts with W and include `-ER-`');
      }
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
    });
  }
  graphNatureChange(event) {
    this.dataService.graph_type = event.target.value;
    this.dataService.graph_type_change.emit(event.target.value);
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
  checkNumber(number) {
    if (Number(number)) {
      return parseFloat(number).toFixed(2);
    }
    return 'N/A';
  }
}
