'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assets } from '@/lib/mockData';
import { Plus, Wrench, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AssetsPage() {
  const [assetsData, setAssetsData] = useState(assets);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newAsset = {
      id: `ast-${assetsData.length + 1}`,
      branchId: 'br-del-001',
      name: formData.get('name') as string,
      category: formData.get('category') as any,
      purchaseDate: formData.get('purchaseDate') as string,
      purchasePrice: Number(formData.get('purchasePrice')),
      currentValue: Number(formData.get('purchasePrice')),
      status: 'active' as const,
      notes: formData.get('notes') as string,
    };
    setAssetsData([newAsset, ...assetsData]);
    toast.success('Asset added successfully');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets & Maintenance</h1>
          <p className="text-muted-foreground">Track branch assets and maintenance</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Asset</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Asset Name *</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Category *</Label>
                <select name="category" required className="w-full border rounded-md p-2">
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Purchase Date</Label>
                  <Input type="date" name="purchaseDate" />
                </div>
                <div>
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" name="purchasePrice" />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea name="notes" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Add Asset</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assetsData.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{asset.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{asset.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Purchase Price</p>
                    <p className="font-semibold">₹{asset.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="font-semibold">₹{asset.currentValue.toLocaleString()}</p>
                  </div>
                  <Badge variant={asset.status === 'active' ? 'default' : 'secondary'}>
                    {asset.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAsset(asset)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
