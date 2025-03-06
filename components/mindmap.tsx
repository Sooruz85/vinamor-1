"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MindMapNode {
  id: string;
  text: string;
  children: MindMapNode[];
}

interface MindMapProps {
  nodes: MindMapNode[];
  onAddNode: (parentId: string) => void;
  onUpdateNodeText: (nodeId: string, newText: string) => void;
}

export function MindMap({ nodes, onAddNode, onUpdateNodeText }: MindMapProps) {
  const renderNode = (node: MindMapNode, level: number = 0) => {
    return (
      <div
        key={node.id}
        className="relative"
        style={{
          marginLeft: `${level * 40}px`,
        }}
      >
        <Card className="p-4 mb-4 w-64">
          <div className="flex items-center gap-2">
            <Input
              value={node.text}
              onChange={(e) => onUpdateNodeText(node.id, e.target.value)}
              className="flex-1"
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onAddNode(node.id)}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
        {node.children.length > 0 && (
          <div className="ml-8 relative">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8">
      {nodes.map((node) => renderNode(node))}
    </div>
  );
}