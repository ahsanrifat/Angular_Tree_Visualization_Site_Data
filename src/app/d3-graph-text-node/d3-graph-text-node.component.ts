import ForceGraph3D from '3d-force-graph';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import { LinkDataResponse } from '../data-models/data-models';
import { DataServiceService } from '../data-service.service';
@Component({
  selector: 'app-d3-graph-text-node',
  templateUrl: './d3-graph-text-node.component.html',
  styleUrls: ['./d3-graph-text-node.component.css'],
})
export class D3GraphTextNodeComponent implements OnInit {
  @Input() graph_data = new EventEmitter<[]>();
  link_data_changed = new EventEmitter<boolean>();
  nodes: any[] = [];
  links: any[] = [];
  all_nodes = {};
  all_links = {};
  main_topology_api_all_data = null;
  child_dict = {};
  node_tracker = {};
  visited_node = {};
  link_tracker = {};
  pm_data = {};
  source_target_dict = {};
  node_to_node_child = {};
  alarm_nodes_arr = [];
  alarm_links_arr = [];
  is_api_loading = false;
  invalid_graph = false;
  loading_pm_data = false;
  image_map = {
    upe: 'upe.png',
    upe_alarm: 'upe.png',
    er: 'tower.png',
    fon: 'fon.png',
    fon_alarm: 'fon.png',
    er_alarm: 'tower_red.png',
    default: 'default.jpg',
  };
  constructor(public dataService: DataServiceService) {}

