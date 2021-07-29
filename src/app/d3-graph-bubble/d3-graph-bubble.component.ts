import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import SpriteText from 'three-spritetext';

@Component({
  selector: 'app-d3-graph-bubble',
  templateUrl: './d3-graph-bubble.component.html',
  styleUrls: ['./d3-graph-bubble.component.css'],
})
export class D3GraphBubbleComponent implements OnInit {
  @Input() graph_data = new EventEmitter<[]>();
  constructor() {}

  ngOnInit(): void {
    console.log('D3 Bubble started');
    this.graph_data.subscribe((data) => {
      console.log('D3 Bubble->', data);
      if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
        var myGraph = ForceGraph3D();
        myGraph(document.getElementById('graph'))
          .graphData({ nodes: data['nodes'], links: data['links'] })
          .nodeLabel('label')
          .nodeAutoColorBy('type')
          .linkWidth(2)
          // .nodeRelSize(8)
          .nodeVal(5)
          .linkDirectionalArrowLength(12)
          .linkDirectionalArrowRelPos(1);
        myGraph.d3Force('charge').strength(-120);
      }
    });
  }
}
