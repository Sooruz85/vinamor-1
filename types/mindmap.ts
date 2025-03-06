export interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
  color?: string;
  collapsed?: boolean;
  notes?: string;
}