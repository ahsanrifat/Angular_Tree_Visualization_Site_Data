export interface NodeList {
  NodeList: (Node)[] | null;
}
export interface EdgeList{
  EdgeList: (Edge)[] | null;
}
export interface Node {
  ProblemTypeId: string;
  ProblemTypeName: string;
}
export interface Edge {
  ThanaId: string;
  ThanaName: string;
}
