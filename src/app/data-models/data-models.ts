export interface TreeData {
  nodes: any[];
  links: any[];
}
export interface NodesEntity {
  id: string;
  label: string;
}
export interface EdgesEntity {
  source: string;
  target: string;
  label: string;
  width: number;
}
export interface NodeDataView {
  name: string;
  interface: string;
  bandwidth: number;
}
export interface PeriodicElement {
  source: string;
  interface: string;
  time: string;
  capacity: string;
  utilization_avg: string;
  utilization_max: string;
  target: string;
}
