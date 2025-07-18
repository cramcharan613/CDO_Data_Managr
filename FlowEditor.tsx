import React, { useState } from "react";
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

export function FlowEditor() {
  const [selectedNode, setSelectedNode] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNode, setModalNode] = useState<any>(null);

  const nodeTypes = [
    {
      id: "source",
      label: "Data Source",
      icon: Database,
      color: "bg-blue-500",
    },
    {
      id: "transform",
      label: "Transform",
      icon: Filter,
      color: "bg-purple-500",
    },
    {
      id: "branch",
      label: "Branch",
      icon: GitBranch,
      color: "bg-green-500",
    },
    {
      id: "destination",
      label: "Destination",
      icon: Target,
      color: "bg-orange-500",
    },
    {
      id: "function",
      label: "Function",
      icon: Zap,
      color: "bg-yellow-500",
    },
  ];

  const workflowNodes = [
    {
      id: "node1",
      type: "source",
      label: "Customer Database",
      position: { x: 100, y: 100 },
      status: "active",
      config: {
        table: "customers",
        records: "2.4M",
        connectionString:
          "postgresql://user:pass@localhost:5432/db",
        query:
          "SELECT * FROM customers WHERE status = 'active'",
        refreshInterval: "30 minutes",
      },
    },
    {
      id: "node2",
      type: "transform",
      label: "Data Cleaner",
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
    # Remove duplicates
    df = df.drop_duplicates(subset=['customer_id'])
    
    # Normalize email addresses
    df['email'] = df['email'].str.lower().str.strip()
    
    # Validate phone numbers
    df['phone_valid'] = df['phone'].str.match(r'^\+?1?\d{9,15}$')
    
    return df`,
      },
    },
    {
      id: "node3",
      type: "branch",
      label: "Quality Check",
      position: { x: 700, y: 100 },
      status: "active",
      config: {
        threshold: "95%",
        passed: "97.2%",
        conditions: [
          {
            field: "email_valid",
            operator: "equals",
            value: "true",
          },
          {
            field: "phone_valid",
            operator: "equals",
            value: "true",
          },
          {
            field: "created_at",
            operator: "not_null",
            value: "",
          },
        ],
      },
    },
    {
      id: "node4",
      type: "destination",
      label: "Analytics DB",
      position: { x: 1000, y: 50 },
      status: "active",
      config: {
        target: "analytics.customers",
        connectionString:
          "postgresql://analytics:pass@analytics.db:5432/warehouse",
        writeMode: "append",
        batchSize: 1000,
      },
    },
    {
      id: "node5",
      type: "destination",
      label: "Archive Storage",
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

  const connections = [
    { from: "node1", to: "node2" },
    { from: "node2", to: "node3" },
    { from: "node3", to: "node4" },
    { from: "node3", to: "node5" },
  ];

  const getNodeTypeInfo = (type: string) => {
    return (
      nodeTypes.find((nt) => nt.id === type) || nodeTypes[0]
    );
  };

  const getStatusColor = (status: string) => {
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
  };

  const handleNodeClick = (nodeId: string) => {
    const node = workflowNodes.find((n) => n.id === nodeId);
    if (node) {
      setSelectedNode(nodeId);
      setModalNode(node);
      setIsModalOpen(true);
    }
  };

  const renderNodeConfiguration = (node: any) => {
    const nodeTypeInfo = getNodeTypeInfo(node.type);

    switch (node.type) {
      case "source":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="connectionString">
                Connection String
              </Label>
              <Input
                id="connectionString"
                defaultValue={node.config.connectionString}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="query">SQL Query</Label>
              <Textarea
                id="query"
                defaultValue={node.config.query}
                className="font-mono text-sm min-h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="table">Table</Label>
                <Input
                  id="table"
                  defaultValue={node.config.table}
                />
              </div>
              <div>
                <Label htmlFor="refreshInterval">
                  Refresh Interval
                </Label>
                <Select defaultValue="30min">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5min">
                      5 minutes
                    </SelectItem>
                    <SelectItem value="15min">
                      15 minutes
                    </SelectItem>
                    <SelectItem value="30min">
                      30 minutes
                    </SelectItem>
                    <SelectItem value="1hr">1 hour</SelectItem>
                    <SelectItem value="6hr">6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "transform":
        return (
          <div className="space-y-4">
            <div>
              <Label>Transform Operations</Label>
              <div className="space-y-2 mt-2">
                {node.config.operations.map(
                  (op: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">{op}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Operation
              </Button>
            </div>
          </div>
        );

      case "branch":
        return (
          <div className="space-y-4">
            <div>
              <Label>Quality Threshold</Label>
              <Input defaultValue={node.config.threshold} />
            </div>
            <div>
              <Label>Branch Conditions</Label>
              <div className="space-y-2 mt-2">
                {node.config.conditions.map(
                  (condition: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 gap-2 p-2 bg-muted rounded"
                    >
                      <Input
                        defaultValue={condition.field}
                        placeholder="Field"
                      />
                      <Select defaultValue={condition.operator}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">
                            Equals
                          </SelectItem>
                          <SelectItem value="not_equals">
                            Not Equals
                          </SelectItem>
                          <SelectItem value="contains">
                            Contains
                          </SelectItem>
                          <SelectItem value="not_null">
                            Not Null
                          </SelectItem>
                          <SelectItem value="is_null">
                            Is Null
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        defaultValue={condition.value}
                        placeholder="Value"
                      />
                    </div>
                  ),
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </div>
        );

      case "destination":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                defaultValue={node.config.target}
              />
            </div>
            <div>
              <Label htmlFor="destConnectionString">
                Connection String
              </Label>
              <Input
                id="destConnectionString"
                defaultValue={
                  node.config.connectionString ||
                  node.config.bucket
                }
                className="font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="writeMode">Write Mode</Label>
                <Select
                  defaultValue={
                    node.config.writeMode || "append"
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="append">
                      Append
                    </SelectItem>
                    <SelectItem value="overwrite">
                      Overwrite
                    </SelectItem>
                    <SelectItem value="upsert">
                      Upsert
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  defaultValue={
                    node.config.batchSize?.toString() || "1000"
                  }
                  type="number"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Function Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select function type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aggregation">
                    Aggregation
                  </SelectItem>
                  <SelectItem value="calculation">
                    Calculation
                  </SelectItem>
                  <SelectItem value="validation">
                    Validation
                  </SelectItem>
                  <SelectItem value="custom">
                    Custom Function
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
    }
  };

  const renderCustomCode = (node: any) => {
    return (
      <div className="space-y-4">
        <div className="px-[-2px] py-[0px]">
          <Label htmlFor="customCode">Custom Code</Label>
          <Textarea
            id="customCode"
            defaultValue={
              node.config.customCode ||
              "# Add your custom code here\ndef process_data(df):\n    # Your logic here\n    return df"
            }
            className="font-mono text-sm min-h-48 py-[7px] px-[10px] rounded-[41px]"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Code className="w-4 h-4 mr-2" />
            Validate Syntax
          </Button>
          <Button size="sm" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Test Code
          </Button>
        </div>
      </div>
    );
  };

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
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Play className="w-4 h-4" />
            Run Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-[-16px] mr-[-205px] mb-[2px] ml-[-125px]">
        {/* Node Palette */}
        <Card className="lg:col-span-1 rounded-[12px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[12px] rounded-br-[10px] py-[0px] py-[0px] mx-[105px] my-[0px] p-[0px]">
          <CardHeader>
            <CardTitle className="text-base">
              Node Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nodeTypes.map((nodeType) => (
                <div
                  key={nodeType.id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50"
                  draggable
                >
                  <div
                    className={`w-8 h-8 rounded-lg ${nodeType.color} flex items-center justify-center`}
                  >
                    <nodeType.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {nodeType.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flow Canvas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Customer Data Pipeline
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Running</Badge>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted/20 rounded-lg p-4 h-96 overflow-hidden mt-[-23px] mr-[-11px] mb-[0px] ml-[0px] px-[14px] py-[15px] pt-[15px] pr-[14px] pb-[14px] pl-[14px] rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px] rounded-br-[23px]">
              <svg className="absolute inset-0 w-full h-full">
                {/* Draw connections */}
                {connections.map((conn, index) => {
                  const fromNode = workflowNodes.find(
                    (n) => n.id === conn.from,
                  );
                  const toNode = workflowNodes.find(
                    (n) => n.id === conn.to,
                  );
                  if (!fromNode || !toNode) return null;

                  const fromX = fromNode.position.x + 120;
                  const fromY = fromNode.position.y + 30;
                  const toX = toNode.position.x;
                  const toY = toNode.position.y + 30;

                  return (
                    <line
                      key={index}
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}

                {/* Arrow marker */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="18"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#3b82f6"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Draw nodes */}
              {workflowNodes.map((node) => {
                const nodeTypeInfo = getNodeTypeInfo(node.type);
                return (
                  <div
                    key={node.id}
                    className={`absolute w-32 h-16 rounded-lg border-2 p-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(
                      node.status,
                    )} ${selectedNode === node.id ? "ring-2 ring-primary" : ""}`}
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                    }}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded ${nodeTypeInfo.color} flex items-center justify-center`}
                      >
                        <nodeTypeInfo.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {node.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {Object.values(node.config)[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Node Properties */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                {(() => {
                  const node = workflowNodes.find(
                    (n) => n.id === selectedNode,
                  );
                  if (!node) return null;

                  const nodeTypeInfo = getNodeTypeInfo(
                    node.type,
                  );
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg ${nodeTypeInfo.color} flex items-center justify-center`}
                        >
                          <nodeTypeInfo.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {node.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {nodeTypeInfo.label}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Status
                        </label>
                        <Badge
                          variant={
                            node.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {node.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Configuration
                        </label>
                        <div className="space-y-2">
                          {Object.entries(node.config)
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="truncate ml-2">
                                  {value?.toString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() =>
                          handleNodeClick(selectedNode)
                        }
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Select a node to view properties
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Node Configuration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {modalNode && (
            <>
              <DialogHeader className="px-[1px] py-[-11px] mx-[-13px] my-[-2px]">
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${getNodeTypeInfo(modalNode.type).color} flex items-center justify-center`}
                  >
                    {React.createElement(
                      getNodeTypeInfo(modalNode.type).icon,
                      { className: "w-4 h-4 text-white" },
                    )}
                  </div>
                  {modalNode.label} Configuration
                </DialogTitle>
                <DialogDescription>
                  Configure the settings and custom code for
                  this{" "}
                  {getNodeTypeInfo(
                    modalNode.type,
                  ).label.toLowerCase()}{" "}
                  node.
                </DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="configuration"
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="configuration"
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configuration
                  </TabsTrigger>
                  <TabsTrigger value="code" className="gap-2">
                    <Code className="w-4 h-4" />
                    Custom Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="configuration"
                  className="mt-6"
                >
                  {renderNodeConfiguration(modalNode)}
                </TabsContent>

                <TabsContent value="code" className="mt-6">
                  {renderCustomCode(modalNode)}
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-[0px] border-t pr-[0px] pb-[0px] pl-[23px] mt-[62px] mr-[-14px] mb-[15px] ml-[-26px]">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    <Table className="w-4 h-4 mr-2" />
                    Preview Data
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}