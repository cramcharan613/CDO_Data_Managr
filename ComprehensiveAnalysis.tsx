import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  ChevronLeft,
  Database,
  Activity,
  Settings,
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Circle,
  Server,
  Cloud,
  Zap,
  HardDrive,
  Wifi,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  XCircle,
  Table,
  Folder,
  FileText,
  ChevronRight,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react';

interface DataObject {
  id: string;
  name: string;
  type: 'database' | 'schema' | 'table' | 'view';
  rowCount: string;
  size: string;
  growth: string;
  lastModified: string;
  status: 'healthy' | 'warning' | 'error';
  performance: string;
  schema?: string;
  children?: number;
  trend: 'up' | 'down' | 'stable';
  chart: number[];
}

export function ComprehensiveAnalysis() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedTimeframe, setSelectedTimeframe] = useState('YTD');
  const [chartType, setChartType] = useState('spread');
  const [selectedObject, setSelectedObject] = useState<DataObject | null>(null);
  const [showDataFinder, setShowDataFinder] = useState(false);

  const tabs = [
    { id: 'analysis', label: 'Analysis' },
    { id: 'data-sources', label: 'Data Sources' },
    { id: 'pipelines', label: 'Pipelines' },
    { id: 'quality', label: 'Quality' }
  ];

  const timeframes = ['YTD', '1Y', '2Y', '5Y', 'All'];

  // Top performing data objects
  const topDataObjects = [
    {
      name: 'customer_analytics',
      type: 'Table',
      performance: '+12.4M',
      growth: '+15.2%',
      trend: 'up',
      status: 'healthy'
    },
    {
      name: 'sales_pipeline',
      type: 'View',
      performance: '+8.7M',
      growth: '+11.8%',
      trend: 'up',
      status: 'healthy'
    },
    {
      name: 'product_catalog',
      type: 'Table',
      performance: '+5.2M',
      growth: '+8.9%',
      trend: 'up',
      status: 'warning'
    },
    {
      name: 'user_sessions',
      type: 'Table',
      performance: '+3.1M',
      growth: '+6.7%',
      trend: 'up',
      status: 'healthy'
    },
    {
      name: 'inventory_tracking',
      type: 'View',
      performance: '+2.8M',
      growth: '+5.4%',
      trend: 'up',
      status: 'warning'
    }
  ];

  // Data objects performance data
  const dataObjectsPerformance: DataObject[] = [
    {
      id: 'prod_db',
      name: 'production_db',
      type: 'database',
      rowCount: '2.4B',
      size: '1.2TB',
      growth: '+8.3%',
      lastModified: '2h ago',
      status: 'healthy',
      performance: '98.7%',
      children: 45,
      trend: 'up',
      chart: [65, 68, 70, 72, 75, 73, 78]
    },
    {
      id: 'analytics_db',
      name: 'analytics_warehouse',
      type: 'database',
      rowCount: '5.7B',
      size: '3.4TB',
      growth: '+12.1%',
      lastModified: '30m ago',
      status: 'healthy',
      performance: '99.2%',
      children: 28,
      trend: 'up',
      chart: [60, 62, 65, 63, 68, 70, 72]
    },
    {
      id: 'customer_schema',
      name: 'customer_data',
      type: 'schema',
      rowCount: '847M',
      size: '425GB',
      growth: '+5.8%',
      lastModified: '1h ago',
      status: 'warning',
      performance: '94.3%',
      schema: 'production_db',
      children: 12,
      trend: 'up',
      chart: [55, 58, 60, 62, 65, 68, 70]
    },
    {
      id: 'sales_schema',
      name: 'sales_reporting',
      type: 'schema',
      rowCount: '234M',
      size: '156GB',
      growth: '+7.2%',
      lastModified: '45m ago',
      status: 'healthy',
      performance: '97.1%',
      schema: 'analytics_warehouse',
      children: 8,
      trend: 'up',
      chart: [50, 52, 55, 58, 60, 62, 65]
    },
    {
      id: 'user_events',
      name: 'user_events',
      type: 'table',
      rowCount: '1.2B',
      size: '680GB',
      growth: '+15.4%',
      lastModified: '15m ago',
      status: 'healthy',
      performance: '99.8%',
      schema: 'customer_data',
      children: 0,
      trend: 'up',
      chart: [45, 47, 50, 52, 55, 57, 60]
    },
    {
      id: 'transactions',
      name: 'transactions',
      type: 'table',
      rowCount: '890M',
      size: '445GB',
      growth: '+9.7%',
      lastModified: '5m ago',
      status: 'healthy',
      performance: '98.5%',
      schema: 'sales_reporting',
      children: 0,
      trend: 'up',
      chart: [30, 32, 35, 37, 40, 42, 45]
    },
    {
      id: 'product_catalog',
      name: 'product_catalog',
      type: 'table',
      rowCount: '45M',
      size: '23GB',
      growth: '+3.2%',
      lastModified: '2h ago',
      status: 'warning',
      performance: '92.1%',
      schema: 'production_db',
      children: 0,
      trend: 'stable',
      chart: [42, 44, 46, 48, 50, 52, 54]
    },
    {
      id: 'customer_summary',
      name: 'customer_summary_view',
      type: 'view',
      rowCount: '12M',
      size: '8.5GB',
      growth: '+6.8%',
      lastModified: '1h ago',
      status: 'healthy',
      performance: '96.4%',
      schema: 'customer_data',
      children: 0,
      trend: 'up',
      chart: [48, 50, 52, 54, 56, 58, 60]
    },
    {
      id: 'audit_logs',
      name: 'audit_logs',
      type: 'table',
      rowCount: '2.1B',
      size: '890GB',
      growth: '+22.1%',
      lastModified: 'Real-time',
      status: 'healthy',
      performance: '99.9%',
      schema: 'system_logs',
      children: 0,
      trend: 'up',
      chart: [60, 62, 64, 66, 68, 70, 72]
    }
  ];

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="w-4 h-4 text-blue-400" />;
      case 'schema': return <Folder className="w-4 h-4 text-green-400" />;
      case 'table': return <Table className="w-4 h-4 text-purple-400" />;
      case 'view': return <Eye className="w-4 h-4 text-orange-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string, growth: string) => {
    const isPositive = growth.startsWith('+');
    if (trend === 'up' && isPositive) {
      return <TrendingUp className="w-3 h-3 text-green-400" />;
    } else if (trend === 'down' || !isPositive) {
      return <TrendingDown className="w-3 h-3 text-red-400" />;
    }
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const handleObjectClick = (object: DataObject) => {
    setSelectedObject(object);
    setShowDataFinder(true);
  };

  const MiniChart = ({ data }: { data: number[] }) => {
    const width = 60;
    const height = 20;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - Math.min(...data)) / (Math.max(...data) - Math.min(...data))) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  if (showDataFinder && selectedObject) {
    return (
      <DataFinder 
        selectedObject={selectedObject} 
        onBack={() => setShowDataFinder(false)} 
      />
    );
  }

  return (
    <div className="h-full bg-[#0a0b0f] text-white overflow-auto">
      {/* Top Navigation */}
      <div className="border-b border-gray-800 bg-[#0a0b0f] sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-gray-800/50 transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
              Analysis
            </Button>
          </div>
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Database className="w-4 h-4" />
              <span>Data objects</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Performance</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Top Data Objects */}
          <div className="col-span-4">
            <Card className="bg-[#111217]/80 border-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-white mb-4">Top Growing Objects</h3>
                <div className="space-y-3">
                  {topDataObjects.map((object, index) => (
                    <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-800/20 rounded-lg px-2 -mx-2 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                          <span className="text-white text-xs font-medium">{object.name}</span>
                          <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                            {object.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{object.growth}</span>
                        <span className="text-xs text-green-400 font-mono">{object.performance}</span>
                        <Badge variant="outline" className={`text-xs ${getStatusBadge(object.status)}`}>
                          {object.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Data Growth Chart */}
          <div className="col-span-8">
            <Card className="bg-[#111217]/80 border-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-medium text-white">Data Growth & Performance</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-xs">Storage Growth</Badge>
                      <Badge variant="outline" className="text-xs">Query Performance</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Circle className="w-2 h-2 text-blue-400 fill-current" />
                      <span>Current: 2.4TB</span>
                      <ArrowUpRight className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Growth: +12.3%</span>
                    </div>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="h-64 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-lg relative mb-4">
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="dataGrowthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M20,200 Q100,160 200,140 T400,120 T600,100 T800,90 L800,220 L20,220 Z"
                      fill="url(#areaGradient)"
                    />
                    {/* Main line */}
                    <path
                      d="M20,200 Q100,160 200,140 T400,120 T600,100 T800,90"
                      fill="none"
                      stroke="url(#dataGrowthGradient)"
                      strokeWidth="2"
                    />
                    {/* Data points */}
                    {[
                      [20, 200], [100, 160], [200, 140], [300, 130], [400, 120], 
                      [500, 110], [600, 100], [700, 95], [800, 90]
                    ].map(([x, y], i) => (
                      <circle 
                        key={i} 
                        cx={x} 
                        cy={y} 
                        r="3" 
                        fill="#10b981"
                        className="hover:r-4 transition-all duration-200 cursor-pointer"
                      />
                    ))}
                  </svg>
                  
                  {/* Time labels */}
                  <div className="absolute bottom-2 left-4 text-xs text-gray-400">Jan</div>
                  <div className="absolute bottom-2 left-1/4 text-xs text-gray-400">Apr</div>
                  <div className="absolute bottom-2 right-1/4 text-xs text-gray-400">Jul</div>
                  <div className="absolute bottom-2 right-4 text-xs text-gray-400">Oct</div>
                  
                  {/* Current value indicator */}
                  <div className="absolute top-4 right-4 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                    Growth Rate: +12.3%
                  </div>
                </div>

                {/* Timeframe buttons */}
                <div className="flex items-center gap-2">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                        selectedTimeframe === timeframe
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Data Objects Performance Table */}
        <div className="mt-6">
          <Card className="bg-[#111217]/80 border-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-white">Data Objects</h3>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">Databases</Badge>
                  <Badge variant="outline" className="text-xs">Schemas</Badge>
                  <Badge variant="outline" className="text-xs">Tables & Views</Badge>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-800/50 text-xs text-gray-400 mb-2">
                <div className="col-span-2">Object</div>
                <div className="col-span-1 text-center">Row Count</div>
                <div className="col-span-1 text-center">Size</div>
                <div className="col-span-1 text-center">Growth</div>
                <div className="col-span-1 text-center">Modified</div>
                <div className="col-span-1 text-center">Children</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Performance</div>
                <div className="col-span-1 text-center">Trend</div>
                <div className="col-span-2 text-center">Growth Chart</div>
              </div>

              {/* Table Body */}
              <div className="space-y-1">
                {dataObjectsPerformance.map((object, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-800/20 rounded-lg transition-all duration-200 cursor-pointer text-xs group"
                    onClick={() => handleObjectClick(object)}
                  >
                    <div className="col-span-2 flex items-center gap-2">
                      {getObjectIcon(object.type)}
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {object.name}
                          {object.children !== undefined && object.children > 0 && (
                            <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors duration-200" />
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {object.schema ? `${object.schema} → ` : ''}{object.type}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 text-center text-gray-300 font-mono">{object.rowCount}</div>
                    <div className="col-span-1 text-center text-gray-300 font-mono">{object.size}</div>
                    <div className="col-span-1 text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          object.growth.startsWith('+') 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {object.growth}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-center text-gray-300">{object.lastModified}</div>
                    <div className="col-span-1 text-center text-gray-300">
                      {object.children !== undefined ? object.children : '-'}
                    </div>
                    <div className="col-span-1 text-center">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusBadge(object.status)}`}
                      >
                        {object.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-center text-white font-medium">{object.performance}</div>
                    <div className="col-span-1 text-center flex items-center justify-center gap-1">
                      {getTrendIcon(object.trend, object.growth)}
                      <span className={`font-medium ${
                        object.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {object.growth}
                      </span>
                    </div>
                    <div className="col-span-2 flex justify-center items-center">
                      <MiniChart data={object.chart} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// New DataFinder component for detailed object management
function DataFinder({ selectedObject, onBack }: { selectedObject: DataObject; onBack: () => void }) {
  const [currentPath, setCurrentPath] = useState([selectedObject.name]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock nested objects based on the selected object type
  const getNestedObjects = (objectType: string) => {
    if (objectType === 'database') {
      return [
        { name: 'customer_data', type: 'schema', size: '425GB', modified: '2h ago', children: 12 },
        { name: 'sales_reporting', type: 'schema', size: '156GB', modified: '45m ago', children: 8 },
        { name: 'product_catalog', type: 'schema', size: '89GB', modified: '1h ago', children: 5 },
        { name: 'system_logs', type: 'schema', size: '234GB', modified: '30m ago', children: 3 }
      ];
    } else if (objectType === 'schema') {
      return [
        { name: 'users', type: 'table', size: '45GB', modified: '30m ago', children: 0 },
        { name: 'user_events', type: 'table', size: '680GB', modified: '15m ago', children: 0 },
        { name: 'user_preferences', type: 'table', size: '12GB', modified: '1h ago', children: 0 },
        { name: 'customer_summary', type: 'view', size: '8.5GB', modified: '1h ago', children: 0 },
        { name: 'active_users_view', type: 'view', size: '2.1GB', modified: '45m ago', children: 0 }
      ];
    }
    return [];
  };

  const nestedObjects = getNestedObjects(selectedObject.type);

  return (
    <div className="h-full bg-[#0a0b0f] text-white overflow-auto">
      {/* Header with breadcrumb */}
      <div className="border-b border-gray-800 bg-[#0a0b0f] sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-white hover:bg-gray-800/50 transition-all duration-200"
              onClick={onBack}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Analysis
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Data Objects</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{selectedObject.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
          </div>
        </div>
      </div>

      {/* Object details and nested objects */}
      <div className="p-6">
        {/* Selected object info */}
        <Card className="bg-[#111217]/80 border-gray-800/50 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {getObjectIcon(selectedObject.type)}
                <div>
                  <h2 className="text-xl font-medium text-white">{selectedObject.name}</h2>
                  <p className="text-gray-400 text-sm">
                    {selectedObject.type} • {selectedObject.size} • {selectedObject.rowCount} rows
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${getStatusBadge(selectedObject.status)}`}>
                  {selectedObject.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-xs">Performance</p>
                <p className="text-white font-medium">{selectedObject.performance}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Growth Rate</p>
                <p className="text-green-400 font-medium">{selectedObject.growth}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Last Modified</p>
                <p className="text-white font-medium">{selectedObject.lastModified}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Child Objects</p>
                <p className="text-white font-medium">{selectedObject.children || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nested objects */}
        {nestedObjects.length > 0 && (
          <Card className="bg-[#111217]/80 border-gray-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-white mb-4">
                Child Objects ({nestedObjects.length})
              </h3>
              
              <div className="space-y-2">
                {nestedObjects.map((object, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-800/20 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {getObjectIcon(object.type)}
                      <div>
                        <p className="text-white font-medium">{object.name}</p>
                        <p className="text-gray-400 text-xs">{object.type} • {object.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-xs">{object.modified}</span>
                      {object.children > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {object.children} objects
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function getObjectIcon(type: string) {
  switch (type) {
    case 'database': return <Database className="w-4 h-4 text-blue-400" />;
    case 'schema': return <Folder className="w-4 h-4 text-green-400" />;
    case 'table': return <Table className="w-4 h-4 text-purple-400" />;
    case 'view': return <Eye className="w-4 h-4 text-orange-400" />;
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'healthy': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}