  ngOnInit(): void {
    try {
      // console.log('D3 Test started');
      this.dataService.api_loading.subscribe((data) => {
        if (data == false) {
          this.is_api_loading = false;
        } else {
          this.is_api_loading = true;
        }
        console.log('api_loading_status->', this.is_api_loading);
      });
      // when user presses search button
      this.dataService.search_btn_clicked.subscribe(() => {
        this.reset_data();
        this.reset_graph();
      });
      // when the graph type is changed
      this.dataService.graph_type_change.subscribe((graph_type) => {
        console.log('Graph type change-->', graph_type);
        if (this.main_topology_api_all_data) {
          this.initiate_graph(graph_type);
        }
      });
      // when we get graph data
      this.graph_data.subscribe((data) => {
        this.main_topology_api_all_data = data;
        this.initiate_graph(this.dataService.graph_type);
      });
    } catch (err) {
      console.log('Exception->(ngOnInit)', err);
    }
  }
  get_node_png(node_name, alarm) {
    const node = node_name.toLowerCase();
    let node_icon = 'default';
    if (node.includes('upe')) node_icon = 'upe';
    else if (node.includes('er')) node_icon = 'er';
    else if (node.includes('fon')) node_icon = 'fon';
    if (alarm) {
      node_icon = this.image_map[node_icon] + '_' + 'alarm';
    }
    if (!this.image_map.hasOwnProperty(node_icon)) {
      return this.image_map[node_icon];
    } else return 'default.jpg';
  }
  initiate_graph(type) {
    console.log('Initiating Graph');
    this.reset_graph();
    if (type == 'step') {
      this.make_setp_wise_graph(this.main_topology_api_all_data);
    }
    if (type == 'no_step') {
      this.make_full_graph('full_graph');
    }
    if (type == 'alarm') {
      this.make_full_graph('alarm');
    }
  }
  make_setp_wise_graph(topology_data) {
    try {
      if (
        topology_data.hasOwnProperty('nodes_dict') &&
        topology_data.hasOwnProperty('links_dict')
      ) {
        const backup_all_data = this.main_topology_api_all_data;
        this.reset_data();
        this.main_topology_api_all_data = backup_all_data;
        const data = JSON.parse(JSON.stringify(topology_data));
        this.pm_data = data['pm_data'];
        this.all_links = data['links_dict'];
        this.all_nodes = data['nodes_dict'];
        this.child_dict = data['child_dict'];
        this.node_to_node_child = data['node_to_node_child'];
        this.source_target_dict = data['source_target_dict'];
        this.make_links(data['source_node']);
        var myGraph = ForceGraph3D();
        myGraph(document.getElementById('graph'))
          .graphData({ nodes: this.nodes, links: this.links })
          .backgroundColor('#FFFFFF')
          .nodeLabel('label')
          .nodeColor('color')
          .linkWidth(1)
          .linkOpacity(0.8)
          .linkColor('edge_color')
          .linkLabel('edge_label')
          .nodeThreeObject((node) => {
            let image_name = this.get_node_png(node.id, node.alarm);
            console.log('Image Name', node.id, node.alarm, image_name);
            const imgTexture = new THREE.TextureLoader().load(
              `assets/${image_name}`
            );
            const material = new THREE.SpriteMaterial({ map: imgTexture });
            let sprite = new THREE.Sprite(material);
            sprite.scale.set(15, 15);
            // return sprite;
            // sprite = new SpriteText(node.label.replace('GigabitEthernet', ''));
            // sprite.color = node.color;
            // sprite.textHeight = 8;
            return sprite;
          })
          .onNodeClick((node: { type; label; id; is_expanded }) => {
            console.log('Node click-', node.id, node.is_expanded);
            // console.log('Is Expanded on click', node.is_expanded);
            if (
              node.type != 'link' &&
              node.is_expanded == false &&
              this.child_dict.hasOwnProperty(node.id) == true
            ) {
              node.is_expanded = true;
              this.make_links(node.id);
              myGraph.graphData({ nodes: this.nodes, links: this.links });
            } else if (
              node.type != 'link' &&
              (node.is_expanded == true ||
                this.child_dict.hasOwnProperty(node.id) != true)
            ) {
              this.load_link_data(node.id);
              this.dataService.panelOpenState = true;
            }
          });
        myGraph.d3Force('charge').strength(-120);
        this.link_data_changed.subscribe((data) => {
          if (this.dataService.graph_type == 'step') {
            myGraph.graphData({ nodes: this.nodes, links: this.links });
          }
        });
      } else {
        this.invalid_graph = true;
      }
    } catch (err) {
      console.log('Exception->(make_setp_wise_graph)', err);
    }
  }
  make_full_graph(type) {
    try {
      // this.set_topoly_data();
      let graph_data_full = { nodes: [], links: [] };
      if (type == 'alarm') {
        graph_data_full = {
          nodes: this.main_topology_api_all_data['alarm_nodes_arr'],
          links: this.main_topology_api_all_data['alarm_links_arr'],
        };
      } else {
        graph_data_full = {
          nodes: this.main_topology_api_all_data['nodes_arr'],
          links: this.main_topology_api_all_data['links_arr'],
        };
      }
      var myGraph = ForceGraph3D();
      myGraph(document.getElementById('graph'))
        .backgroundColor('#FFFFFF')
        .graphData(graph_data_full)
        .nodeLabel('label')
        .nodeColor('color')
        .linkWidth(1)
        .linkOpacity(0.8)
        // .linkDirectionalArrowLength(12)
        // .linkDirectionalArrowRelPos(1)
        .linkLabel('edge_label')
        .linkColor('edge_color')
        .nodeThreeObject((node) => {
          let image_name = this.get_node_png(node.id, node.alarm);
          console.log('Image Name', node.id, node.alarm, image_name);
          const imgTexture = new THREE.TextureLoader().load(
            `assets/${image_name}`
          );
          const material = new THREE.SpriteMaterial({ map: imgTexture });
          let sprite = new THREE.Sprite(material);
          sprite.scale.set(15, 15);
          // const sprite = new SpriteText(
          //   node.label.replace('GigabitEthernet', '')
          // );
          // sprite.color = node.color;
          // sprite.textHeight = 8;
          // sprite.fontWeight = 'bold';
          return sprite;
        })
        .onNodeClick((node: { type; label; id }) => {
          console.log('Node click-', node.type);
          if (node.type != 'link') {
            this.load_link_data(node.id);
            this.dataService.panelOpenState = true;
          }
        })
        .onLinkClick((node: { type; label }) => {
          console.log('Node click-', node.type);
        });
      myGraph.d3Force('charge').strength(-180);
      // await this.get_pm_data_for_all_links_full_graph();
      this.link_data_changed.subscribe((data) => {
        if (this.dataService.graph_type == 'no_step') {
          myGraph.graphData({ nodes: this.nodes, links: this.links });
        }
      });
    } catch (err) {
      this.invalid_graph = true;
      console.log('Exception->(make_full_graph)', err);
      this.loading_pm_data = false;
    }
  }
  search_pm_data(pm_data_param) {
    let resolve_data = {
      bandwidth: '',
      inbound: '',
      outbound: '',
      utilization: '',
      interface_availability: 0,
    };
    try {
      console.log('Calling pm data function');
      if (this.pm_data.hasOwnProperty(pm_data_param)) {
        resolve_data = this.pm_data[pm_data_param];
        console.log('PM data found in pm_data->', resolve_data);
        return resolve_data;
      } else {
        return resolve_data;
      }
    } catch (err) {
      console.log('Exception->(search_pm_data)', err);
      return resolve_data;
    }
  }
  get_link_data(node_id, search_str, link, child) {
    return new Promise((resolve, reject) => {
      try {
        const pm_data_param = search_str.replace(' - ', '/');
        // console.log('Utilization Data Search Param->', search_str);
        // console.log('PM Data Data Search Param->', pm_data_param);
        this.dataService.get_link_data(search_str).subscribe(async (data) => {
          const pm_array = this.search_pm_data(pm_data_param);
          // console.log('PM_Data->', pm_data_param, '-->', pm_array);
          // const pm_data = this.set_pm_data(node_id, pm_data_param, pm_array);
          // console.log('Utilization_Data->', data);
          resolve({ data: data, link: link, child: child, pm_data: pm_array });
        });
      } catch (err) {
        console.log('Exception->(get_link_data)', err);
        reject(err);
      }
    });
  }
  async load_link_data(node_id) {
    try {
      this.dataService.loading_utilization = true;
      if (this.dataService.panel_data.hasOwnProperty(node_id)) {
        // setting Utilization data
        this.dataService.panel_current_view_data =
          this.dataService.panel_data[node_id];
      } else {
        this.dataService.panel_data[node_id] = [];
        if (this.node_to_node_child.hasOwnProperty(node_id)) {
          var child_arr = this.node_to_node_child[node_id];
          child_arr = [...new Set(child_arr)];
          // console.log('child_arr->', child_arr);
          for (var child of child_arr) {
            var link = null;
            // console.log('Child->', child);
            var label = node_id + '=>' + child;
            link = this.source_target_dict[label];
            // console.log('Link->', link);
            var search_str = node_id + ' - ' + link['linkA'];
            var data1 = await this.get_link_data(
              node_id,
              search_str,
              link,
              child
            );
            // console.log('get_link_data->', data1);
            let data = data1['data'];
            let li = data1['link'];
            let ch = data1['child'];
            let pm_data = data1['pm_data'];
            if (data.length == 0) {
              var store = {
                source: node_id,
                interface: li['linkA'],
                time: 'N/A',
                capacity: 'N/A',
                utilization_avg: 'N/A',
                utilization_max: 'N/A',
                target: ch + `(${li['linkB']})`,
                bandwidth: pm_data?.bandwidth ? pm_data['bandwidth'] : 'N/A',
                resource_name: pm_data?.resource_name
                  ? pm_data['resource_name']
                  : 'N/A',
                inbound: pm_data?.inbound ? pm_data['inbound'] : 'N/A',
                outbound: pm_data?.outbound ? pm_data['outbound'] : 'N/A',
                utilization: pm_data?.utilization
                  ? pm_data['utilization']
                  : 'N/A',
              };
              this.dataService.panel_data[node_id].push(store);
            }
            if (data.length > 0) {
              var info: LinkDataResponse = data[0];
              console.log('got promise data Utilization Data', info);
              this.dataService.panel_data[node_id].push({
                source: node_id,
                interface: li['linkA'],
                time: info.MwTime,
                capacity: info.Capacity,
                utilization_avg: info.MwUtilizationAvg,
                utilization_max: info.MwUtilizationMax,
                target: ch + `(${li['linkB']})`,
                bandwidth: pm_data?.bandwidth ? pm_data['bandwidth'] : 'N/A',
                resource_name: pm_data?.resource_name
                  ? pm_data['resource_name']
                  : 'N/A',
                inbound: pm_data?.inbound ? pm_data['inbound'] : 'N/A',
                outbound: pm_data?.outbound ? pm_data['outbound'] : 'N/A',
                utilization: pm_data?.utilization
                  ? pm_data['utilization']
                  : 'N/A',
              });
            }
            // setting utilization data
            this.dataService.panel_current_view_data =
              this.dataService.panel_data[node_id];
          }
        }
      }
      this.dataService.loading_utilization = false;
      // this.link_data_changed.emit(true);
    } catch (err) {
      console.log('Exception->(load_link_data)', err);
    }
  }
  set_topoly_data() {
    try {
      this.pm_data = this.main_topology_api_all_data['pm_data'];
      this.nodes = this.main_topology_api_all_data['nodes_arr'];
      this.links = this.main_topology_api_all_data['links_arr'];
      this.all_links = this.main_topology_api_all_data['links_dict'];
      this.all_nodes = this.main_topology_api_all_data['nodes_dict'];
      this.child_dict = this.main_topology_api_all_data['child_dict'];
      this.source_target_dict =
        this.main_topology_api_all_data['source_target_dict'];
      this.node_to_node_child =
        this.main_topology_api_all_data['node_to_node_child'];
      this.alarm_nodes_arr = this.main_topology_api_all_data['alarm_nodes_arr'];
      this.alarm_links_arr = this.main_topology_api_all_data['alarm_links_arr'];
    } catch (err) {
      console.log('Exception->(set_topoly_data)', err);
    }
  }
  reset_data() {
    try {
      this.all_nodes = {};
      this.all_links = {};
      this.child_dict = {};
      this.node_tracker = {};
      this.visited_node = {};
      this.link_tracker = {};
      this.nodes = [];
      this.links = [];
      this.source_target_dict = {};
      this.node_to_node_child = {};
      this.dataService.panel_data = {};
      this.dataService.panel_current_view_data = [];
      this.is_api_loading = false;
      this.invalid_graph = false;
      this.pm_data = {};
      this.alarm_nodes_arr = [];
      this.alarm_links_arr = [];
      this.main_topology_api_all_data = null;
    } catch (err) {
      console.log('Exception->(reset_data)', err);
    }
  }
  reset_graph() {
    var myGraph = ForceGraph3D();
    myGraph(document.getElementById('graph'))
      .graphData({
        nodes: [],
        links: [],
      })
      .backgroundColor('#FFFFFF');
  }
  make_links(start_node) {
    try {
      if (this.visited_node.hasOwnProperty(start_node) == false) {
        console.log('Registering node');
        if (this.node_tracker.hasOwnProperty(start_node) == false) {
          this.node_tracker[start_node] = true;
          var current_node = this.all_nodes[start_node];
          current_node.is_expanded = true;
          this.nodes.push(current_node);
        }
        this.visited_node[start_node] = true;

        var source_node = this.all_nodes[start_node];
        // console.log('Source->', source_node);
        var child_arr = this.child_dict[start_node];
        child_arr = [...new Set(child_arr)];
        // console.log('child_arr', child_arr);
        for (let target of child_arr) {
          var target_node = this.all_nodes[target];
          // console.log('Target->', target_node);
          if (!this.node_tracker.hasOwnProperty(target)) {
            this.node_tracker[target] = true;
            this.nodes.push(target_node);
          }
          var link_label = start_node + '->' + target;
          // console.log('link label->', link_label);
          var link = this.all_links[link_label];
          // console.log('Link each->', link);
          if (this.link_tracker.hasOwnProperty(link_label) == false) {
            this.link_tracker[link_label] = true;
            this.links.push(link);
          }
          if (target_node.type == 'link') {
            this.make_links(target_node.id);
          }
        }
      }
    } catch (err) {
      console.log('Exception->(make_links)', err);
    }
  }
}
