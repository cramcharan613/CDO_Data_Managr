import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Database, 
  Users, 
  Upload, 
  FileText, 
  Warehouse,
  Code,
  Table,
  BarChart3,
  Settings,
  User,
  Shield,
  Eye,
  FileSpreadsheet,
  Archive,
  Download,
  Zap,
  Cpu,
  HardDrive,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function QuickActionModal({ isOpen, onClose, actionType, title, icon: Icon, color }: QuickActionModalProps) {
  const getSubActions = () => {
    switch (actionType) {
      case 'query':
        return {
          title: 'Query Data Options',
          description: 'Choose how you want to query your data',
          sections: [
            {
              title: 'SQL Queries',
              items: [
                { icon: Database, title: 'SQL Worksheet', description: 'Create a new SQL worksheet for data queries', badge: 'Popular', badgeColor: 'bg-emerald-500' },
                { icon: FileText, title: 'Saved Query', description: 'Open an existing saved query', badge: null, badgeColor: '' },
                { icon: BarChart3, title: 'Query with Charts', description: 'Create queries with visualization', badge: 'New', badgeColor: 'bg-blue-500' },
              ]
            },
            {
              title: 'Advanced Options',
              items: [
                { icon: Code, title: 'Python Notebook', description: 'Use Python for data analysis', badge: null, badgeColor: '' },
                { icon: Table, title: 'Query Builder', description: 'Visual query builder interface', badge: null, badgeColor: '' },
                { icon: Download, title: 'Query Templates', description: 'Start with pre-built query templates', badge: null, badgeColor: '' },
              ]
            }
          ]
        };
      
      case 'warehouse':
        return {
          title: 'Create Warehouse',
          description: 'Choose the size and configuration for your warehouse',
          sections: [
            {
              title: 'Standard Sizes',
              items: [
                { icon: Cpu, title: 'X-Small', description: '1 server, best for development and testing', badge: 'Recommended', badgeColor: 'bg-emerald-500' },
                { icon: Cpu, title: 'Small', description: '2 servers, good for small workloads', badge: null, badgeColor: '' },
                { icon: Cpu, title: 'Medium', description: '4 servers, balanced performance', badge: 'Popular', badgeColor: 'bg-blue-500' },
              ]
            },
            {
              title: 'High Performance',
              items: [
                { icon: Zap, title: 'Large', description: '8 servers, high-performance computing', badge: null, badgeColor: '' },
                { icon: Zap, title: 'X-Large', description: '16 servers, enterprise workloads', badge: null, badgeColor: '' },
                { icon: HardDrive, title: 'Custom', description: 'Configure custom warehouse specifications', badge: 'Enterprise', badgeColor: 'bg-purple-500' },
              ]
            }
          ]
        };
      
      case 'user':
        return {
          title: 'Create User',
          description: 'Set up access for new team members',
          sections: [
            {
              title: 'User Types',
              items: [
                { icon: User, title: 'Standard User', description: 'Basic access with read/write permissions', badge: 'Common', badgeColor: 'bg-blue-500' },
                { icon: Shield, title: 'Admin User', description: 'Full administrative access and control', badge: null, badgeColor: '' },
                { icon: Eye, title: 'Read-Only User', description: 'View-only access to data and reports', badge: null, badgeColor: '' },
              ]
            },
            {
              title: 'Advanced Setup',
              items: [
                { icon: Users, title: 'Bulk User Import', description: 'Import multiple users from CSV', badge: null, badgeColor: '' },
                { icon: Settings, title: 'Custom Role', description: 'Create user with custom permissions', badge: 'Pro', badgeColor: 'bg-purple-500' },
                { icon: Database, title: 'Service Account', description: 'Create automated service account', badge: null, badgeColor: '' },
              ]
            }
          ]
        };
      
      case 'upload':
        return {
          title: 'Upload Local Files',
          description: 'Choose how to upload and process your data files',
          sections: [
            {
              title: 'File Types',
              items: [
                { icon: FileSpreadsheet, title: 'CSV Files', description: 'Upload comma-separated value files', badge: 'Popular', badgeColor: 'bg-emerald-500' },
                { icon: FileText, title: 'JSON Files', description: 'Upload JSON data files', badge: null, badgeColor: '' },
                { icon: Archive, title: 'Parquet Files', description: 'Upload compressed columnar data', badge: 'Fast', badgeColor: 'bg-blue-500' },
              ]
            },
            {
              title: 'Advanced Upload',
              items: [
                { icon: Table, title: 'Excel Files', description: 'Upload .xlsx and .xls spreadsheets', badge: null, badgeColor: '' },
                { icon: Archive, title: 'Compressed Files', description: 'Upload ZIP or TAR archives', badge: null, badgeColor: '' },
                { icon: Plus, title: 'Batch Upload', description: 'Upload multiple files at once', badge: 'Pro', badgeColor: 'bg-purple-500' },
              ]
            }
          ]
        };
      
      default:
        return { title: '', description: '', sections: [] };
    }
  };

  const subActions = getSubActions();

  const handleSubActionClick = (item: any) => {
    console.log(`Selected: ${item.title}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto glass-card border-border/50 scale-in">
        <DialogHeader>
          <div className="flex items-center gap-6 mb-4">
            <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-foreground flex items-center gap-2">
                {subActions.title}
                <Sparkles className="w-5 h-5 text-primary" />
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 text-base">
                {subActions.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {subActions.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 bg-primary rounded-full"></div>
                <h3 className="font-semibold text-foreground text-lg">{section.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="h-auto p-6 justify-start hover:bg-accent/50 transition-all duration-200 ease-out group border border-transparent hover:border-border/50 rounded-xl"
                    onClick={() => handleSubActionClick(item)}
                  >
                    <div className="flex items-start gap-5 w-full">
                      <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-200 ease-out">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-all duration-200 ease-out text-base">
                            {item.title}
                          </span>
                          {item.badge && (
                            <Badge className={`text-xs text-white ${item.badgeColor} hover:${item.badgeColor}/80`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ease-out" />
                    </div>
                  </Button>
                ))}
              </div>
              
              {sectionIndex < subActions.sections.length - 1 && (
                <Separator className="my-6 bg-border/50" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-border/50">
          <Button variant="outline" onClick={onClose} className="px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background">
            Cancel
          </Button>
          <Button className="px-6 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 ease-out">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}