"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  MinusCircle,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit3,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { MindMapNode } from "@/types/mindmap";

interface MindMapNodeProps {
  node: MindMapNode;
  level: number;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<MindMapNode>) => void;
}

export function MindMapNodeComponent({
  node,
  level,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
}: MindMapNodeProps) {
  const [isEditing, setIsEditing] = useState(false);

  const colors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  const toggleCollapse = () => {
    onUpdateNode(node.id, { collapsed: !node.collapsed });
  };

  return (
    <div
      className="relative group"
      style={{
        marginLeft: `${level * 48}px`,
      }}
    >
      {level > 0 && (
        <div
          className="absolute border-t border-l border-gray-300"
          style={{
            left: "-24px",
            top: "20px",
            width: "24px",
            height: "1px",
          }}
        />
      )}
      <Card className={`p-4 mb-4 w-72 ${node.color || "bg-white"}`}>
        <div className="flex items-center gap-2 mb-2">
          {node.children.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={toggleCollapse}
            >
              {node.collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
          {isEditing ? (
            <Input
              value={node.text}
              onChange={(e) =>
                onUpdateNode(node.id, { text: e.target.value })
              }
              onBlur={() => setIsEditing(false)}
              autoFocus
              className="flex-1"
            />
          ) : (
            <div
              className="flex-1 cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {node.text}
            </div>
          )}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <div className="font-medium">Notes</div>
                  <Textarea
                    value={node.notes || ""}
                    onChange={(e) =>
                      onUpdateNode(node.id, { notes: e.target.value })
                    }
                    placeholder="Add notes..."
                    className="min-h-[100px]"
                  />
                  <div className="font-medium">Color</div>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded ${color}`}
                        onClick={() => onUpdateNode(node.id, { color })}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => onAddNode(node.id)}
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
            {level > 0 && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => onDeleteNode(node.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {node.notes && (
          <div className="text-sm text-gray-500 mt-2">{node.notes}</div>
        )}
      </Card>
      {!node.collapsed && node.children.length > 0 && (
        <div className="ml-8">
          {node.children.map((child) => (
            <MindMapNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
              onUpdateNode={onUpdateNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}