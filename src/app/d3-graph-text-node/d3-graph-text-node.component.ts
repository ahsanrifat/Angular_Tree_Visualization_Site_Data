import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import ForceGraph3D from '3d-force-graph';
import SpriteText from 'three-spritetext';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-d3-graph-text-node',
  templateUrl: './d3-graph-text-node.component.html',
  styleUrls: ['./d3-graph-text-node.component.css'],
})
export class D3GraphTextNodeComponent implements OnInit {
  @Input() graph_data = new EventEmitter<[]>();
  nodes: any[] = [
    { id: '6055', label: '6055' },
    { id: 'E222', label: 'E222' },
    { id: 'FYHA.UPE.HCX16.01', label: 'FYHA.UPE.HCX16.01' },
    { id: 'JD5LS3', label: 'JD5LS3' },
    { id: 'M294', label: 'M294' },
    { id: 'M2iS2', label: 'M2iS2' },
    { id: 'M2S6', label: 'M2S6' },
    { id: 'M279', label: 'M279' },
    { id: 'FYHA.UPE.HCX16.02', label: 'FYHA.UPE.HCX16.02' },
    { id: 'JD5LS4', label: 'JD5LS4' },
  ];
  links: any[] = [
    { source: '6055', target: 'E222' },
    { source: 'E222', target: 'FYHA.UPE.HCX16.01' },
    { source: 'FYHA.UPE.HCX16.01', target: 'JD5LS3' },
    { source: 'JD5LS3', target: 'M294' },
    { source: 'JD5LS3', target: 'M2iS2' },
    { source: 'JD5LS3', target: 'M2S6' },
    { source: 'JD5LS3', target: 'M279' },
    { source: 'E222', target: 'FYHA.UPE.HCX16.02' },
    { source: 'FYHA.UPE.HCX16.02', target: 'JD5LS4' },
    { source: 'JD5LS4', target: 'M294' },
    { source: 'JD5LS4', target: 'M2iS2' },
    { source: 'JD5LS4', target: 'M2S6' },
    { source: 'JD5LS4', target: 'M279' },
  ];
  all_nodes = {};
  all_links = {};
  child_dict = {};
  node_tracker = {};
  visited_node = {};
  link_tracker = {};
  constructor(public dataService: DataServiceService) {}

  make_links(start_node) {
    if (this.visited_node.hasOwnProperty(start_node) == false) {
      console.log('Registering node');
      if (this.node_tracker.hasOwnProperty(start_node) == false) {
        this.node_tracker[start_node] = true;
        this.nodes.push(this.all_nodes[start_node]);
      }
      this.visited_node[start_node] = true;

      var source_node = this.all_nodes[start_node];
      console.log('Source->', source_node);
      var child_arr = this.child_dict[start_node];
      child_arr = [...new Set(child_arr)];
      console.log('child_arr', child_arr);
      for (let target of child_arr) {
        var target_node = this.all_nodes[target];
        if (!this.node_tracker.hasOwnProperty(target)) {
          this.node_tracker[target] = true;
          this.nodes.push(target_node);
        }
        var link_label = start_node + '->' + target;
        console.log('link label->', link_label);
        var link = this.all_links[link_label];
        console.log('Link each->', link);
        if (this.link_tracker.hasOwnProperty(link_label) == false) {
          this.link_tracker[link_label] = true;
          this.links.push(link);
        }
        if (target_node.type == 'link') {
          this.make_links(target_node.id);
        }
      }
    }
    console.log('Nodes->', this.nodes);
    console.log('Links->', this.links);
  }
  ngOnInit(): void {
    console.log('D3 Test started');
    var myGraph = ForceGraph3D();
    myGraph(document.getElementById('graph'))
      .graphData({ nodes: this.nodes, links: this.links })
      .linkWidth(2)
      .nodeVal(5)
      .nodeAutoColorBy('id')
      .linkDirectionalArrowLength(12)
      .linkDirectionalArrowRelPos(1)
      .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.label);
        sprite.color = node.color;
        sprite.textHeight = 8;
        return sprite;
      });
    myGraph.d3Force('charge').strength(-180);
    this.graph_data.subscribe((data) => {
      console.log('D3 Text->', data);
      if (data.hasOwnProperty('nodes') && data.hasOwnProperty('links')) {
        this.all_nodes = {};
        this.all_links = {};
        this.child_dict = {};
        this.node_tracker = {};
        this.visited_node = {};
        this.link_tracker = {};
        this.nodes = [];
        this.links = [];
        this.all_links = data['links'];
        this.all_nodes = data['nodes'];
        this.child_dict = data['child_dict'];
        this.make_links(this.dataService.current_source);
        console.log(this.nodes, this.links);
        var myGraph = ForceGraph3D();
        myGraph(document.getElementById('graph'))
          .graphData({ nodes: this.nodes, links: this.links })
          .nodeLabel('label')
          .nodeAutoColorBy('type')
          .linkWidth(2)
          .nodeVal(5)
          .linkDirectionalArrowLength(12)
          .linkDirectionalArrowRelPos(1)
          .nodeThreeObject((node) => {
            const sprite = new SpriteText(node.label);
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          })
          .onNodeClick((node: { type; label; id }) => {
            console.log('Node click-', node.type);
            if (node.type != 'link') {
              this.make_links(node.id);
              myGraph.graphData({ nodes: this.nodes, links: this.links });
            }
          });
        myGraph.d3Force('charge').strength(-120);
      }
    });
  }
}
