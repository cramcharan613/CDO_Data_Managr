import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { NavigationIcons, ActionIcons, StatusIcons } from './IconSystem';
import { 
  Home, 
  Database, 
  GitBranch, 
  Code, 
  Settings, 
  Search,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  Plus,
  User,
  Cloud,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Activity,
  Bell,
  LogOut,
  TrendingUp,
  Eye,
  Folder
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      badge: null,
      description: 'Overview and insights'
    },
    { 
      id: 'analysis', 
      label: 'Data Analysis', 
      icon: TrendingUp, 
      badge: 'Pro',
      description: 'Advanced analytics'
    },
    { 
      id: 'data', 
      label: 'Data Objects', 
      icon: Database, 
      badge: null,
      description: 'Tables, views, schemas'
    },
    { 
      id: 'workflows', 
      label: 'Data Pipelines', 
      icon: GitBranch, 
      badge: '5',
      description: 'ETL workflows'
    },
    { 
      id: 'code', 
      label: 'Query Editor', 
      icon: Code, 
      badge: null,
      description: 'SQL editor'
    },
    { 
      id: 'charts', 
      label: 'Visualizations', 
      icon: BarChart3, 
      badge: null,
      description: 'Charts and reports'
    },
    { 
      id: 'files', 
      label: 'Data Catalog', 
      icon: Folder, 
      badge: null,
      description: 'Browse data assets'
    },
    { 
      id: 'security', 
      label: 'Data Quality', 
      icon: Shield, 
      badge: '2',
      description: 'Quality monitoring'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      badge: null,
      description: 'Configuration'
    },
  ];

  const quickActions = [
    { 
      label: 'New Query', 
      icon: Plus, 
      color: 'text-blue-400',
      action: () => onTabChange('code')
    },
    { 
      label: 'Import Data', 
      icon: Cloud, 
      color: 'text-green-400',
      action: () => onTabChange('data')
    },
    { 
      label: 'Create Pipeline', 
      icon: Zap, 
      color: 'text-purple-400',
      action: () => onTabChange('workflows')
    },
  ];

  const systemMetrics = [
    { label: 'Active Connections', value: '12', status: 'healthy' },
    { label: 'Daily Queries', value: '2.4K', status: 'healthy' },
    { label: 'Data Quality', value: '98.7%', status: 'healthy' },
    { label: 'Storage Used', value: '4.2TB', status: 'warning' },
  ];

  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out backdrop-blur-xl ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border/50 bg-sidebar-header/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-sidebar-foreground font-semibold text-lg">DataFlow</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Production</span>
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                  v2.0
                </Badge>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200 ease-out"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-sidebar-border/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search features, data objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-sidebar-accent/30 border-sidebar-border/50 text-sidebar-foreground placeholder:text-muted-foreground focus:bg-sidebar-accent/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 ease-out rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-1">
          {filteredItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 rounded-lg transition-all duration-200 ease-out h-auto py-3 ${
                activeTab === item.id
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground border border-transparent hover:border-sidebar-border/50'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full text-left">
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className={`ml-2 text-xs ${
                      item.badge === 'Pro' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400 border-purple-500/30'
                        : 'bg-primary/20 text-primary border-primary/30'
                    }`}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          ))}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border/50 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-sidebar-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200 ease-out border border-transparent hover:border-sidebar-border/50"
                  onClick={action.action}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-sidebar-foreground">System Health</h3>
            </div>
            <div className="space-y-2">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </span>
                    {getStatusIcon(metric.status as keyof typeof StatusIcons, 'w-3 h-3')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-header/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-sidebar"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-sidebar-foreground">Data Analyst</p>
                <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                  Admin
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">analyst@company.com</p>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs hover:bg-sidebar-accent/50 rounded-md"
                  onClick={() => onTabChange('settings')}
                >
                  <Bell className="w-3 h-3 mr-1" />
                  3
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs hover:bg-sidebar-accent/50 rounded-md"
                >
                  <LogOut className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusIcon(status: keyof typeof StatusIcons, className?: string) {
  const Icon = StatusIcons[status];
  return <Icon className={className || 'w-4 h-4'} />;
}