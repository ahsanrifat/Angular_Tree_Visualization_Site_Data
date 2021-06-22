import { Component } from '@angular/core';
import * as shape from 'd3-shape';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { TreeData } from './data-models/data-models';
import { DataServiceService } from './data-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tree';
  hierarchialGraph = { nodes: Array(), links: Array() }
  tree_data: TreeData = { nodes: Array(), links: Array() };
  result: string[] = [];
  curve = shape.curveBundle.beta(1)
  center$: Subject<boolean> = new Subject();
  constructor(private dataService: DataServiceService) { }
  public ngOnInit(): void {
    this.dataService.test_api().subscribe(data => {
      if (data.hasOwnProperty('nodes')) {
        this.tree_data.nodes = (data['nodes'])
        this.tree_data.links = (data['edges'])
      }
    })
    this.showGraph();
  }

  showGraph() {
    this.hierarchialGraph = this.tree_data;
    this.center$.next(true)

  }
  get_width(data: any) {
    console.log("Width called", data)
    return data.width
  }
}

