'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Student } from '@/lib/types/ops-types';
import { useRoleStore } from '@/lib/stores/role-store';
import { toast } from 'sonner';
import { PTPModal } from './ptp-modal';
import { mockCoupons } from '@/lib/opsData';

interface CollectFeeModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

export function CollectFeeModal({ student, open, onClose }: CollectFeeModalProps) {
  const { isManager } = useRoleStore();
  const [applyLateFee, setApplyLateFee] = useState(student?.lateFeeApplicable || false);
  const [amount, setAmount] = useState(student?.dueAmount || 0);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [transactionId, setTransactionId] = useState('');
  const [showPTP, setShowPTP] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  if (!student) return null;

  const lateFee = 50;
  const totalAmount = amount + (applyLateFee ? lateFee : 0) - couponDiscount;

  const validateCoupon = () => {
    const coupon = mockCoupons.find(c => c.code === couponCode && c.isActive);
    if (coupon) {
      const discount = coupon.discountType === 'fixed' 
        ? coupon.discountValue 
        : amount * (coupon.discountValue / 100);
      setCouponDiscount(discount);
      toast.success(`Coupon applied! ₹${discount} discount`);
    } else {
      toast.error('Invalid or expired coupon');
      setCouponDiscount(0);
    }
  };

  const handleCollect = () => {
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }
    if (amount > student.dueAmount) {
      toast.error('Amount cannot exceed due amount');
      return;
    }
    if (paymentMode !== 'cash' && !transactionId) {
      toast.error('Transaction ID required for digital payments');
      return;
    }
    toast.success(`₹${totalAmount} collected from ${student.name}. Receipt sent via WhatsApp.`);
    onClose();
  };

  const handlePTP = () => {
    if (!ptpDate) {
      toast.error('Please select a promise date');
      return;
    }
    toast.success(`Promise to Pay recorded for ${student.name}`);
    onClose();
  };

  if (showPTP) {
    return <PTPModal student={student} open={open} onClose={() => { setShowPTP(false); onClose(); }} />;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect Fee</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-slate-500">{student.smartId}</p>
          </div>

          {/* Invoice */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Due Amount:</span>
              <span className="font-medium">₹{student.dueAmount}</span>
            </div>
            
            {/* Late Fee Toggle */}
            {student.lateFeeApplicable && (
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="late-fee">Apply Late Fee (₹{lateFee})</Label>
                  <p className="text-xs text-slate-500">Payment overdue</p>
                </div>
                <Switch
                  id="late-fee"
                  checked={applyLateFee}
                  onCheckedChange={setApplyLateFee}
                  disabled={!isManager()}
                />
              </div>
            )}

            {/* Coupon Input */}
            <div>
              <Label>Coupon Code (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                />
                <Button onClick={validateCoupon} variant="outline">Apply</Button>
              </div>
              {couponDiscount > 0 && (
                <p className="text-sm text-green-600 mt-1">Discount applied: ₹{couponDiscount}</p>
              )}
            </div>

            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <Label>Amount to Pay</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              max={student.dueAmount}
            />
          </div>

          <div>
            <Label>Payment Mode</Label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>

          {paymentMode !== 'cash' && (
            <div>
              <Label>Transaction ID</Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPTP(true)} className="flex-1">
              Can't Pay Now?
            </Button>
            <Button onClick={handleCollect} className="flex-1">
              Collect ₹{totalAmount}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
