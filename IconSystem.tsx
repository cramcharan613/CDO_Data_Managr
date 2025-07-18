import React from 'react';
import {
  Database,
  Table,
  Folder,
  Eye,
  FileText,
  Server,
  Cloud,
  HardDrive,
  Cpu,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Settings,
  Users,
  Shield,
  Zap,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Home,
  GitBranch,
  Code,
  Calendar,
  Bell,
  User,
  LogOut
} from 'lucide-react';

// Standardized icon configurations
export const DataIcons = {
  database: Database,
  table: Table,
  schema: Folder,
  view: Eye,
  file: FileText,
  server: Server,
  cloud: Cloud,
  storage: HardDrive,
  compute: Cpu,
} as const;

export const StatusIcons = {
  healthy: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  pending: Clock,
  running: Play,
  stopped: Pause,
} as const;

export const ChartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  trend_up: TrendingUp,
  trend_down: TrendingDown,
  activity: Activity,
} as const;

export const ActionIcons = {
  edit: Edit,
  delete: Trash2,
  add: Plus,
  settings: Settings,
  users: Users,
  security: Shield,
  automation: Zap,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  more: MoreHorizontal,
} as const;

export const NavigationIcons = {
  right: ChevronRight,
  left: ChevronLeft,
  down: ChevronDown,
  up: ChevronUp,
  home: Home,
  workflows: GitBranch,
  code: Code,
  calendar: Calendar,
  notifications: Bell,
  user: User,
  logout: LogOut,
} as const;

// Standardized color schemes
export const StatusColors = {
  healthy: 'text-green-400 bg-green-500/20 border-green-500/30',
  warning: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  error: 'text-red-400 bg-red-500/20 border-red-500/30',
  info: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
  neutral: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
} as const;

export const RegionColors = {
  americas: 'text-blue-400',
  emea: 'text-green-400',
  apac: 'text-purple-400',
  global: 'text-orange-400',
} as const;

// Utility function to get standardized icon
export function getDataIcon(type: keyof typeof DataIcons, className?: string) {
  const Icon = DataIcons[type];
  return <Icon className={className || 'w-4 h-4'} />;
}

export function getStatusIcon(status: keyof typeof StatusIcons, className?: string) {
  const Icon = StatusIcons[status];
  return <Icon className={className || 'w-4 h-4'} />;
}

export function getChartIcon(type: keyof typeof ChartIcons, className?: string) {
  const Icon = ChartIcons[type];
  return <Icon className={className || 'w-4 h-4'} />;
}