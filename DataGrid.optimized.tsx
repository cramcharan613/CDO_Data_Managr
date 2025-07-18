import React, { useState, memo, useMemo, useCallback } from 'react';
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
import { usePerformanceMonitor, useRenderOptimization, useVirtualScrolling } from '../hooks/usePerformanceOptimization';
import { ErrorBoundary } from './ErrorBoundary';

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

interface TableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

interface TableRowProps {
  item: DataItem;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
}

const TableHeader = memo<TableHeaderProps>(({ onSort, sortColumn, sortDirection, onSelectAll, allSelected }) => {
  const handleSortClick = useCallback((column: string) => {
    onSort(column);
  }, [onSort]);

  const handleSelectAllChange = useCallback((checked: boolean) => {
    onSelectAll(checked);
  }, [onSelectAll]);

  return (
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="w-12 p-4 text-left">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAllChange}
          />
        </th>
        <th className="p-4 text-left">
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold"
            onClick={() => handleSortClick('name')}
          >
            Name
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold"
            onClick={() => handleSortClick('type')}
          >
            Type
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        </th>
        <th className="p-4 text-left">
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold"
            onClick={() => handleSortClick('records')}
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
  );
});

TableHeader.displayName = 'TableHeader';

const TableRow = memo<TableRowProps>(({ item, isSelected, onSelect }) => {
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

  const handleSelectChange = useCallback((checked: boolean) => {
    onSelect(item.id, checked);
  }, [item.id, onSelect]);

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
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
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit Schema
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
});

TableRow.displayName = 'TableRow';

const VirtualizedTable = memo<{ data: DataItem[]; selectedRows: Set<number>; onSelect: (id: number, checked: boolean) => void; onSelectAll: (checked: boolean) => void; onSort: (column: string) => void; sortColumn: string; sortDirection: 'asc' | 'desc' }>(({ data, selectedRows, onSelect, onSelectAll, onSort, sortColumn, sortDirection }) => {
  const containerHeight = 400;
  const itemHeight = 60;

  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  } = useVirtualScrolling(data, itemHeight, containerHeight);

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSelectAll={onSelectAll}
            allSelected={selectedRows.size === data.length}
          />
        </table>
        <div
          className="overflow-auto"
          style={{ height: containerHeight }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              <table className="w-full">
                <tbody>
                  {visibleItems.map((item) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedRows.has(item.id)}
                      onSelect={onSelect}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export const DataGrid = memo(() => {
  const { markStart, markEnd } = usePerformanceMonitor('DataGrid');
  const { measureRender } = useRenderOptimization('DataGrid');

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sampleData = useMemo<DataItem[]>(() => [
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

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sampleData.map(item => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  }, [sampleData]);

  const handleSelectRow = useCallback((id: number, checked: boolean) => {
    setSelectedRows(prev => {
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  }, []);

  const handleSort = useCallback((column: string) => {
    markStart('sort-operation');
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    markEnd('sort-operation', 50);
  }, [sortColumn, markStart, markEnd]);

  React.useEffect(() => {
    const endMeasure = measureRender();
    return endMeasure;
  });

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Data Manager</h1>
            <p className="text-muted-foreground">
              Manage your datasets, tables, and data streams
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
            <Button className="gap-2">
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
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <VirtualizedTable
              data={sampleData}
              selectedRows={selectedRows}
              onSelect={handleSelectRow}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
});

DataGrid.displayName = 'DataGrid';
