import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  TrendingUp,
  Database,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';
import { usePerformanceMonitor, useRenderOptimization } from '../hooks/usePerformanceOptimization';
import { ErrorBoundary } from './ErrorBoundary';

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  color: string;
}

interface Workflow {
  name: string;
  status: string;
  progress: number;
  records: string;
  duration: string;
}

interface Activity {
  action: string;
  workflow: string;
  time: string;
  type: string;
}

const MetricCard = memo<{ metric: Metric }>(({ metric }) => {
  const Icon = metric.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
        <Icon className={`w-4 h-4 ${metric.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric.value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className={`w-3 h-3 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          {metric.change} from last week
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

const WorkflowItem = memo<{ workflow: Workflow; index: number }>(({ workflow, index }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'failed': return <AlertCircle className="w-3 h-3" />;
      default: return <Pause className="w-3 h-3" />;
    }
  }, []);

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`} />
        <div>
          <p className="font-medium">{workflow.name}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{workflow.records} records</span>
            <span>{workflow.duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="flex items-center gap-1">
            {getStatusIcon(workflow.status)}
            <Badge variant="outline" className="text-xs">
              {workflow.status}
            </Badge>
          </div>
          <Progress value={workflow.progress} className="w-20 mt-1" />
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

WorkflowItem.displayName = 'WorkflowItem';

const ActivityItem = memo<{ activity: Activity; index: number }>(({ activity, index }) => {
  const getActivityColor = useCallback((type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }, []);

  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
      <div className="flex-1">
        <p className="text-sm">{activity.action}</p>
        <p className="text-sm text-muted-foreground">{activity.workflow}</p>
        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

export const Dashboard = memo(() => {
  const { markStart, markEnd } = usePerformanceMonitor('Dashboard');
  const { measureRender } = useRenderOptimization('Dashboard');

  const metrics = useMemo<Metric[]>(() => [
    {
      title: 'Total Records',
      value: '2.4M',
      change: '+12%',
      trend: 'up',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      title: 'Active Workflows',
      value: '47',
      change: '+3',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-0.4s',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ], []);

  const recentWorkflows = useMemo<Workflow[]>(() => [
    {
      name: 'Customer Data Pipeline',
      status: 'running',
      progress: 75,
      records: '1.2M',
      duration: '15m'
    },
    {
      name: 'Product Catalog Sync',
      status: 'completed',
      progress: 100,
      records: '840K',
      duration: '8m'
    },
    {
      name: 'Analytics Data Transform',
      status: 'failed',
      progress: 45,
      records: '320K',
      duration: '12m'
    },
    {
      name: 'User Activity Stream',
      status: 'running',
      progress: 30,
      records: '2.1M',
      duration: '22m'
    }
  ], []);

  const recentActivity = useMemo<Activity[]>(() => [
    {
      action: 'Workflow completed',
      workflow: 'Customer Data Pipeline',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      action: 'Data quality issue detected',
      workflow: 'Product Catalog Sync',
      time: '15 minutes ago',
      type: 'warning'
    },
    {
      action: 'New dataset imported',
      workflow: 'Sales Analytics',
      time: '1 hour ago',
      type: 'info'
    },
    {
      action: 'Code deployment completed',
      workflow: 'ML Model Training',
      time: '2 hours ago',
      type: 'success'
    }
  ], []);

  React.useEffect(() => {
    const endMeasure = measureRender();
    return endMeasure;
  });

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your data workflows and system performance
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Activity className="w-4 h-4" />
            View All Metrics
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} metric={metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workflows</CardTitle>
              <CardDescription>
                Monitor your active and completed data workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentWorkflows.map((workflow, index) => (
                  <WorkflowItem key={`${workflow.name}-${index}`} workflow={workflow} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <ActivityItem key={`${activity.action}-${index}`} activity={activity} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
});

Dashboard.displayName = 'Dashboard';
