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
