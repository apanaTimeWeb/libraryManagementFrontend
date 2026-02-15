'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { plans, subscriptions } from '@/lib/mockData';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface PlanForm {
  name: string;
  duration: 'daily' | 'monthly' | 'quarterly' | 'yearly';
  price: number;
  features: string;
  isActive: boolean;
}

export default function PlansPage() {
  const [plansData, setPlansData] = useState(plans);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<typeof plans[0] | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<PlanForm>();

  const getStudentCount = (planId: string) => {
    return subscriptions.filter(s => s.planId === planId && s.status === 'active').length;
  };

  const onSubmit = (data: PlanForm) => {
    if (editingPlan) {
      setPlansData(plansData.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...data, features: data.features.split(',').map(f => f.trim()) }
          : p
      ));
      toast.success('Plan updated successfully');
      setEditingPlan(null);
    } else {
      const newPlan = {
        id: `pln-${plansData.length + 1}`,
        ...data,
        features: data.features.split(',').map(f => f.trim()),
      };
      setPlansData([...plansData, newPlan]);
      toast.success('Plan created successfully');
      setIsAddOpen(false);
    }
    reset();
  };

  const handleEdit = (plan: typeof plans[0]) => {
    setEditingPlan(plan);
    setValue('name', plan.name);
    setValue('duration', plan.duration);
    setValue('price', plan.price);
    setValue('features', plan.features.join(', '));
    setValue('isActive', plan.isActive);
  };

  const handleDeactivate = (planId: string) => {
    setPlansData(plansData.map(p => 
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
    toast.success('Plan status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plan Manager</h1>
          <p className="text-muted-foreground">
            Create and manage subscription plans
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Plan Name *</Label>
                  <Input {...register('name', { required: true, minLength: 3 })} placeholder="Monthly Basic" />
                </div>
                <div>
                  <Label>Duration *</Label>
                  <select {...register('duration', { required: true })} className="w-full border rounded-md p-2">
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <Label>Price (₹) *</Label>
                  <Input type="number" {...register('price', { required: true, min: 1 })} placeholder="800" />
                </div>
                <div className="md:col-span-2">
                  <Label>Features (comma-separated)</Label>
                  <Textarea {...register('features')} placeholder="AC, WiFi, Locker, Printing" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch {...register('isActive')} defaultChecked />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Create Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plansData.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">{plan.duration}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-lg text-foreground">₹{plan.price}</span>
                    <span>•</span>
                    <span>{getStudentCount(plan.id)} students</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {plan.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={editingPlan?.id === plan.id} onOpenChange={(open) => !open && setEditingPlan(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Plan</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Plan Name *</Label>
                            <Input {...register('name', { required: true, minLength: 3 })} />
                          </div>
                          <div>
                            <Label>Duration *</Label>
                            <select {...register('duration', { required: true })} className="w-full border rounded-md p-2">
                              <option value="daily">Daily</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="yearly">Yearly</option>
                            </select>
                          </div>
                          <div>
                            <Label>Price (₹) *</Label>
                            <Input type="number" {...register('price', { required: true, min: 1 })} />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Features (comma-separated)</Label>
                            <Textarea {...register('features')} />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch {...register('isActive')} />
                            <Label>Active</Label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
                          <Button type="submit">Update Plan</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeactivate(plan.id)}
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
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
