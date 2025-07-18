import React, { useState, useMemo, useCallback, memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Play,
  Pause,
  Save,
  Share2,
  Plus,
  Database,
  Filter,
  GitBranch,
  Target,
  Settings,
  Zap,
  Code,
  Table,
  FileText,
  X,
} from "lucide-react";
import { FlowEditorProps, WorkflowNode, WorkflowConnection, NodeType } from "../types";
import { logComponentError, logPerformanceWarning } from "../utils/errorLogger";

// Performance monitoring utilities
const usePerformanceMonitor = (componentName: string) => {
  const markStart = useCallback((operation: string) => {
    performance.mark(`${componentName}-${operation}-start`);
  }, [componentName]);

  const markEnd = useCallback((operation: string) => {
    const startMark = `${componentName}-${operation}-start`;
    const endMark = `${componentName}-${operation}-end`;
    performance.mark(endMark);

    try {
      performance.measure(`${componentName}-${operation}`, startMark, endMark);
      const measures = performance.getEntriesByName(`${componentName}-${operation}`);
      const duration = measures[measures.length - 1]?.duration || 0;

      // Log performance warning if operation takes too long
      if (duration > 100) { // 100ms threshold
        logPerformanceWarning(operation, duration, 100, componentName);
      }

      return duration;
    } catch (error) {
      logComponentError(error as Error, componentName, { operation });
      return 0;
    }
  }, [componentName]);

  return { markStart, markEnd };
};

// Memoized node type configuration
const NODE_TYPES = [
  {
    id: "source" as NodeType,
    label: "Data Source",
    icon: Database,
    color: "bg-blue-500",
  },
  {
    id: "transform" as NodeType,
    label: "Transform",
    icon: Filter,
    color: "bg-purple-500",
  },
  {
    id: "branch" as NodeType,
    label: "Branch",
    icon: GitBranch,
    color: "bg-green-500",
  },
  {
    id: "destination" as NodeType,
    label: "Destination",
    icon: Target,
    color: "bg-orange-500",
  },
  {
    id: "function" as NodeType,
    label: "Function",
    icon: Zap,
    color: "bg-yellow-500",
  },
];

// Memoized workflow nodes data (would typically come from props)
const WORKFLOW_NODES: WorkflowNode[] = [
  {
    id: "node1",
    name: "Customer Database",
    type: "source",
    position: { x: 100, y: 100 },
    status: "active",
    config: {
      table: "customers",
      records: "2.4M",
      connectionString: "postgresql://user:pass@localhost:5432/db",
      query: "SELECT * FROM customers WHERE status = 'active'",
      refreshInterval: "30 minutes",
    },
  },
  {
    id: "node2",
    name: "Data Cleaner",
    type: "transform",
    position: { x: 400, y: 100 },
    status: "active",
    config: {
      rules: 12,
      cleaned: "98.7%",
      operations: [
        "Remove duplicates",
        "Normalize email",
        "Validate phone numbers",
      ],
      customCode: `def clean_data(df):
    df = df.drop_duplicates(subset=['customer_id'])
    df['email'] = df['email'].str.lower().str.strip()
    df['phone_valid'] = df['phone'].str.match(r'^\\+?1?\\d{9,15}$')
    return df`,
    },
  },
  {
    id: "node3",
    name: "Quality Check",
    type: "branch",
    position: { x: 700, y: 100 },
    status: "active",
    config: {
      threshold: "95%",
      passed: "97.2%",
      conditions: [
        { field: "email_valid", operator: "equals", value: "true" },
        { field: "phone_valid", operator: "equals", value: "true" },
        { field: "created_at", operator: "not_null", value: "" },
      ],
    },
  },
  {
    id: "node4",
    name: "Analytics DB",
    type: "destination",
    position: { x: 1000, y: 50 },
    status: "active",
    config: {
      target: "analytics.customers",
      connectionString: "postgresql://analytics:pass@analytics.db:5432/warehouse",
      writeMode: "append",
      batchSize: 1000,
    },
  },
  {
    id: "node5",
    name: "Archive Storage",
    type: "destination",
    position: { x: 1000, y: 150 },
    status: "idle",
    config: {
      target: "archive.customers",
      storageType: "S3",
      bucket: "company-data-archive",
      compressionType: "gzip",
    },
  },
];

