import React, { useState, memo } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ContextualModal } from './ContextualModal';
import { getDataIcon, getStatusIcon, StatusColors, RegionColors } from './IconSystem';
import {
  ChevronLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Settings
} from 'lucide-react';
import exampleImage from 'figma:asset/c0021503e1aebb19414ec64e3dc65cba04400a48.png';

interface DataSource {
  id: string;
  name: string;
  country: string;
  region: 'Americas' | 'EMEA' | 'APAC';
  type: 'database' | 'schema' | 'table' | 'view';
  ytdReturn: string;
  p11mEps: string;
  divYield: string;
  mktCap: string;
  volume: string;
  price: string;
  dailyPerformance: string;
  status: 'healthy' | 'warning' | 'error';
  trend: 'up' | 'down' | 'stable';
  chart: number[];
  lastModified: string;
  owner: string;
  size: string;
  rowCount: string;
}

export const DataAnalysis = memo(function DataAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedObject, setSelectedObject] = useState<DataSource | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'manage' | 'analyze'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data organized by regions
  const dataSources: DataSource[] = [
    // Americas
    {
      id: 'dow_jones',
      name: 'customer_analytics_db',
      country: 'USA',
      region: 'Americas',
      type: 'database',
      ytdReturn: '+12.4%',
      p11mEps: '18.7%',
      divYield: '2.00%',
      mktCap: '2.4B',
      volume: '1.7M',
      price: '$333.90',
      dailyPerformance: '+0.20',
      status: 'healthy',
      trend: 'up',
      chart: [65, 68, 70, 72, 75, 73, 78, 76, 79],
      lastModified: '2h ago',
      owner: 'Data Team',
      size: '1.2TB',
      rowCount: '2.4B'
    },
    {
      id: 'sp500',
      name: 'sales_pipeline_schema',
      country: 'USA',
      region: 'Americas',
      type: 'schema',
      ytdReturn: '+11.7%',
      p11mEps: '7.42',
      divYield: '1.44%',
      mktCap: '893B',
      volume: '24.9M',
      price: '$628.72',
      dailyPerformance: '-0.82',
      status: 'healthy',
      trend: 'down',
      chart: [60, 62, 65, 63, 68, 66, 72, 70, 68],
      lastModified: '45m ago',
      owner: 'Sales Team',
      size: '456GB',
      rowCount: '847M'
    },
    {
      id: 'nasdaq',
      name: 'product_catalog_table',
      country: 'USA',
      region: 'Americas',
      type: 'table',
      ytdReturn: '+8.5%',
      p11mEps: 'N/A',
      divYield: '0.84%',
      mktCap: '199B',
      volume: '18.9M',
      price: '$362.97',
      dailyPerformance: '-1.79',
      status: 'warning',
      trend: 'down',
      chart: [55, 58, 60, 58, 65, 63, 70, 67, 64],
      lastModified: '1h ago',
      owner: 'Product Team',
      size: '234GB',
      rowCount: '45M'
    },
    {
      id: 'tsx',
      name: 'user_sessions_view',
      country: 'Canada',
      region: 'Americas',
      type: 'view',
      ytdReturn: '+6.7%',
      p11mEps: '6.05',
      divYield: '2.56%',
      mktCap: '3.07B',
      volume: '771.5k',
      price: '$92.56',
      dailyPerformance: '+0.19',
      status: 'healthy',
      trend: 'up',
      chart: [50, 52, 55, 58, 60, 62, 65, 63, 66],
      lastModified: '30m ago',
      owner: 'Analytics Team',
      size: '89GB',
      rowCount: '1.2B'
    },
    {
      id: 'bmv',
      name: 'inventory_tracking_db',
      country: 'Mexico',
      region: 'Americas',
      type: 'database',
      ytdReturn: '+14.1%',
      p11mEps: '8.19',
      divYield: '2.34%',
      mktCap: '1.22B',
      volume: '1.1M',
      price: '$93.70',
      dailyPerformance: '+1.01',
      status: 'healthy',
      trend: 'up',
      chart: [45, 47, 50, 52, 55, 57, 60, 58, 61],
      lastModified: '15m ago',
      owner: 'Operations Team',
      size: '678GB',
      rowCount: '890M'
    },
    {
      id: 'bovespa',
      name: 'financial_reports_schema',
      country: 'Brazil',
      region: 'Americas',
      type: 'schema',
      ytdReturn: '+11.1%',
      p11mEps: '6.23',
      divYield: '9.46%',
      mktCap: '4.67B',
      volume: '6.6M',
      price: '$20.28',
      dailyPerformance: '-0.06',
      status: 'healthy',
      trend: 'stable',
      chart: [30, 32, 35, 37, 40, 42, 45, 44, 44],
      lastModified: '3h ago',
      owner: 'Finance Team',
      size: '123GB',
      rowCount: '234M'
    },

    // EMEA
    {
      id: 'euro_stoxx',
      name: 'customer_data_warehouse',
      country: 'Europe',
      region: 'EMEA',
      type: 'database',
      ytdReturn: '+9.3%',
      p11mEps: '51.76',
      divYield: '4.07%',
      mktCap: '6.17B',
      volume: '2.4M',
      price: '$41.45',
      dailyPerformance: '-0.63',
      status: 'healthy',
      trend: 'down',
      chart: [42, 44, 46, 48, 50, 48, 54, 52, 49],
      lastModified: '1h ago',
      owner: 'EU Data Team',
      size: '2.1TB',
      rowCount: '5.7B'
    },
    {
      id: 'ftse100',
      name: 'marketing_analytics_table',
      country: 'United Kingdom',
      region: 'EMEA',
      type: 'table',
      ytdReturn: '+5.6%',
      p11mEps: '5.08',
      divYield: '3.47%',
      mktCap: '2.61B',
      volume: '359.4k',
      price: '$31.97',
      dailyPerformance: '-0.21',
      status: 'warning',
      trend: 'down',
      chart: [48, 50, 52, 50, 56, 54, 60, 57, 55],
      lastModified: '2h ago',
      owner: 'Marketing Team',
      size: '345GB',
      rowCount: '678M'
    },
    {
      id: 'smi',
      name: 'compliance_audit_logs',
      country: 'Switzerland',
      region: 'EMEA',
      type: 'table',
      ytdReturn: '+3.8%',
      p11mEps: '6.48',
      divYield: '2.36%',
      mktCap: '1.11B',
      volume: '212.3k',
      price: '$43.60',
      dailyPerformance: '-0.13',
      status: 'healthy',
      trend: 'stable',
      chart: [60, 62, 64, 63, 68, 66, 72, 70, 71],
      lastModified: '4h ago',
      owner: 'Compliance Team',
      size: '567GB',
      rowCount: '2.1B'
    },
    {
      id: 'cac40',
      name: 'supply_chain_view',
      country: 'France',
      region: 'EMEA',
      type: 'view',
      ytdReturn: '+7.7%',
      p11mEps: '12.89',
      divYield: '2.82%',
      mktCap: '845M',
      volume: '154.7k',
      price: '$34.96',
      dailyPerformance: '-0.49',
      status: 'healthy',
      trend: 'down',
      chart: [35, 37, 40, 42, 45, 43, 48, 46, 44],
      lastModified: '6h ago',
      owner: 'Supply Chain Team',
      size: '89GB',
      rowCount: '156M'
    },

    // APAC
    {
      id: 'nikkei225',
      name: 'user_behavior_analytics',
      country: 'Japan',
      region: 'APAC',
      type: 'database',
      ytdReturn: '+8.4%',
      p11mEps: '4.18',
      divYield: '0.93%',
      mktCap: '12.6B',
      volume: '1.6M',
      price: '$59.27',
      dailyPerformance: '-0.11',
      status: 'healthy',
      trend: 'down',
      chart: [55, 57, 60, 62, 65, 63, 68, 66, 65],
      lastModified: '8h ago',
      owner: 'APAC Analytics',
      size: '1.8TB',
      rowCount: '3.4B'
    },
    {
      id: 'hang_seng',
      name: 'transaction_logs_table',
      country: 'Hong Kong',
      region: 'APAC',
      type: 'table',
      ytdReturn: '+12.6%',
      p11mEps: '4.71',
      divYield: '3.42%',
      mktCap: '565M',
      volume: '724.2k',
      price: '$17.19',
      dailyPerformance: '-0.34',
      status: 'healthy',
      trend: 'down',
      chart: [25, 27, 30, 32, 35, 33, 38, 36, 34],
      lastModified: '5h ago',
      owner: 'Transaction Team',
      size: '1.2TB',
      rowCount: '4.8B'
    },
    {
      id: 'asx200',
      name: 'regional_sales_schema',
      country: 'Australia',
      region: 'APAC',
      type: 'schema',
      ytdReturn: '+6.8%',
      p11mEps: '31.54',
      divYield: '3.96%',
      mktCap: '2.05B',
      volume: '507.3k',
      price: '$21.97',
      dailyPerformance: '-0.14',
      status: 'warning',
      trend: 'down',
      chart: [40, 42, 45, 47, 50, 48, 53, 51, 49],
      lastModified: '12h ago',
      owner: 'APAC Sales',
      size: '432GB',
      rowCount: '567M'
    },
  ];

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'USA': '🇺🇸',
      'Canada': '🇨🇦',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Europe': '🇪🇺',
      'United Kingdom': '🇬🇧',
      'Switzerland': '🇨🇭',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Japan': '🇯🇵',
      'Hong Kong': '🇭🇰',
      'Australia': '🇦🇺',
    };
    return flags[country] || '🌍';
  };

  const getTrendIcon = (trend: string, performance: string) => {
    const isPositive = performance.startsWith('+');
    if (trend === 'up' && isPositive) {
      return <TrendingUp className="w-3 h-3 text-green-400" />;
    } else if (trend === 'down' || !isPositive) {
      return <TrendingDown className="w-3 h-3 text-red-400" />;
    }
    return <Minus className="w-3 h-3 text-gray-400" />;
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

  const filteredSources = dataSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || source.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const groupedSources = filteredSources.reduce((acc, source) => {
    if (!acc[source.region]) {
      acc[source.region] = [];
    }
    acc[source.region].push(source);
    return acc;
  }, {} as Record<string, DataSource[]>);

  const handleObjectClick = (object: DataSource, mode: 'view' | 'edit' | 'manage' | 'analyze' = 'view') => {
    setSelectedObject(object);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleModalAction = (action: string, data?: any) => {
    console.log('Modal action:', action, data);
    // Handle different actions here
    switch (action) {
      case 'query':
        // Navigate to query editor
        break;
      case 'export':
        // Trigger export
        break;
      case 'analyze':
        handleObjectClick(selectedObject!, 'analyze');
        break;
      case 'save':
        // Save changes
        setIsModalOpen(false);
        break;
    }
  };

  return (
    <div className="h-full bg-[#0a0b0f] text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0a0b0f] sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-gray-800/50">
              <ChevronLeft className="w-4 h-4" />
              Analysis
            </Button>
            <div className="text-sm text-gray-400">
              Monday, October 9
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search Key"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 w-64"
              />
            </div>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-800/50">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-800/50">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-800/50">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 px-6 pb-4">
          <button className="text-blue-400 border-b border-blue-400 pb-1 text-sm">
            Finder
          </button>
          <button className="text-gray-400 hover:text-white text-sm">
            Markets
          </button>
          <button className="text-gray-400 hover:text-white text-sm">
            Events
          </button>
          <button className="text-gray-400 hover:text-white text-sm">
            Calendar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Region Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant={selectedRegion === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedRegion('all')}
          >
            All Regions
          </Button>
          <Button
            variant={selectedRegion === 'Americas' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedRegion('Americas')}
          >
            Americas
          </Button>
          <Button
            variant={selectedRegion === 'EMEA' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedRegion('EMEA')}
          >
            EMEA
          </Button>
          <Button
            variant={selectedRegion === 'APAC' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedRegion('APAC')}
          >
            Asia / Pacific
          </Button>
        </div>

        {/* Data Tables by Region */}
        {Object.entries(groupedSources).map(([region, sources]) => (
          <div key={region} className="mb-8">
            <h3 className="text-sm font-medium text-gray-400 mb-4">{region}</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-800/50 text-xs text-gray-400 mb-2">
              <div className="col-span-2">Data Object</div>
              <div className="col-span-1 text-center">Growth Rate</div>
              <div className="col-span-1 text-center">Efficiency</div>
              <div className="col-span-1 text-center">Quality Score</div>
              <div className="col-span-1 text-center">Size</div>
              <div className="col-span-1 text-center">Records</div>
              <div className="col-span-1 text-center">Performance</div>
              <div className="col-span-1 text-center">Price</div>
              <div className="col-span-1 text-center">Daily Change</div>
              <div className="col-span-2 text-center">Chart</div>
            </div>

            {/* Table Body */}
            <div className="space-y-1">
              {sources.map((source, index) => (
                <div 
                  key={source.id} 
                  className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-800/20 rounded-lg transition-all duration-200 cursor-pointer text-xs group"
                  onClick={() => handleObjectClick(source)}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="text-lg">{getCountryFlag(source.country)}</span>
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {source.name}
                        <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
                          {source.type}
                        </Badge>
                      </div>
                      <div className="text-gray-400">{source.country}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        source.ytdReturn.startsWith('+') 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {source.ytdReturn}
                    </Badge>
                  </div>
                  
                  <div className="col-span-1 text-center text-gray-300">{source.p11mEps}</div>
                  <div className="col-span-1 text-center text-gray-300">{source.divYield}</div>
                  <div className="col-span-1 text-center text-gray-300">{source.size}</div>
                  <div className="col-span-1 text-center text-gray-300">{source.rowCount}</div>
                  <div className="col-span-1 text-center text-gray-300">{source.volume}</div>
                  <div className="col-span-1 text-center text-white font-medium">{source.price}</div>
                  
                  <div className="col-span-1 text-center flex items-center justify-center gap-1">
                    {getTrendIcon(source.trend, source.dailyPerformance)}
                    <span className={`font-medium ${
                      source.dailyPerformance.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {source.dailyPerformance}
                    </span>
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center gap-2">
                    <MiniChart data={source.chart} />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleObjectClick(source, 'analyze');
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleObjectClick(source, 'edit');
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-6 h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleObjectClick(source, 'manage');
                        }}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contextual Modal */}
      {selectedObject && (
        <ContextualModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          object={{
            id: selectedObject.id,
            name: selectedObject.name,
            type: selectedObject.type,
            status: selectedObject.status,
            size: selectedObject.size,
            rowCount: selectedObject.rowCount,
            lastModified: selectedObject.lastModified,
            region: selectedObject.region,
            owner: selectedObject.owner,
            description: `${selectedObject.type} containing ${selectedObject.rowCount} records`
          }}
          mode={modalMode}
          onAction={handleModalAction}
        />
      )}
    </div>
  );
});

export default DataAnalysis;