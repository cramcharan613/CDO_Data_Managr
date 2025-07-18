import React, { useState, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getStatusIcon, StatusColors } from './IconSystem';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Table,
  Eye,
  RefreshCw,
  Settings,
  Bell,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Zap,
  Shield,
  Target,
  Filter,
  Download
} from 'lucide-react';

interface QualityMetric {
  id: string;
  name: string;
  category: 'completeness' | 'accuracy' | 'consistency' | 'validity' | 'uniqueness' | 'timeliness';
  score: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'healthy' | 'warning' | 'critical';
  lastChecked: string;
  description: string;
}

interface DataIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  table: string;
  schema: string;
  description: string;
  affectedRows: number;
  detectedAt: string;
  status: 'open' | 'investigating' | 'resolved';
  assignee?: string;
}

interface QualityRule {
  id: string;
  name: string;
  type: 'validation' | 'constraint' | 'format' | 'range' | 'relationship';
  table: string;
  column: string;
  condition: string;
  status: 'active' | 'inactive' | 'failed';
  lastRun: string;
  passRate: number;
}

export const DataQuality = memo(function DataQuality() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const qualityMetrics: QualityMetric[] = [
    {
      id: '1',
      name: 'Data Completeness',
      category: 'completeness',
      score: 94.2,
      trend: 'up',
      change: '+2.1%',
      status: 'healthy',
      lastChecked: '5 minutes ago',
      description: 'Percentage of non-null values across all required fields'
    },
    {
      id: '2',
      name: 'Data Accuracy',
      category: 'accuracy',
      score: 87.8,
      trend: 'down',
      change: '-1.3%',
      status: 'warning',
      lastChecked: '5 minutes ago',
      description: 'Accuracy of data against defined business rules and constraints'
    },
    {
      id: '3',
      name: 'Data Consistency',
      category: 'consistency',
      score: 91.5,
      trend: 'stable',
      change: '0.0%',
      status: 'healthy',
      lastChecked: '5 minutes ago',
      description: 'Consistency of data formats and values across systems'
    },
    {
      id: '4',
      name: 'Data Validity',
      category: 'validity',
      score: 96.3,
      trend: 'up',
      change: '+0.8%',
      status: 'healthy',
      lastChecked: '5 minutes ago',
      description: 'Compliance with defined data types and format rules'
    },
    {
      id: '5',
      name: 'Data Uniqueness',
      category: 'uniqueness',
      score: 82.1,
      trend: 'down',
      change: '-3.2%',
      status: 'critical',
      lastChecked: '5 minutes ago',
      description: 'Absence of duplicate records in unique key fields'
    },
    {
      id: '6',
      name: 'Data Timeliness',
      category: 'timeliness',
      score: 89.7,
      trend: 'up',
      change: '+1.5%',
      status: 'warning',
      lastChecked: '5 minutes ago',
      description: 'Freshness and currency of data relative to business requirements'
    }
  ];

  const dataIssues: DataIssue[] = [
    {
      id: '1',
      severity: 'high',
      type: 'Duplicate Records',
      table: 'customer_profiles',
      schema: 'production',
      description: 'Found 2,847 duplicate customer records based on email address',
      affectedRows: 2847,
      detectedAt: '2 hours ago',
      status: 'investigating',
      assignee: 'Sarah Chen'
    },
    {
      id: '2',
      severity: 'medium',
      type: 'Missing Values',
      table: 'sales_transactions',
      schema: 'sales',
      description: 'Missing product_id in 156 transaction records',
      affectedRows: 156,
      detectedAt: '4 hours ago',
      status: 'open'
    },
    {
      id: '3',
      severity: 'low',
      type: 'Format Inconsistency',
      table: 'user_addresses',
      schema: 'customer',
      description: 'Inconsistent phone number formats detected',
      affectedRows: 89,
      detectedAt: '6 hours ago',
      status: 'resolved',
      assignee: 'Mike Rodriguez'
    },
    {
      id: '4',
      severity: 'high',
      type: 'Data Freshness',
      table: 'inventory_levels',
      schema: 'warehouse',
      description: 'Inventory data has not been updated for 8 hours',
      affectedRows: 12456,
      detectedAt: '8 hours ago',
      status: 'open'
    },
    {
      id: '5',
      severity: 'medium',
      type: 'Referential Integrity',
      table: 'order_items',
      schema: 'sales',
      description: 'Found order items referencing non-existent products',
      affectedRows: 23,
      detectedAt: '1 day ago',
      status: 'investigating',
      assignee: 'David Kim'
    }
  ];

  const qualityRules: QualityRule[] = [
    {
      id: '1',
      name: 'Email Format Validation',
      type: 'format',
      table: 'customers',
      column: 'email',
      condition: 'REGEXP_LIKE(email, \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$\')',
      status: 'active',
      lastRun: '5 minutes ago',
      passRate: 98.5
    },
    {
      id: '2',
      name: 'Order Amount Range',
      type: 'range',
      table: 'orders',
      column: 'total_amount',
      condition: 'total_amount > 0 AND total_amount < 50000',
      status: 'active',
      lastRun: '5 minutes ago',
      passRate: 99.2
    },
    {
      id: '3',
      name: 'Customer Age Validation',
      type: 'range',
      table: 'customers',
      column: 'age',
      condition: 'age >= 18 AND age <= 120',
      status: 'active',
      lastRun: '5 minutes ago',
      passRate: 97.8
    },
    {
      id: '4',
      name: 'Product SKU Uniqueness',
      type: 'constraint',
      table: 'products',
      column: 'sku',
      condition: 'COUNT(DISTINCT sku) = COUNT(sku)',
      status: 'failed',
      lastRun: '1 hour ago',
      passRate: 82.1
    },
    {
      id: '5',
      name: 'Order Date Validation',
      type: 'validation',
      table: 'orders',
      column: 'order_date',
      condition: 'order_date <= CURRENT_DATE',
      status: 'active',
      lastRun: '5 minutes ago',
      passRate: 100.0
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      case 'active': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'inactive': return 'text-gray-400';
      case 'open': return 'text-red-400';
      case 'investigating': return 'text-yellow-400';
      case 'resolved': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getQualityIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (score >= 85) return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const overallQualityScore = Math.round(qualityMetrics.reduce((sum, metric) => sum + metric.score, 0) / qualityMetrics.length);

  return (
    <div className="h-full bg-background text-foreground p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">Data Quality</h1>
          <p className="text-gray-400">Monitor and maintain the health of your data assets</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Overall Quality Score */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Overall Data Quality Score</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-white">{overallQualityScore}%</div>
                  <div className="flex items-center gap-2">
                    {getQualityIcon(overallQualityScore)}
                    <span className={`text-sm font-medium ${getStatusColor(overallQualityScore >= 95 ? 'healthy' : overallQualityScore >= 85 ? 'warning' : 'critical')}`}>
                      {overallQualityScore >= 95 ? 'Excellent' : overallQualityScore >= 85 ? 'Good' : 'Needs Attention'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">Based on 6 quality dimensions across all data assets</p>
              </div>
              <div className="w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(overallQualityScore / 100) * 351.86} 351.86`}
                    className="text-blue-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white text-left">{overallQualityScore}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="rules">Quality Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Quality Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {qualityMetrics.map((metric) => (
              <Card key={metric.id} className="bg-gray-800/30 border-gray-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm font-medium">{metric.name}</CardTitle>
                    <Badge variant="outline" className={StatusColors[metric.status]}>
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-white">{metric.score}%</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${
                        metric.change.startsWith('+') ? 'text-green-400' : 
                        metric.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <Progress value={metric.score} className="mb-3" />
                  <p className="text-xs text-gray-400 mb-2">{metric.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Last checked {metric.lastChecked}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">5</p>
                    <p className="text-xs text-gray-400">Active Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">23</p>
                    <p className="text-xs text-gray-400">Quality Rules</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">147</p>
                    <p className="text-xs text-gray-400">Monitored Tables</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">98.2%</p>
                    <p className="text-xs text-gray-400">Automation Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Data Quality Issues</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {dataIssues.map((issue) => (
              <Card key={issue.id} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <span className="text-white font-medium">{issue.type}</span>
                        <Badge variant="outline" className={`text-xs ${
                          issue.status === 'open' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          issue.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Table: {issue.schema}.{issue.table}</span>
                        <span>Affected Rows: {issue.affectedRows.toLocaleString()}</span>
                        <span>Detected: {issue.detectedAt}</span>
                        {issue.assignee && <span>Assignee: {issue.assignee}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Quality Rules</h3>
              <Button className="gap-2">
                <Settings className="w-4 h-4" />
                Create Rule
              </Button>
            </div>

            {qualityRules.map((rule) => (
              <Card key={rule.id} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-medium">{rule.name}</span>
                        <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {rule.type}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${
                          rule.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          rule.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}>
                          {rule.status}
                        </Badge>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg mb-3">
                        <code className="text-xs text-gray-300 font-mono">{rule.condition}</code>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span>Table: {rule.table}</span>
                        <span>Column: {rule.column}</span>
                        <span>Last Run: {rule.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Pass Rate:</span>
                        <div className="flex-1 max-w-32">
                          <Progress value={rule.passRate} />
                        </div>
                        <span className="text-xs font-medium text-white">{rule.passRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quality Trends</CardTitle>
                <CardDescription>Data quality scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Issue Distribution</CardTitle>
                <CardDescription>Issues by category and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default DataQuality;