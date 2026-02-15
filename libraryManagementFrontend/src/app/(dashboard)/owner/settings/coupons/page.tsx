'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { coupons, plans } from '@/lib/mockData';
import { Plus, Edit, Trash2, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function CouponsPage() {
  const [couponsData, setCouponsData] = useState(coupons);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const generateCode = () => `SAVE${Math.floor(Math.random() * 1000)}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCoupon = {
      id: `cpn-${couponsData.length + 1}`,
      code: formData.get('code') as string,
      discount: Number(formData.get('discount')),
      discountType: formData.get('discountType') as 'fixed' | 'percentage',
      validFrom: formData.get('validFrom') as string,
      validTill: formData.get('validTill') as string,
      maxUses: Number(formData.get('maxUses')),
      usedCount: 0,
      isActive: true,
    };
    setCouponsData([newCoupon, ...couponsData]);
    toast.success('Coupon created successfully');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupon Manager</h1>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Coupon</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Coupon Code *</Label>
                  <div className="flex gap-2">
                    <Input name="code" required defaultValue={generateCode()} />
                    <Button type="button" variant="outline" onClick={(e) => {
                      const input = e.currentTarget.parentElement?.querySelector('input');
                      if (input) input.value = generateCode();
                    }}>Generate</Button>
                  </div>
                </div>
                <div>
                  <Label>Discount Type *</Label>
                  <select name="discountType" required className="w-full border rounded-md p-2">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <Label>Discount Value *</Label>
                  <Input type="number" name="discount" required />
                </div>
                <div>
                  <Label>Max Uses</Label>
                  <Input type="number" name="maxUses" defaultValue="100" />
                </div>
                <div>
                  <Label>Valid From *</Label>
                  <Input type="date" name="validFrom" required />
                </div>
                <div>
                  <Label>Valid Till *</Label>
                  <Input type="date" name="validTill" required />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea name="description" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Create Coupon</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {couponsData.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Ticket className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-lg">{coupon.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {coupon.discountType === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Valid: {format(new Date(coupon.validFrom), 'MMM dd')} - {format(new Date(coupon.validTill), 'MMM dd')}</p>
                    <p>Used: {coupon.usedCount} / {coupon.maxUses}</p>
                  </div>
                  <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
