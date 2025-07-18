import React, { useState, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getDataIcon, getStatusIcon, StatusColors } from './IconSystem';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Users,
  Download,
  Share,
  MoreHorizontal,
  ChevronRight,
  Folder,
  Database,
  Table,
  Eye,
  FileText,
  Tag,
  Calendar,
  User,
  Activity,
  TrendingUp,
  Zap,
  Shield
} from 'lucide-react';

interface DataAsset {
  id: string;
  name: string;
  type: 'database' | 'schema' | 'table' | 'view' | 'report' | 'dataset';
  description: string;
  owner: string;
  department: string;
  lastModified: string;
  size: string;
  records: string;
  status: 'active' | 'deprecated' | 'archived';
  tags: string[];
  rating: number;
  usage: string;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  quality: number;
  popularity: number;
}

export const DataCatalog = memo(function DataCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const dataAssets: DataAsset[] = [
    {
      id: '1',
      name: 'Customer Analytics Database',
      type: 'database',
      description: 'Comprehensive customer behavior and analytics data warehouse containing purchase history, demographics, and engagement metrics.',
      owner: 'Sarah Chen',
      department: 'Analytics',
      lastModified: '2 hours ago',
      size: '2.4TB',
      records: '50M+',
      status: 'active',
      tags: ['customer', 'analytics', 'production', 'high-value'],
      rating: 4.8,
      usage: 'High',
      classification: 'internal',
      quality: 98,
      popularity: 95
    },
    {
      id: '2',
      name: 'Sales Pipeline Schema',
      type: 'schema',
      description: 'Real-time sales opportunity tracking, lead scoring, and revenue forecasting data structures.',
      owner: 'Mike Rodriguez',
      department: 'Sales',
      lastModified: '1 hour ago',
      size: '456GB',
      records: '12M+',
      status: 'active',
      tags: ['sales', 'pipeline', 'crm', 'revenue'],
      rating: 4.6,
      usage: 'High',
      classification: 'confidential',
      quality: 96,
      popularity: 88
    },
    {
      id: '3',
      name: 'Product Catalog Table',
      type: 'table',
      description: 'Master product information including SKUs, pricing, inventory levels, and category hierarchies.',
      owner: 'Jennifer Park',
      department: 'Product',
      lastModified: '4 hours ago',
      size: '234GB',
      records: '2M+',
      status: 'active',
      tags: ['product', 'catalog', 'inventory', 'pricing'],
      rating: 4.4,
      usage: 'Medium',
      classification: 'internal',
      quality: 94,
      popularity: 78
    },
    {
      id: '4',
      name: 'User Engagement View',
      type: 'view',
      description: 'Aggregated user interaction metrics, session analytics, and behavioral segmentation data.',
      owner: 'David Kim',
      department: 'Product',
      lastModified: '6 hours ago',
      size: '89GB',
      records: '8M+',
      status: 'active',
      tags: ['user', 'engagement', 'analytics', 'sessions'],
      rating: 4.7,
      usage: 'High',
      classification: 'internal',
      quality: 97,
      popularity: 92
    },
    {
      id: '5',
      name: 'Financial Reports Dataset',
      type: 'dataset',
      description: 'Quarterly and annual financial statements, P&L data, and regulatory compliance reports.',
      owner: 'Lisa Thompson',
      department: 'Finance',
      lastModified: '1 day ago',
      size: '123GB',
      records: '500K+',
      status: 'active',
      tags: ['finance', 'reports', 'compliance', 'quarterly'],
      rating: 4.5,
      usage: 'Medium',
      classification: 'restricted',
      quality: 99,
      popularity: 65
    },
    {
      id: '6',
      name: 'Marketing Campaign Table',
      type: 'table',
      description: 'Campaign performance metrics, audience targeting data, and ROI analytics across all marketing channels.',
      owner: 'Tom Wilson',
      department: 'Marketing',
      lastModified: '3 hours ago',
      size: '67GB',
      records: '3M+',
      status: 'active',
      tags: ['marketing', 'campaigns', 'roi', 'performance'],
      rating: 4.3,
      usage: 'Medium',
      classification: 'internal',
      quality: 92,
      popularity: 71
    },
    {
      id: '7',
      name: 'Legacy CRM Database',
      type: 'database',
      description: 'Historical customer relationship management data from previous system migrations.',
      owner: 'Alex Chen',
      department: 'IT',
      lastModified: '2 weeks ago',
      size: '890GB',
      records: '25M+',
      status: 'deprecated',
      tags: ['legacy', 'crm', 'historical', 'migration'],
      rating: 3.2,
      usage: 'Low',
      classification: 'internal',
      quality: 78,
      popularity: 23
    },
    {
      id: '8',
      name: 'Supply Chain Analytics',
      type: 'report',
      description: 'Automated supply chain optimization reports with vendor performance and logistics insights.',
      owner: 'Maria Garcia',
      department: 'Operations',
      lastModified: '5 hours ago',
      size: '45GB',
      records: '1M+',
      status: 'active',
      tags: ['supply-chain', 'logistics', 'vendors', 'optimization'],
      rating: 4.6,
      usage: 'High',
      classification: 'confidential',
      quality: 95,
      popularity: 84
    }
  ];

  const departments = ['all', 'Analytics', 'Sales', 'Product', 'Finance', 'Marketing', 'IT', 'Operations'];
  const assetTypes = ['all', 'database', 'schema', 'table', 'view', 'report', 'dataset'];

  const filteredAssets = dataAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || asset.type === selectedFilter;
    const matchesDepartment = selectedDepartment === 'all' || asset.department === selectedDepartment;
    return matchesSearch && matchesFilter && matchesDepartment;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'modified': return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'rating': return b.rating - a.rating;
      case 'usage': return b.popularity - a.popularity;
      case 'quality': return b.quality - a.quality;
      default: return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="w-5 h-5 text-blue-400" />;
      case 'schema': return <Folder className="w-5 h-5 text-green-400" />;
      case 'table': return <Table className="w-5 h-5 text-purple-400" />;
      case 'view': return <Eye className="w-5 h-5 text-orange-400" />;
      case 'report': return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'dataset': return <Database className="w-5 h-5 text-pink-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'deprecated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'public': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'internal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'confidential': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'restricted': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">{rating}</span>
      </div>
    );
  };

  const AssetCard = ({ asset }: { asset: DataAsset }) => (
    <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(asset.type)}
            <div>
              <CardTitle className="text-white text-sm font-medium">{asset.name}</CardTitle>
              <CardDescription className="text-xs text-gray-400">{asset.department}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getStatusBadge(asset.status)}`}>
              {asset.status}
            </Badge>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-300 mb-4 line-clamp-2">{asset.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <span className="text-gray-400">Size:</span>
            <span className="text-white ml-1">{asset.size}</span>
          </div>
          <div>
            <span className="text-gray-400">Records:</span>
            <span className="text-white ml-1">{asset.records}</span>
          </div>
          <div>
            <span className="text-gray-400">Quality:</span>
            <span className="text-green-400 ml-1">{asset.quality}%</span>
          </div>
          <div>
            <span className="text-gray-400">Usage:</span>
            <span className="text-blue-400 ml-1">{asset.usage}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
              {tag}
            </Badge>
          ))}
          {asset.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/20">
              +{asset.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-gray-400" />
            <span className="text-gray-400">{asset.owner}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(asset.rating)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          <Badge variant="outline" className={`text-xs ${getClassificationBadge(asset.classification)}`}>
            <Shield className="w-3 h-3 mr-1" />
            {asset.classification}
          </Badge>
          <span className="text-xs text-gray-400">{asset.lastModified}</span>
        </div>
      </CardContent>
    </Card>
  );

  const AssetRow = ({ asset }: { asset: DataAsset }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-800/20 rounded-lg transition-colors duration-200 cursor-pointer group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getTypeIcon(asset.type)}
        <div className="min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{asset.name}</h4>
          <p className="text-gray-400 text-xs truncate">{asset.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-xs">
        <div className="text-gray-300">{asset.department}</div>
        <div className="text-gray-300">{asset.size}</div>
        <div className="text-gray-300">{asset.records}</div>
        <div className="text-green-400">{asset.quality}%</div>
        <div className="flex items-center gap-1">
          {renderStars(asset.rating)}
        </div>
        <Badge variant="outline" className={`text-xs ${getStatusBadge(asset.status)}`}>
          {asset.status}
        </Badge>
        <div className="text-gray-400">{asset.lastModified}</div>
        <Button variant="ghost" size="sm" className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-background text-foreground p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">Data Catalog</h1>
        <p className="text-gray-400">Discover, explore, and manage your organization's data assets</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search assets, descriptions, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="modified">Modified</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="usage">Usage</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border border-gray-700 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">
          {sortedAssets.length} assets found
        </span>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Assets Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAssets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-0">
            {/* List Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-700 text-xs text-gray-400">
              <div className="flex-1">Asset</div>
              <div className="w-20">Department</div>
              <div className="w-16">Size</div>
              <div className="w-16">Records</div>
              <div className="w-16">Quality</div>
              <div className="w-20">Rating</div>
              <div className="w-16">Status</div>
              <div className="w-20">Modified</div>
              <div className="w-8"></div>
            </div>
            
            {/* List Items */}
            <div className="divide-y divide-gray-700">
              {sortedAssets.map(asset => (
                <AssetRow key={asset.id} asset={asset} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {sortedAssets.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No assets found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
});

export default DataCatalog;