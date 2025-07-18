import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  Filter, 
  Search, 
  Download, 
  Upload, 
  MoreVertical, 
  ArrowUpDown,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { 
  usePerformanceMonitor, 
  useDebouncedState,
  useVirtualScrolling
} from '../hooks/usePerformanceOptimization';

interface DataItem {
  id: number;
  name: string;
  type: string;
  records: number;
  size: string;
  status: string;
  lastModified: string;
  owner: string;
  quality: number;
}

const DataRow = memo<{
  item: DataItem;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onAction: (id: number, action: string) => void;
}>(({ item, isSelected, onSelect, onAction }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Processing': return 'bg-blue-500';
      case 'Error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getQualityColor = useCallback((quality: number) => {
    if (quality >= 95) return 'text-green-600';
    if (quality >= 85) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const handleSelect = useCallback((checked: boolean) => {
    onSelect(item.id, checked);
  }, [item.id, onSelect]);

  const handleAction = useCallback((action: string) => {
    onAction(item.id, action);
  }, [item.id, onAction]);

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-4">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={handleSelect}
        />
      </td>
      <td className="p-4 font-medium">{item.name}</td>
      <td className="p-4">
        <Badge variant="outline">{item.type}</Badge>
      </td>
      <td className="p-4">{item.records.toLocaleString()}</td>
      <td className="p-4">{item.size}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
          {item.status}
        </div>
      </td>
      <td className="p-4">
        <span className={`font-medium ${getQualityColor(item.quality)}`}>
          {item.quality}%
        </span>
      </td>
      <td className="p-4">{item.owner}</td>
      <td className="p-4 text-sm text-muted-foreground">{item.lastModified}</td>
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAction('view')}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('edit')}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Schema
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleAction('delete')}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
});

DataRow.displayName = 'DataRow';

export const DataGrid = memo(() => {
  const { markStart, markEnd } = usePerformanceMonitor('DataGrid');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedState('', 300);

  const sampleData = useMemo(() => [
    {
      id: 1,
      name: 'Customer Analytics Dataset',
      type: 'Table',
      records: 2400000,
      size: '1.2 GB',
      status: 'Active',
      lastModified: '2024-01-15 09:30',
      owner: 'John Doe',
      quality: 98
    },
    {
      id: 2,
      name: 'Product Catalog',
      type: 'View',
      records: 85000,
      size: '45 MB',
      status: 'Processing',
      lastModified: '2024-01-15 08:15',
      owner: 'Jane Smith',
      quality: 95
    },
    {
      id: 3,
      name: 'Sales Transactions',
      type: 'Table',
      records: 5600000,
      size: '3.8 GB',
      status: 'Active',
      lastModified: '2024-01-14 16:45',
      owner: 'Mike Johnson',
      quality: 92
    },
    {
      id: 4,
      name: 'User Activity Log',
      type: 'Stream',
      records: 12000000,
      size: '890 MB',
      status: 'Error',
      lastModified: '2024-01-14 14:22',
      owner: 'Sarah Wilson',
      quality: 85
    },
    {
      id: 5,
      name: 'Inventory Management',
      type: 'Table',
      records: 150000,
      size: '78 MB',
      status: 'Active',
      lastModified: '2024-01-13 11:30',
      owner: 'Alex Chen',
      quality: 97
    }
  ], []);

  const filteredData = useMemo(() => {
    markStart('filter-data');
    const filtered = sampleData.filter(item => 
      item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    markEnd('filter-data', 50);
    return filtered;
  }, [sampleData, debouncedSearchTerm, markStart, markEnd]);

  const sortedData = useMemo(() => {
    markStart('sort-data');
    if (!sortColumn) {
      markEnd('sort-data', 10);
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn as keyof DataItem];
      const bValue = b[sortColumn as keyof DataItem];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
    markEnd('sort-data', 50);
    return sorted;
  }, [filteredData, sortColumn, sortDirection, markStart, markEnd]);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualScrolling(sortedData, 60, 400, 10);

  const handleSelectAll = useCallback((checked: boolean) => {
    markStart('select-all');
    if (checked) {
      setSelectedRows(new Set(sortedData.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
    markEnd('select-all', 100);
  }, [sortedData, markStart, markEnd]);

  const handleSelectRow = useCallback((id: number, checked: boolean) => {
    markStart('select-row');
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
    markEnd('select-row', 50);
  }, [selectedRows, markStart, markEnd]);

  const handleSort = useCallback((column: string) => {
    markStart('sort');
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    markEnd('sort', 50);
  }, [sortColumn, sortDirection, markStart, markEnd]);

  const handleRowAction = useCallback((id: number, action: string) => {
    markStart('row-action');
    console.log('Row action:', action, 'for item:', id);
    markEnd('row-action', 50);
  }, [markStart, markEnd]);

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, [setSearchTerm]);

  const handleImportData = useCallback(() => {
    markStart('import-data');
    console.log('Import data clicked');
    markEnd('import-data', 50);
  }, [markStart, markEnd]);

  const handleExportData = useCallback(() => {
    markStart('export-data');
    console.log('Export data clicked');
    markEnd('export-data', 50);
  }, [markStart, markEnd]);

  const handleFilter = useCallback(() => {
    markStart('filter');
    console.log('Filter clicked');
    markEnd('filter', 50);
  }, [markStart, markEnd]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Data Manager</h1>
          <p className="text-muted-foreground">
            Manage your datasets, tables, and data streams
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleImportData}>
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          <Button className="gap-2" onClick={handleExportData}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Datasets</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search datasets..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleFilter}>
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="w-12 p-4 text-left">
                      <Checkbox 
                        checked={selectedRows.size === sortedData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left">
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('name')}
                      >
                        Name
                        <ArrowUpDown className="ml-2 w-4 h-4" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('type')}
                      >
                        Type
                        <ArrowUpDown className="ml-2 w-4 h-4" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">
                      <Button 
                        variant="ghost" 
                        className="h-auto p-0 font-semibold"
                        onClick={() => handleSort('records')}
                      >
                        Records
                        <ArrowUpDown className="ml-2 w-4 h-4" />
                      </Button>
                    </th>
                    <th className="p-4 text-left">Size</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Quality</th>
                    <th className="p-4 text-left">Owner</th>
                    <th className="p-4 text-left">Last Modified</th>
                    <th className="w-12 p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item) => (
                    <DataRow
                      key={item.id}
                      item={item}
                      isSelected={selectedRows.has(item.id)}
                      onSelect={handleSelectRow}
                      onAction={handleRowAction}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

DataGrid.displayName = 'DataGrid';