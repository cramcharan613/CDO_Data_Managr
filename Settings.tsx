import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Palette, 
  Zap,
  Users,
  Key
} from 'lucide-react';

export const Settings = memo(function Settings() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Database className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@company.com" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Data Engineer" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
                <CardDescription>
                  Manage your team membership and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Team</p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Team</p>
                    <p className="text-sm text-muted-foreground">Member</p>
                  </div>
                  <Badge variant="secondary">Member</Badge>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Users className="w-4 h-4" />
                  Manage Teams
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>
                  Manage your login credentials and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">sk-****-****-****-1234</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Development API Key</p>
                      <p className="text-sm text-muted-foreground">sk-****-****-****-5678</p>
                    </div>
                    <Button variant="outline" size="sm">Regenerate</Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Key className="w-4 h-4" />
                  Generate New Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about system events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Workflow Completion</p>
                    <p className="text-sm text-muted-foreground">Get notified when workflows complete</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Quality Issues</p>
                    <p className="text-sm text-muted-foreground">Alert for data quality problems</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Maintenance</p>
                    <p className="text-sm text-muted-foreground">Notifications about system updates</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Team Activity</p>
                    <p className="text-sm text-muted-foreground">Updates about team member actions</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage your external service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">PostgreSQL</p>
                      <p className="text-sm text-muted-foreground">Production database</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="font-medium">Spark Cluster</p>
                      <p className="text-sm text-muted-foreground">Data processing</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="font-medium">MongoDB</p>
                      <p className="text-sm text-muted-foreground">Document store</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Disconnected</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Integration</CardTitle>
                <CardDescription>
                  Connect new data sources and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Database className="w-6 h-6" />
                    <span className="text-xs">MySQL</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Database className="w-6 h-6" />
                    <span className="text-xs">Redis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Zap className="w-6 h-6" />
                    <span className="text-xs">Kafka</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Database className="w-6 h-6" />
                    <span className="text-xs">BigQuery</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Display</CardTitle>
              <CardDescription>
                Customize your application appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-muted-foreground">Increase contrast for better accessibility</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default Settings;