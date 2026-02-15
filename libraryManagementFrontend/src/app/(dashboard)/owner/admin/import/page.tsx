'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const handleDownloadTemplate = () => {
    toast.success('Template downloaded');
  };

  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setImporting(false);
          setResult({ success: 45, failed: 5 });
          toast.success('Import completed');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Import</h1>
        <p className="text-muted-foreground">Import students from CSV/Excel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download the template file and fill in student details
          </p>
          <Button onClick={handleDownloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <input 
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" as="span">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </label>
            {file && (
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {file.name}
              </p>
            )}
          </div>

          {file && !importing && !result && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">Preview (First 3 rows)</p>
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-4 gap-2 font-medium">
                    <span>Name</span>
                    <span>Phone</span>
                    <span>Email</span>
                    <span>Status</span>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="grid grid-cols-4 gap-2 text-muted-foreground">
                      <span>Student {i}</span>
                      <span>+9198765432{i}</span>
                      <span>student{i}@email.com</span>
                      <span className="text-green-600">✓ Valid</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleImport} className="w-full">
                Start Import
              </Button>
            </div>
          )}

          {importing && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Importing students...</p>
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          )}

          {result && (
            <div className="border rounded-lg p-4 space-y-3">
              <p className="font-medium">Import Complete</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{result.success}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Download Error Report</Button>
                <Button variant="outline" size="sm">Rollback</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
