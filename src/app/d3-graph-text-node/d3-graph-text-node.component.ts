import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import SpriteText from 'three-spritetext';

@Component({
  selector: 'app-d3-graph-text-node',
  templateUrl: './d3-graph-text-node.component.html',
  styleUrls: ['./d3-graph-text-node.component.css'],
})
export class D3GraphTextNodeComponent implements OnInit {
  @Input() graph_data = new EventEmitter<[]>();
  constructor() {}

  ngOnInit(): void {
    console.log('D3 Test started');
    this.graph_data.subscribe((data) => {
      console.log('D3 Text->', data);
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
          .linkDirectionalArrowRelPos(1)
          // .linkLabel('type')
          .nodeThreeObject((node) => {
            const sprite = new SpriteText(node.label);
            // sprite.material.depthWrite = false; // make sprite background transparent
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          });
        myGraph.d3Force('charge').strength(-120);
      }
    });
  }
}
