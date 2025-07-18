import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Activity, 
  FileText, 
  Package, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Download
} from 'lucide-react';
import { BundleAnalyzer, generateBundleReport, getBundleMetrics } from '../utils/bundleAnalyzer';

interface BundleAnalysisReportProps {
  onDownloadReport?: () => void;
}

export const BundleAnalysisReport = memo<BundleAnalysisReportProps>(({ onDownloadReport }) => {
  const analyzer = useMemo(() => new BundleAnalyzer(), []);
  const analysisResults = useMemo(() => analyzer.analyzeBundle(), [analyzer]);
  const metrics = useMemo(() => getBundleMetrics(), []);

  const handleDownloadReport = () => {
    const report = generateBundleReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bundle-analysis-report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    if (onDownloadReport) {
      onDownloadReport();
    }
  };

  const getStatusColor = (count: number, threshold: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= threshold) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (count: number, threshold: number) => {
    if (count === 0) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (count <= threshold) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const optimizationScore = useMemo(() => {
    const totalIssues = analysisResults.heavyComponents.length + 
                       analysisResults.unusedImports.length + 
                       analysisResults.lazyLoadingOpportunities.length;
    const maxIssues = 10; // Arbitrary max for scoring
    return Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues) * 100));
  }, [analysisResults]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bundle Analysis Report</h2>
          <p className="text-muted-foreground">
            Comprehensive analysis of your application bundle
          </p>
        </div>
        <Button onClick={handleDownloadReport} className="gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Components</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisResults.totalComponents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.optimizedComponents} optimized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundle Size</CardTitle>
            <FileText className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bundleSize}KB</div>
            <p className="text-xs text-muted-foreground">
              Estimated size
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lazy Loaded</CardTitle>
            <Activity className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.lazyLoadedComponents}</div>
            <p className="text-xs text-muted-foreground">
              Components split
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(optimizationScore)}%</div>
            <Progress value={optimizationScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Heavy Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.heavyComponents.length > 0 ? (
                analysisResults.heavyComponents.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(1, 0)}
                      <span className="font-medium">{component}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Heavy
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">All components are optimally sized</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Lazy Loading Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResults.lazyLoadingOpportunities.length > 0 ? (
                analysisResults.lazyLoadingOpportunities.map((component, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">{component}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Can be lazy loaded
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">All components are properly lazy loaded</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Bundle Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Average Component Size</span>
                <span className="font-medium">{Math.round(metrics.averageComponentSize)} lines</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Optimization Rate</span>
                <span className="font-medium">{Math.round((metrics.optimizedComponents / analysisResults.totalComponents) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lazy Loading Rate</span>
                <span className="font-medium">{Math.round((metrics.lazyLoadedComponents / analysisResults.totalComponents) * 100)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bundle Health</span>
                <Badge variant={optimizationScore >= 80 ? 'default' : optimizationScore >= 60 ? 'secondary' : 'destructive'}>
                  {optimizationScore >= 80 ? 'Excellent' : optimizationScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

BundleAnalysisReport.displayName = 'BundleAnalysisReport';