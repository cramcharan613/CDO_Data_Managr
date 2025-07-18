import React, { Component, ErrorInfo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, CheckCircle } from 'lucide-react';
import { ErrorBoundaryProps, ErrorBoundaryState, ErrorInfo as CustomErrorInfo } from '../types';

interface ErrorBoundaryWithLoggingProps extends ErrorBoundaryProps {
  level?: 'page' | 'component' | 'widget';
  componentName?: string;
  userId?: string;
  sessionId?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryWithLoggingProps, ErrorBoundaryState> {
  private eventId: string;

  constructor(props: ErrorBoundaryWithLoggingProps) {
    super(props);
    this.state = { hasError: false };
    this.eventId = this.generateEventId();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const customErrorInfo: CustomErrorInfo = {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.componentName || 'ErrorBoundary',
      errorBoundaryStack: errorInfo.errorBoundaryStack,
    };

    const errorDetails = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: customErrorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      level: this.props.level || 'component',
      eventId: this.eventId,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Additional Details:', errorDetails);
      console.groupEnd();
    }

    // Send to error logging service (implement your preferred service)
    this.logErrorToService(errorDetails);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, customErrorInfo);
    }

    this.setState({
      hasError: true,
      error,
      errorInfo: customErrorInfo,
      eventId: this.eventId,
    });
  }

  private generateEventId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async logErrorToService(errorDetails: any) {
    try {
      // Replace with your actual error logging service
      // Examples: Sentry, LogRocket, Bugsnag, custom API

      // For demonstration, using a mock API call
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorDetails),
      }).catch(() => {
        // Fallback to local storage if API fails
        const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
        errors.push(errorDetails);
        localStorage.setItem('app_errors', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
      });
    } catch (logError) {
      console.warn('Failed to log error to service:', logError);
    }
  }

  private handleReset = () => {
    this.eventId = this.generateEventId();
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorDetails = async () => {
    const errorText = `
Error ID: ${this.state.eventId}
Error: ${this.state.error?.name}: ${this.state.error?.message}
Component: ${this.props.componentName || 'Unknown'}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      // Show success feedback (you could use a toast notification here)
      console.log('Error details copied to clipboard');
    } catch (err) {
      console.warn('Failed to copy error details');
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
      }

      // Default fallback UI based on error level
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }

  private renderDefaultFallback() {
    const { level = 'component', componentName } = this.props;
    const { error, eventId } = this.state;

    if (level === 'widget') {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Widget Error</span>
          </div>
          <p className="text-xs text-red-600 mb-2">
            {componentName || 'Component'} failed to render
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={this.handleReset}
            className="text-red-600 border-red-300 hover:bg-red-100"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      );
    }

    if (level === 'component') {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-800">Component Error</CardTitle>
              </div>
              <Badge variant="outline" className="text-red-600 border-red-300">
                {eventId}
              </Badge>
            </div>
            <CardDescription className="text-red-600">
              {componentName || 'This component'} encountered an unexpected error and couldn't render properly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-100 rounded border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">Error Details:</p>
                <p className="text-xs text-red-700 font-mono">{error?.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={this.handleReset}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.copyErrorDetails}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Page level error
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-red-200 bg-red-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">Application Error</CardTitle>
            <CardDescription className="text-red-600">
              We're sorry, but something went wrong. The error has been logged and our team has been notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-100 rounded border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error ID:</span>
              </div>
              <p className="text-sm font-mono text-red-700">{eventId}</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={this.handleReload}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={this.copyErrorDetails}
                className="w-full text-red-600 hover:bg-red-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Error Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryWithLoggingProps, 'children'>
) {
  const ComponentWithErrorBoundary = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps} componentName={Component.name}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return ComponentWithErrorBoundary;
}

// Specialized error boundaries for different use cases
export const PageErrorBoundary: React.FC<{ children: React.ReactNode; pageName?: string }> = ({
  children,
  pageName
}) => (
  <ErrorBoundary level="page" componentName={pageName}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{
  children: React.ReactNode;
  componentName?: string;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}> = ({ children, componentName, fallback }) => (
  <ErrorBoundary level="component" componentName={componentName} fallback={fallback}>
    {children}
  </ErrorBoundary>
);

export const WidgetErrorBoundary: React.FC<{ children: React.ReactNode; widgetName?: string }> = ({
  children,
  widgetName
}) => (
  <ErrorBoundary level="widget" componentName={widgetName}>
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
