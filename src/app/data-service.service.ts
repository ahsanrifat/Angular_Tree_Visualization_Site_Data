import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  root_url="http://localhost:9500/EricssonGISIntellegentDatabase/api"
  constructor(private http: HttpClient) { }
  test_api(site:string) {
    const tree_data = this.http.get(`${this.root_url}/network-topology?site_name=${site}`)

    return tree_data;
  }
  get_pm_data(site:string){
    const pm_data=this.http.get(`${this.root_url}/network-pmdata/get-data-by-resource-Name?ResourceName=${site}`)
    return pm_data;
  }

}