const CONNECTIONS: WorkflowConnection[] = [
  { from: "node1", to: "node2" },
  { from: "node2", to: "node3" },
  { from: "node3", to: "node4" },
  { from: "node3", to: "node5" },
];

// Memoized node type info lookup
const NodeTypeInfo = memo<{ type: NodeType }>(({ type }) => {
  const nodeType = useMemo(() =>
    NODE_TYPES.find((nt) => nt.id === type) || NODE_TYPES[0],
    [type]
  );

  return { nodeType };
}).NodeTypeInfo;

// Memoized status color utility
const useStatusColor = (status: string) => {
  return useMemo(() => {
    switch (status) {
      case "active":
        return "border-green-500 bg-green-50";
      case "idle":
        return "border-gray-300 bg-gray-50";
      case "error":
        return "border-red-500 bg-red-50";
      default:
        return "border-gray-300 bg-white";
    }
  }, [status]);
};

// Memoized Node Palette Component
const NodePalette = memo(() => {
  return (
    <Card className="lg:col-span-1 rounded-[12px] py-[0px] mx-[105px] my-[0px] p-[0px]">
      <CardHeader>
        <CardTitle className="text-base">Node Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {NODE_TYPES.map((nodeType) => (
            <div
              key={nodeType.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
              draggable
            >
              <div className={`w-8 h-8 rounded-lg ${nodeType.color} flex items-center justify-center`}>
                <nodeType.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">{nodeType.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized SVG Connection Component
const WorkflowConnections = memo<{
  connections: WorkflowConnection[];
  nodes: WorkflowNode[]
}>(({ connections, nodes }) => {
  const connectionPaths = useMemo(() => {
    return connections.map((conn, index) => {
      const fromNode = nodes.find((n) => n.id === conn.from);
      const toNode = nodes.find((n) => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const fromX = fromNode.position.x + 120;
      const fromY = fromNode.position.y + 30;
      const toX = toNode.position.x;
      const toY = toNode.position.y + 30;

      return {
        key: `${conn.from}-${conn.to}-${index}`,
        fromX,
        fromY,
        toX,
        toY,
      };
    }).filter(Boolean);
  }, [connections, nodes]);

  return (
    <svg className="absolute inset-0 w-full h-full">
      {connectionPaths.map((path) => (
        <line
          key={path!.key}
          x1={path!.fromX}
          y1={path!.fromY}
          x2={path!.toX}
          y2={path!.toY}
          stroke="#3b82f6"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      ))}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="18"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>
    </svg>
  );
});

// Memoized Node Component
const WorkflowNodeComponent = memo<{
  node: WorkflowNode;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
}>(({ node, isSelected, onClick }) => {
  const { markStart, markEnd } = usePerformanceMonitor('WorkflowNode');

  const nodeTypeInfo = useMemo(() =>
    NODE_TYPES.find((nt) => nt.id === node.type) || NODE_TYPES[0],
    [node.type]
  );

  const statusColor = useStatusColor(node.status);

  const handleClick = useCallback(() => {
    markStart('node-click');
    onClick(node.id);
    markEnd('node-click');
  }, [onClick, node.id, markStart, markEnd]);

  const nodeStyle = useMemo(() => ({
    left: node.position.x,
    top: node.position.y,
  }), [node.position.x, node.position.y]);

  const configPreview = useMemo(() =>
    Object.values(node.config)[0],
    [node.config]
  );

  return (
    <div
      className={`absolute w-32 h-16 rounded-lg border-2 p-2 cursor-pointer transition-all hover:shadow-md ${statusColor} ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      style={nodeStyle}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded ${nodeTypeInfo.color} flex items-center justify-center`}>
          <nodeTypeInfo.icon className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{node.name}</p>
          <p className="text-xs text-muted-foreground truncate">{configPreview}</p>
        </div>
      </div>
    </div>
  );
});

// Memoized Flow Canvas Component
const FlowCanvas = memo<{
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}>(({ nodes, connections, selectedNode, onNodeClick }) => {
  const { markStart, markEnd } = usePerformanceMonitor('FlowCanvas');

  const handleNodeClick = useCallback((nodeId: string) => {
    markStart('canvas-node-click');
    onNodeClick(nodeId);
    markEnd('canvas-node-click');
  }, [onNodeClick, markStart, markEnd]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Customer Data Pipeline</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Running</Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted/20 rounded-lg p-4 h-96 overflow-hidden">
          <WorkflowConnections connections={connections} nodes={nodes} />
          {nodes.map((node) => (
            <WorkflowNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onClick={handleNodeClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized Node Properties Panel
const NodePropertiesPanel = memo<{
  selectedNode: string | null;
  nodes: WorkflowNode[];
  onConfigureNode: (nodeId: string) => void;
}>(({ selectedNode, nodes, onConfigureNode }) => {
  const selectedNodeData = useMemo(() =>
    selectedNode ? nodes.find((n) => n.id === selectedNode) : null,
    [selectedNode, nodes]
  );

  const handleConfigure = useCallback(() => {
    if (selectedNode) {
      onConfigureNode(selectedNode);
    }
  }, [selectedNode, onConfigureNode]);

  if (!selectedNodeData) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a node to view properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nodeTypeInfo = NODE_TYPES.find((nt) => nt.id === selectedNodeData.type) || NODE_TYPES[0];

  const configEntries = useMemo(() =>
    Object.entries(selectedNodeData.config).slice(0, 3),
    [selectedNodeData.config]
  );

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${nodeTypeInfo.color} flex items-center justify-center`}>
              <nodeTypeInfo.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium">{selectedNodeData.name}</p>
              <p className="text-sm text-muted-foreground">{nodeTypeInfo.label}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Badge variant={selectedNodeData.status === "active" ? "default" : "secondary"}>
              {selectedNodeData.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Configuration</label>
            <div className="space-y-2">
              {configEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="truncate ml-2">{value?.toString()}</span>
                </div>
              ))}
            </div>
          </div>

          <Button size="sm" className="w-full" onClick={handleConfigure}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// Main optimized FlowEditor component
export const FlowEditor = memo<FlowEditorProps>(({
  workflow,
  onSave,
  onRun,
  readonly = false
}) => {
  const { markStart, markEnd } = usePerformanceMonitor('FlowEditor');

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNode, setModalNode] = useState<WorkflowNode | null>(null);

  // Use provided workflow data or fallback to demo data
  const workflowNodes = useMemo(() =>
    workflow?.nodes || WORKFLOW_NODES,
    [workflow?.nodes]
  );

  const workflowConnections = useMemo(() =>
    workflow?.connections || CONNECTIONS,
    [workflow?.connections]
  );

  const handleNodeClick = useCallback((nodeId: string) => {
    markStart('main-node-click');
    const node = workflowNodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      setModalNode(node);
      setIsModalOpen(true);
    }
    markEnd('main-node-click');
  }, [workflowNodes, markStart, markEnd]);

  const handleSave = useCallback(() => {
    markStart('workflow-save');
    if (onSave && workflow) {
      onSave(workflow);
    }
    markEnd('workflow-save');
  }, [onSave, workflow, markStart, markEnd]);

  const handleRun = useCallback(() => {
    markStart('workflow-run');
    if (onRun && workflow) {
      onRun(workflow.id);
    }
    markEnd('workflow-run');
  }, [onRun, workflow, markStart, markEnd]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalNode(null);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Workflow Editor</h1>
          <p className="text-muted-foreground">
            Create and manage your data processing workflows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleSave} disabled={readonly}>
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2" onClick={handleRun} disabled={readonly}>
            <Play className="w-4 h-4" />
            Run Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <NodePalette />
        <FlowCanvas
          nodes={workflowNodes}
          connections={workflowConnections}
          selectedNode={selectedNode}
          onNodeClick={handleNodeClick}
        />
        <NodePropertiesPanel
          selectedNode={selectedNode}
          nodes={workflowNodes}
          onConfigureNode={handleNodeClick}
        />
      </div>

      {/* Simplified modal for now - can be enhanced later */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {modalNode && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {modalNode.name} Configuration
                </DialogTitle>
                <DialogDescription>
                  Configure the settings for this {modalNode.type} node.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Configuration panel will be implemented in the next phase.</p>
                <Button onClick={handleCloseModal}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

FlowEditor.displayName = 'FlowEditor';

export default FlowEditor;
