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
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
