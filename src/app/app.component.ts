import { Component } from '@angular/core';
import * as shape from 'd3-shape';
// import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TreeData } from './data-models/data-models';
import { DataServiceService } from './data-service.service';
// import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tree';
  hierarchialGraph = { nodes: Array(), links: Array() };
  tree_data: TreeData = { nodes: Array(), links: Array() };
  result: string[] = [];
  curve: any = shape.curveLinear;

  pm_data_tracker = {};
  test={};
  nodes = Array();

  constructor(private dataService: DataServiceService) {}
  public ngOnInit(): void {
    this.dataService.test_api('WR-1682-TN01').subscribe((data) => {
      if (data.hasOwnProperty('nodes')) {
        this.tree_data.nodes = data['nodes'];
        this.nodes = data['nodes'];
        this.tree_data.links = data['edges'];
        // console.log(this.tree_data.links);
        this.links(this.tree_data.links);
      }
    });
    this.showGraph();
  }

  showGraph() {
    this.hierarchialGraph = this.tree_data;
  }

  get_pm_data(site, edges, indx) {
    try {
      var return_data = {
        width: 2,
        color: '#000000',
      };
      edges[indx]['color'] = '#000000'
      edges[indx]['width'] = 2
      this.dataService.get_pm_data('W5743.SWH.').subscribe((data) => {
        if (data.hasOwnProperty('PM_Data')) {
          var pm_array = Array();
          pm_array = data['PM_Data'];
          if (pm_array.length > 0) {
            var latest_data = pm_array[pm_array.length - 1];
            if (latest_data.hasOwnProperty('Bandwidth')) {
              if (latest_data['Bandwidth'] != '') {
                var bandwidth = Number(latest_data['Bandwidth']);
                var xMax = 6;
                var xMin = 2;
                var yMax = 100000000000;
                var yMin = 0;
                var percent = (300 - yMin) / (yMax - yMin);
                var outputX = percent * (xMax - xMin) + xMin;
                edges[indx]['width'] = Math.ceil(outputX);
              }
            }
            var utilization = null;
            if (latest_data.hasOwnProperty('Interface_Availability')) {
              var interface_val = Number(latest_data['Interface_Availability']);
              if (latest_data['Interface_Availability'] == '') {
                interface_val = 100;
              }
              if (interface_val == 0) {
                // red
                return_data['colors'] = '#9e0202';
                // console.log(return_data);
              } else {
                utilization =
                  Number(latest_data['Inbound_Bandwidth_Utilization']) +
                  Number(latest_data['Outbound_Bandwidth_Utilization']);

                if (utilization >= 0 || utilization < 70) {
                  // green
                  edges[indx]['color'] = '#029e5f';
                  // return_data.color="#029e5f"
                } else if (utilization >= 70 || utilization < 90) {
                  // orange
                  edges[indx]['color'] = '#eb847c';
                } else if (utilization >= 90) {
                  // red
                  edges[indx]['color'] = '#9e0202';
                }
              }
            }
            this.pm_data_tracker[site]=
            [
              {
              Bandwidth: latest_data['Bandwidth'],
              Interface: latest_data['Interface_Availability'],
              Inbound:latest_data['Inbound_Bandwidth_Utilization'],
              Outbound:latest_data['Outbound_Bandwidth_Utilization'],
              Utilization:utilization,
            },{
              color:edges[indx]['color'],
              width:edges[indx]['width']
            }
          ]
          this.test[1]="1213"
            }
          }
      });
    } catch (err) {
      console.log(err);
    }
    return return_data;
  }
  links(edges: any) {
    for (var indx in edges) {
      var source = edges[indx]['source'];
      var target = edges[indx]['target'];
      if (!(this.pm_data_tracker.hasOwnProperty(source))) {
        this.get_pm_data(source, edges, indx);
        // edges[indx]['color'] = return_data.color;
        // edges[indx]['width'] = return_data.width;
      }
    }
    console.log(this.pm_data_tracker.hasOwnProperty("WR-2727-TN01"))
    for(var i in this.pm_data_tracker){
      console.log(i)
    }
  }
  get_color(site){
    // console.log(site)
    if(this.pm_data_tracker.hasOwnProperty(site)){
      // console.log(this.pm_data_tracker[site][1].color)
      return this.pm_data_tracker[site][1].color
    }else{
      return "#00000"
    }
  }
  get_width(site){
    // console.log(site)
    if(this.pm_data_tracker.hasOwnProperty(site)){
      // console.log(this.pm_data_tracker[site][1].color)
      return this.pm_data_tracker[site][1].width
    }else{
      return 2
    }
  }
  get_tooltip(site){
    if(this.pm_data_tracker.hasOwnProperty(site)){
      var data=this.pm_data_tracker[site][0]
      var str=""
      for(var key in data){
        str=str+` ${key}:${data[key]}<br/>`
      }
      return str
    }else{
      return "No Data"
    }
  }
}
