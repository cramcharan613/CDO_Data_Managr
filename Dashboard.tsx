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
import { usePerformanceMonitor } from '../hooks/usePerformanceOptimization';

const MetricCard = memo<{
  title: string;
  value: string;
  change: string;
  trend: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}>(({ title, value, change, trend, icon: Icon, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`w-4 h-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          {change} from last week
        </div>
      </CardContent>
    </Card>
  );
});

MetricCard.displayName = 'MetricCard';

const WorkflowCard = memo<{
  workflow: {
    name: string;
    status: string;
    progress: number;
    records: string;
    duration: string;
  };
  onAction: (workflowName: string) => void;
}>(({ workflow, onAction }) => {
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

  const handleAction = useCallback(() => {
    onAction(workflow.name);
  }, [onAction, workflow.name]);

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
        <Button variant="ghost" size="sm" onClick={handleAction}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

WorkflowCard.displayName = 'WorkflowCard';

const ActivityItem = memo<{
  activity: {
    action: string;
    workflow: string;
    time: string;
    type: string;
  };
}>(({ activity }) => {
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
  const metrics = useMemo(() => [
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

  const recentWorkflows = useMemo(() => [
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

  const recentActivity = useMemo(() => [
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

  const handleWorkflowAction = useCallback((workflowName: string) => {
    markStart('workflow-action');
    console.log('Workflow action:', workflowName);
    markEnd('workflow-action', 50);
  }, [markStart, markEnd]);

  const handleViewAllMetrics = useCallback(() => {
    markStart('view-all-metrics');
    console.log('View all metrics clicked');
    markEnd('view-all-metrics', 50);
  }, [markStart, markEnd]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your data workflows and system performance
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleViewAllMetrics}>
          <Activity className="w-4 h-4" />
          View All Metrics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            color={metric.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workflows */}
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
                <WorkflowCard
                  key={`${workflow.name}-${index}`}
                  workflow={workflow}
                  onAction={handleWorkflowAction}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
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
                <ActivityItem
                  key={`${activity.action}-${index}`}
                  activity={activity}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';