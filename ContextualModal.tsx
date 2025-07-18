import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getDataIcon, getStatusIcon, StatusColors } from './IconSystem';
import {
  Database,
  Table,
  Eye,
  Edit,
  Play,
  Pause,
  Trash2,
  Download,
  Upload,
  Settings,
  Users,
  Calendar,
  Activity,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DataObject {
  id: string;
  name: string;
  type: 'database' | 'schema' | 'table' | 'view';
  status: 'healthy' | 'warning' | 'error';
  size: string;
  rowCount: string;
  lastModified: string;
  region: string;
  owner: string;
  description?: string;
}

interface ContextualModalProps {
  isOpen: boolean;
  onClose: () => void;
  object: DataObject;
  mode: 'view' | 'edit' | 'manage' | 'analyze';
  onAction: (action: string, data?: any) => void;
}

export function ContextualModal({ isOpen, onClose, object, mode, onAction }: ContextualModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: object.name,
    description: object.description || '',
    owner: object.owner,
    region: object.region,
  });

  const handleSave = () => {
    onAction('save', formData);
    setIsEditing(false);
  };

  const handleAction = (actionType: string) => {
    onAction(actionType, object);
  };

  const renderViewMode = () => (
    <div className="space-y-6">
      {/* Object Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getDataIcon(object.type, 'w-6 h-6 text-blue-400')}
          <div>
            <h3 className="text-lg font-medium text-white">{object.name}</h3>
            <p className="text-sm text-gray-400">{object.type} • {object.region}</p>
          </div>
        </div>
        <Badge className={StatusColors[object.status]}>
          {object.status}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400">Size</div>
            <div className="text-sm font-medium text-white">{object.size}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400">Rows</div>
            <div className="text-sm font-medium text-white">{object.rowCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400">Owner</div>
            <div className="text-sm font-medium text-white">{object.owner}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="text-xs text-gray-400">Modified</div>
            <div className="text-sm font-medium text-white">{object.lastModified}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => handleAction('query')}>
          <Play className="w-4 h-4 mr-2" />
          Query
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction('export')}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleAction('analyze')}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Analyze
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-gray-800/50 border-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            className="bg-gray-800/50 border-gray-600"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="region">Region</Label>
        <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
          <SelectTrigger className="bg-gray-800/50 border-gray-600">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Americas">Americas</SelectItem>
            <SelectItem value="EMEA">EMEA</SelectItem>
            <SelectItem value="APAC">Asia Pacific</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-gray-800/50 border-gray-600"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
      </div>
    </div>
  );

  const renderManageMode = () => (
    <Tabs defaultValue="permissions" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="permissions" className="space-y-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm">Access Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Read Access</span>
              <Badge variant="outline">All Users</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Write Access</span>
              <Badge variant="outline">Data Team</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Access</span>
              <Badge variant="outline">Admins Only</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-sm">Automated Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Schedule</span>
              <Badge variant="outline">Daily 2:00 AM</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Data Quality Check</span>
              <Badge variant="outline">Every 6 hours</Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitoring" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm">Uptime</span>
              </div>
              <div className="text-lg font-medium text-white">99.8%</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Query Rate</span>
              </div>
              <div className="text-lg font-medium text-white">1.2K/min</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <div className="space-y-2">
          {[
            { action: 'Schema updated', time: '2 hours ago', user: 'John Doe' },
            { action: 'Data imported', time: '1 day ago', user: 'System' },
            { action: 'Permissions modified', time: '3 days ago', user: 'Admin' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <div>
                <div className="text-sm text-white">{item.action}</div>
                <div className="text-xs text-gray-400">{item.user}</div>
              </div>
              <div className="text-xs text-gray-400">{item.time}</div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );

  const getModalTitle = () => {
    switch (mode) {
      case 'edit': return isEditing ? 'Edit Object' : 'Object Details';
      case 'manage': return 'Manage Object';
      case 'analyze': return 'Object Analysis';
      default: return 'Object Details';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'manage' ? 'Configure settings and permissions' : 
             mode === 'analyze' ? 'View analytics and performance metrics' :
             isEditing ? 'Modify object properties' : 'View object information and perform actions'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {mode === 'manage' ? renderManageMode() :
           isEditing ? renderEditMode() : renderViewMode()}
        </div>
      </DialogContent>
    </Dialog>
  );
}