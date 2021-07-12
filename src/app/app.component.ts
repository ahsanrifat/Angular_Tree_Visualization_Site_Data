import { Component } from '@angular/core';
import * as shape from 'd3-shape';
// import { NgxGraphModule } from '@swimlane/ngx-graph';
// import { TreeData } from './data-models/data-models';
import { DataServiceService } from './data-service.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { ViewChild } from '@angular/core';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'tree';
  // hierarchialGraph = { nodes: Array(), links: Array() };
  // tree_data: TreeData = { nodes: Array(), links: Array() };
  result: string[] = [];
  curve: any = shape.curveLinear;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: ChartOptions;

  pm_data_tracker = {};
  test = {};
  nodes = Array();
  edges = Array();
  c = null;

  constructor(private dataService: DataServiceService) {}
  public ngOnInit(): void {
    this.c = {
      chart: {
        height: 500, // like left
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yAxis: [
        {
          lineWidth: 1,
          title: {
            text: 'Primary Axis',
          },
        },
        {
          lineWidth: 1,
          opposite: true,
          title: {
            text: 'Secondary Axis',
          },
        },
      ],

      series: [
        {
          data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4,
          ],
        },
        {
          data: [
            144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
            106.4, 129.2,
          ],
          yAxis: 1,
        },
      ],
    };
    this.chartOptions = {
      series: [
        {
          name: 'My-series',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
      },
      title: {
        text: 'My First Angular Chart',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
    };
  }

  showGraph(site_name) {
    this.dataService.test_api(site_name).subscribe((data) => {
      if (data.hasOwnProperty('nodes')) {
        this.nodes = data['nodes'];
        this.edges = data['edges'];
        // console.log(this.tree_data.links);
        this.links(this.nodes);
      }
    });
  }

  get_pm_data(site_link) {
    try {
      var return_data = {
        width: 2,
        color: '#a9a9fc',
      };

      this.dataService.get_pm_data(site_link).subscribe((data) => {
        console.log(site_link, data);
        if (data.hasOwnProperty('PM_Data')) {
          var pm_array = Array();
          pm_array = data['PM_Data'];
          if (pm_array.length > 0) {
            var latest_data = pm_array[pm_array.length - 1];
            console.log(site_link, latest_data);
            if (latest_data.hasOwnProperty('Bandwidth')) {
              if (latest_data['Bandwidth'] != '') {
                var bandwidth = Number(latest_data['Bandwidth']);
                var xMax = 6;
                var xMin = 2;
                var yMax = 100000000000;
                var yMin = 0;
                var percent = (300 - yMin) / (yMax - yMin);
                var outputX = percent * (xMax - xMin) + xMin;
                // edges[indx]['width'] = Math.ceil(outputX);
              }
            }
            var utilization = null;
            if (latest_data.hasOwnProperty('Interface Availability')) {
              var interface_val = Number(latest_data['Interface Availability']);
              if (latest_data['Interface Availability'] == '') {
                interface_val = 100;
              }
              if (interface_val == 0) {
                // red
                return_data['colors'] = '#9e0202';
              } else {
                utilization =
                  Number(latest_data['Inbound Bandwidth Utilization']) +
                  Number(latest_data['Outbound Bandwidth Utilization']);

                if (utilization >= 0 || utilization < 70) {
                  // green
                  return_data['colors'] = '#029e5f';
                  // return_data.color="#029e5f"
                } else if (utilization >= 70 || utilization < 90) {
                  // orange
                  return_data['colors'] = '#eb847c';
                } else if (utilization >= 90) {
                  // red
                  return_data['colors'] = '#9e0202';
                }
              }
            }
            this.pm_data_tracker[site_link] = [
              {
                Bandwidth: latest_data['Bandwidth'],
                Interface: latest_data['Interface Availability'],
                Inbound: latest_data['Inbound Bandwidth Utilization'],
                Outbound: latest_data['Outbound Bandwidth Utilization'],
                Utilization: utilization,
              },
              {
                color: return_data['colors'],
                width: return_data['width'],
              },
            ];
            console.log('PM Data Tracker', this.pm_data_tracker[site_link]);
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
      var label = edges[indx]['label'].split(':');
      var type = edges[indx]['type'];

      if (type == 'link') {
        this.get_pm_data(label[0] + '/' + label[1]);
      }
    }
  }
  get_color(site) {
    // console.log(site)
    if (this.pm_data_tracker.hasOwnProperty(site)) {
      // console.log(this.pm_data_tracker[site][1].color)
      return this.pm_data_tracker[site][1].color;
    } else {
      return '#a9a9fc';
    }
  }
  get_width(site) {
    // console.log(site)
    if (this.pm_data_tracker.hasOwnProperty(site)) {
      // console.log(this.pm_data_tracker[site][1].color)
      return this.pm_data_tracker[site][1].width;
    } else {
      return 2;
    }
  }
  get_tooltip(site) {
    if (this.pm_data_tracker.hasOwnProperty(site)) {
      var data = this.pm_data_tracker[site][0];
      var str = '';
      for (var key in data) {
        str = str + ` ${key}:${data[key]}<br/>`;
      }
      return str;
    } else {
      return 'No Data';
    }
  }
}
