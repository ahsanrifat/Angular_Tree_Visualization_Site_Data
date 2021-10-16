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
export interface LinkData {
  source: string;
  interface: string;
  time: string;
  capacity: string;
  utilization_avg: string;
  utilization_max: string;
  target: string;
}
export interface LinkDataResponse {
  _id: string;
  expiredAt: string;
  siteId?: string | null;
  LinkName: string;
  LinkId: string;
  Interface: string;
  SiteInterface: string;
  Region: string;
  City: string;
  MwTime: string;
  Capacity: string;
  MwUtilizationAvg: string;
  MwUtilizationMax: string;
  __v: number;
}
export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
