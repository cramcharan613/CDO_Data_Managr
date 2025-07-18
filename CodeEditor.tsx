import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Code2, 
  Terminal, 
  FileCode,
  Zap,
  Bug,
  CheckCircle
} from 'lucide-react';

export const CodeEditor = memo(function CodeEditor() {
  const [activeFile, setActiveFile] = useState('sql');
  const [isRunning, setIsRunning] = useState(false);

  const codeFiles = {
    sql: {
      name: 'data_transform.sql',
      language: 'SQL',
      content: `-- Customer Data Transformation
SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    c.created_at,
    COUNT(o.order_id) as total_orders,
    SUM(o.amount) as total_spent,
    AVG(o.amount) as avg_order_value,
    MAX(o.created_at) as last_order_date
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.status = 'active'
    AND c.created_at >= '2023-01-01'
GROUP BY 
    c.customer_id,
    c.first_name, 
    c.last_name,
    c.email,
    c.created_at
HAVING COUNT(o.order_id) > 0
ORDER BY total_spent DESC;`
    },
    python: {
      name: 'data_processor.py',
      language: 'Python',
      content: `import pandas as pd
import numpy as np
from datetime import datetime
import logging

class DataProcessor:
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
    def clean_customer_data(self, df):
        """Clean and validate customer data"""
        # Remove duplicates
        df = df.drop_duplicates(subset=['customer_id'])
        
        # Handle missing values
        df['first_name'] = df['first_name'].fillna('Unknown')
        df['last_name'] = df['last_name'].fillna('Unknown')
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        df['email_valid'] = df['email'].str.match(email_pattern)
        
        # Calculate customer age
        df['account_age_days'] = (
            datetime.now() - pd.to_datetime(df['created_at'])
        ).dt.days
        
        self.logger.info(f"Processed {len(df)} customer records")
        return df
        
    def run_quality_checks(self, df):
        """Run data quality validation"""
        checks = {
            'missing_email': df['email'].isnull().sum(),
            'invalid_email': (~df['email_valid']).sum(),
            'duplicate_customers': df.duplicated(subset=['customer_id']).sum(),
            'negative_amounts': (df['total_spent'] < 0).sum() if 'total_spent' in df else 0
        }
        
        return checks`
    },
    javascript: {
      name: 'api_client.js',
      language: 'JavaScript',
      content: `class DataPlatformAPI {
    constructor(baseURL, apiKey) {
        this.baseURL = baseURL;
        this.apiKey = apiKey;
        this.headers = {
            'Authorization': \`Bearer \${apiKey}\`,
            'Content-Type': 'application/json'
        };
    }
    
    async getDatasets() {
        try {
            const response = await fetch(\`\${this.baseURL}/datasets\`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch datasets:', error);
            throw error;
        }
    }
    
    async runWorkflow(workflowId, parameters = {}) {
        try {
            const response = await fetch(\`\${this.baseURL}/workflows/\${workflowId}/run\`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(parameters)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Failed to run workflow:', error);
            throw error;
        }
    }
    
    async monitorJobStatus(jobId) {
        const pollInterval = 2000; // 2 seconds
        
        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    const response = await fetch(\`\${this.baseURL}/jobs/\${jobId}\`, {
                        headers: this.headers
                    });
                    
                    const job = await response.json();
                    
                    if (job.status === 'completed') {
                        resolve(job);
                    } else if (job.status === 'failed') {
                        reject(new Error(job.error));
                    } else {
                        setTimeout(poll, pollInterval);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            poll();
        });
    }
}`
    }
  };

  const runResults = {
    sql: {
      status: 'success',
      executionTime: '1.24s',
      rowsAffected: 847392,
      message: 'Query executed successfully'
    },
    python: {
      status: 'success',
      executionTime: '3.45s',
      rowsAffected: 2400000,
      message: 'Data processing completed'
    },
    javascript: {
      status: 'success',
      executionTime: '0.89s',
      rowsAffected: null,
      message: 'API client initialized successfully'
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Code Editor</h1>
          <p className="text-muted-foreground">
            Write and execute custom data processing logic
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            Save
          </Button>
          <Button 
            className="gap-2" 
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Terminal className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Code Editor */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <Tabs value={activeFile} onValueChange={setActiveFile}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sql" className="gap-2">
                  <FileCode className="w-4 h-4" />
                  SQL
                </TabsTrigger>
                <TabsTrigger value="python" className="gap-2">
                  <Code2 className="w-4 h-4" />
                  Python
                </TabsTrigger>
                <TabsTrigger value="javascript" className="gap-2">
                  <Terminal className="w-4 h-4" />
                  JavaScript
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={activeFile} onValueChange={setActiveFile}>
              {Object.entries(codeFiles).map(([key, file]) => (
                <TabsContent key={key} value={key}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4" />
                        <span className="font-medium">{file.name}</span>
                        <Badge variant="secondary">{file.language}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          No Issues
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="text-sm font-mono whitespace-pre-wrap">
                        <code>{file.content}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Execution Results & Tools */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Execution Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">
                  {runResults[activeFile as keyof typeof runResults].status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Execution Time:</span>
                  <span>{runResults[activeFile as keyof typeof runResults].executionTime}</span>
                </div>
                
                {runResults[activeFile as keyof typeof runResults].rowsAffected && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rows Affected:</span>
                    <span>{runResults[activeFile as keyof typeof runResults].rowsAffected?.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  {runResults[activeFile as keyof typeof runResults].message}
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Code Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Bug className="w-4 h-4" />
                    Debug
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Zap className="w-4 h-4" />
                    Optimize
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Terminal className="w-4 h-4" />
                    Test
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default CodeEditor;