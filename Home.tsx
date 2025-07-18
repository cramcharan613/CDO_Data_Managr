import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { getDataIcon, getStatusIcon, getChartIcon, StatusColors } from './IconSystem';
import { 
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Database,
  Table,
  Eye,
  Activity,
  Users,
  Clock,
  Zap,
  BarChart3,
  Play,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Search,
  Plus,
  ChevronRight,
  Folder,
  Shield
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  route: string;
  badge?: string;
}

interface DataMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  type: 'query' | 'pipeline' | 'data' | 'analysis';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'running' | 'failed';
  user: string;
}

interface HomeProps {
  onNavigate: (route: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const quickActions: QuickAction[] = [
    {
      id: 'analysis',
      title: 'Data Analysis',
      description: 'Advanced analytics and insights',
      icon: TrendingUp,
      color: 'text-blue-400',
      route: 'analysis',
      badge: 'Pro'
    },
    {
      id: 'query',
      title: 'Query Editor',
      description: 'Write and execute SQL queries',
      icon: Search,
      color: 'text-green-400',
      route: 'code'
    },
    {
      id: 'pipeline',
      title: 'Data Pipelines',
      description: 'Manage ETL workflows',
      icon: Zap,
      color: 'text-purple-400',
      route: 'workflows',
      badge: '5'
    },
    {
      id: 'catalog',
      title: 'Data Catalog',
      description: 'Browse data objects',
      icon: Folder,
      color: 'text-orange-400',
      route: 'files'
    },
    {
      id: 'reports',
      title: 'Visualizations',
      description: 'Create charts and reports',
      icon: BarChart3,
      color: 'text-cyan-400',
      route: 'charts'
    },
    {
      id: 'quality',
      title: 'Data Quality',
      description: 'Monitor data health',
      icon: Shield,
      color: 'text-emerald-400',
      route: 'security'
    }
  ];

  const dataMetrics: DataMetric[] = [
    {
      label: 'Total Records',
      value: '12.4B',
      change: '+8.3%',
      trend: 'up',
      status: 'healthy'
    },
    {
      label: 'Storage Used',
      value: '4.2TB',
      change: '+12.1%',
      trend: 'up',
      status: 'warning'
    },
    {
      label: 'Data Quality',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      status: 'healthy'
    },
    {
      label: 'Query Performance',
      value: '245ms',
      change: '-15.2%',
      trend: 'down',
      status: 'healthy'
    },
    {
      label: 'Active Pipelines',
      value: '23',
      change: '+2',
      trend: 'up',
      status: 'healthy'
    },
    {
      label: 'Failed Jobs',
      value: '2',
      change: '-3',
      trend: 'down',
      status: 'error'
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'analysis',
      title: 'Customer Analytics Report',
      description: 'Generated quarterly customer behavior analysis',
      timestamp: '5 minutes ago',
      status: 'completed',
      user: 'Sarah Chen'
    },
    {
      id: '2',
      type: 'pipeline',
      title: 'Sales Data Pipeline',
      description: 'Processing daily sales data from 3 sources',
      timestamp: '12 minutes ago',
      status: 'running',
      user: 'System'
    },
    {
      id: '3',
      type: 'query',
      title: 'User Engagement Query',
      description: 'Analyzing user engagement metrics for Q4',
      timestamp: '1 hour ago',
      status: 'completed',
      user: 'Mark Rodriguez'
    },
    {
      id: '4',
      type: 'data',
      title: 'Product Catalog Import',
      description: 'Imported 45K new product records',
      timestamp: '2 hours ago',
      status: 'completed',
      user: 'Data Team'
    },
    {
      id: '5',
      type: 'pipeline',
      title: 'ML Feature Pipeline',
      description: 'Feature extraction for recommendation model',
      timestamp: '3 hours ago',
      status: 'failed',
      user: 'ML Team'
    }
  ];

  const handleQuickAction = (route: string) => {
    onNavigate(route);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'pipeline': return <Zap className="w-4 h-4 text-purple-400" />;
      case 'query': return <Search className="w-4 h-4 text-green-400" />;
      case 'data': return <Database className="w-4 h-4 text-orange-400" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'running': return <Play className="w-3 h-3 text-blue-400" />;
      case 'failed': return <AlertTriangle className="w-3 h-3 text-red-400" />;
      default: return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="h-full bg-[#0a0b0f] text-white overflow-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Data Management Platform</h1>
            <p className="text-gray-400">
              Welcome back! Here's what's happening with your data today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleQuickAction('analysis')}
            >
              <TrendingUp className="w-4 h-4" />
              Open Analysis
            </Button>
            <Button 
              className="gap-2"
              onClick={() => handleQuickAction('code')}
            >
              <Plus className="w-4 h-4" />
              New Query
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.id}
              className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
              onClick={() => handleQuickAction(action.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <action.icon className={`w-8 h-8 ${action.color}`} />
                  {action.badge && (
                    <Badge variant="outline" className={`text-xs ${
                      action.badge === 'Pro' 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Click to open</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Data Metrics */}
        <div className="col-span-8">
          <h2 className="text-xl font-semibold text-white mb-4">Data Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {dataMetrics.map((metric, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{metric.label}</span>
                    <Badge className={StatusColors[metric.status]}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">{metric.value}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-xs font-medium ${
                        metric.change.startsWith('+') ? 'text-green-400' : 
                        metric.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Growth Chart */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Data Growth Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Storage usage and query volume trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-lg relative">
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
                  <path
                    d="M20,200 Q100,160 200,140 T400,120 T600,100 T800,90 L800,220 L20,220 Z"
                    fill="url(#areaGradient)"
                  />
                  <path
                    d="M20,200 Q100,160 200,140 T400,120 T600,100 T800,90"
                    fill="none"
                    stroke="url(#dataGrowthGradient)"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                  Growth Rate: +12.3%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="col-span-4">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-700/30 rounded-lg transition-colors duration-200">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {activity.title}
                        </h4>
                        {getStatusIcon(activity.status)}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{activity.user}</span>
                        <span className="text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-gray-400 hover:text-white"
                onClick={() => handleQuickAction('data')}
              >
                View All Activity
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}