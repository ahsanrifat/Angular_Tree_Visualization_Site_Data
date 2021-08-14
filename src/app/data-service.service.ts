import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NodeDataView } from './data-models/data-models';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  api_loading = new EventEmitter<boolean>();
  panelOpenState = false;
  current_source: string = null;
  node_data: NodeDataView = null;
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
}
