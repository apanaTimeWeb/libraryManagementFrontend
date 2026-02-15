'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Power, Download, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkActionsToolbarProps<T> {
  selectedCount: number;
  selectedRows: T[];
  onClearSelection: () => void;
  onExport?: (rows: T[]) => void;
  onBulkActivate?: (rows: T[]) => Promise<void>;
  onBulkDeactivate?: (rows: T[]) => Promise<void>;
  onBulkDelete?: (rows: T[]) => Promise<void>;
  entityName?: string;
}

export function BulkActionsToolbar<T>({
  selectedCount,
  selectedRows,
  onClearSelection,
  onExport,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
  entityName = 'item',
}: BulkActionsToolbarProps<T>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkAction = async (
    action: (rows: T[]) => Promise<void>,
    actionName: string
  ) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const total = selectedRows.length;
      for (let i = 0; i < total; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(((i + 1) / total) * 100);
      }
      
      await action(selectedRows);
      
      toast.success(`Successfully ${actionName} ${selectedCount} ${entityName}(s)`);
      onClearSelection();
    } catch (error) {
      toast.error(`Failed to ${actionName} ${entityName}s`, {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-muted px-4 py-3">
      <div>
        <p className="text-sm font-medium">{selectedCount} {entityName}(s) selected</p>
        {isProcessing && (
          <div className="mt-2 w-48">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Processing... {Math.round(progress)}%</p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          <XCircle className="mr-2 h-4 w-4" /> Clear
        </Button>
        
        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport(selectedRows)}
            disabled={isProcessing}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        )}
        
        {onBulkActivate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction(onBulkActivate, 'activated')}
            disabled={isProcessing}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Activate
          </Button>
        )}
        
        {onBulkDeactivate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction(onBulkDeactivate, 'deactivated')}
            disabled={isProcessing}
          >
            <Power className="mr-2 h-4 w-4" /> Deactivate
          </Button>
        )}
        
        {onBulkDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleBulkAction(onBulkDelete, 'deleted')}
            disabled={isProcessing}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}
