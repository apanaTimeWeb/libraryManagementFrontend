'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { expenses, branches } from '@/lib/mockData';
import { Plus, Receipt, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, startOfMonth, isAfter } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function ExpensesPage() {
  const branch = branches[0];
  const [expensesData, setExpensesData] = useState(expenses.filter(e => e.branchId === branch.id));
  const [isAddOpen, setIsAddOpen] = useState(false);

  const currentMonth = startOfMonth(new Date());
  const monthlyExpenses = expensesData.filter(e => isAfter(new Date(e.date), currentMonth));

  const budgetByCategory = {
    rent: { budget: 45000, spent: monthlyExpenses.filter(e => e.category === 'rent').reduce((sum, e) => sum + e.amount, 0) },
    utilities: { budget: 15000, spent: monthlyExpenses.filter(e => e.category === 'utilities').reduce((sum, e) => sum + e.amount, 0) },
    salaries: { budget: 35000, spent: monthlyExpenses.filter(e => e.category === 'salaries').reduce((sum, e) => sum + e.amount, 0) },
    maintenance: { budget: 10000, spent: monthlyExpenses.filter(e => e.category === 'maintenance').reduce((sum, e) => sum + e.amount, 0) },
    marketing: { budget: 8000, spent: monthlyExpenses.filter(e => e.category === 'marketing').reduce((sum, e) => sum + e.amount, 0) },
  };

  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage < 80) return 'bg-green-600';
    if (percentage < 100) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense = {
      id: `exp-${expensesData.length + 1}`,
      branchId: branch.id,
      category: formData.get('category') as any,
      amount: Number(formData.get('amount')),
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      vendorName: formData.get('vendorName') as string,
      billNumber: formData.get('billNumber') as string,
      gstAmount: Number(formData.get('gstAmount')),
      paymentMode: formData.get('paymentMode') as any,
      receiptUrl: '/receipts/new.pdf',
    };
    setExpensesData([newExpense, ...expensesData]);
    toast.success('Expense added successfully');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track and manage branch expenses</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Category *</Label>
                  <select name="category" required className="w-full border rounded-md p-2">
                    <option value="rent">Rent</option>
                    <option value="utilities">Utilities</option>
                    <option value="salaries">Salaries</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input type="number" name="amount" required />
                </div>
                <div>
                  <Label>Expense Date *</Label>
                  <Input type="date" name="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required />
                </div>
                <div>
                  <Label>Payment Mode *</Label>
                  <select name="paymentMode" required className="w-full border rounded-md p-2">
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <Label>Vendor Name</Label>
                  <Input name="vendorName" />
                </div>
                <div>
                  <Label>Bill Number</Label>
                  <Input name="billNumber" />
                </div>
                <div>
                  <Label>GST Amount (₹)</Label>
                  <Input type="number" name="gstAmount" defaultValue="0" />
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea name="description" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Add Expense</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(budgetByCategory).map(([category, data]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{data.spent.toLocaleString()}</div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getProgressColor(data.spent, data.budget)}`}
                  style={{ width: `${Math.min((data.spent / data.budget) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Budget: ₹{data.budget.toLocaleString()} ({Math.round((data.spent / data.budget) * 100)}%)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expensesData.slice(0, 20).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{expense.description || expense.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expense.date), 'MMM dd, yyyy')} • {expense.vendorName || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">{expense.category}</Badge>
                  <div className="text-right">
                    <p className="font-semibold">₹{expense.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground capitalize">{expense.paymentMode}</p>
                  </div>
                  <Button variant="ghost" size="sm">
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
