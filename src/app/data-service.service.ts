import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { LinkDataResponse, NodeDataView } from './data-models/data-models';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  api_loading = new EventEmitter<boolean>();
  search_btn_clicked = new EventEmitter<boolean>();
  node_map_click = new EventEmitter<boolean>();
  panelOpenState = false;
  current_source: string = null;
  node_data: NodeDataView = null;
  panel_data = {};
  panel_current_view_data = [];
  panel_pm_data = {};
  panel_current_pm_data = [];
  is_topology_loading = false;
  loading_utilization = false;
  graph_type = 'step';
  root_url = 'http://localhost:9500/EricssonGISIntellegentDatabase/api';
  constructor(private http: HttpClient) {}
  test_api(site: string) {
    const tree_data = this.http.get(
      `${this.root_url}/network-topology?site_name=${site}`
    );

    return tree_data;
  }
  get_pm_data(site: string) {
    const pm_data = this.http.get(
      `${this.root_url}/network-pmdata/get-data-by-resource-Name?ResourceName=${site}`
    );
    return pm_data;
  }
  // utilization data
  get_link_data(link: string) {
    const pm_data = this.http.get<Array<LinkDataResponse>>(
      `http://localhost:9500/EricssonGISIntellegentDatabase/getAllMicrowaveUtilizationData?SiteInterface=${link}`
    );
    return pm_data;
  }
  get_region_data(region: string) {
    const region_data = this.http.get<[]>(
      `http://localhost:9500/EricssonGISIntellegentDatabase/getDataCenterTopologyByRegion?Region=${region}`
    );
    return region_data;
  }
}
