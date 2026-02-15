'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockBlacklist, mockPlans, mockCoupons, mockSeats } from '@/lib/opsData';
import { toast } from 'sonner';
import { AlertCircle, Check } from 'lucide-react';

interface AdmissionWizardProps {
  open: boolean;
  onClose: () => void;
}

export function AdmissionWizard({ open, onClose }: AdmissionWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    parentPhone: '',
    email: '',
    college: '',
    shift: 'Morning',
    seat: '',
    plan: '',
    coupon: '',
    discount: 0,
    securityDeposit: 500,
    paymentMode: 'cash',
    transactionId: '',
  });
  const [phoneBlacklisted, setPhoneBlacklisted] = useState(false);

  const handlePhoneBlur = () => {
    const blacklisted = mockBlacklist.find(b => b.phone === formData.phone);
    if (blacklisted) {
      setPhoneBlacklisted(true);
      toast.error(`Phone blacklisted: ${blacklisted.reason}`);
    } else {
      setPhoneBlacklisted(false);
    }
  };

  const validateCoupon = () => {
    const coupon = mockCoupons.find(c => c.code === formData.coupon && c.isActive);
    if (coupon) {
      const discount = coupon.discountType === 'fixed' ? coupon.discountValue : 
                      (selectedPlan?.price || 0) * (coupon.discountValue / 100);
      setFormData({ ...formData, discount });
      toast.success(`Coupon applied! ₹${discount} discount`);
    } else {
      toast.error('Invalid or expired coupon');
    }
  };

  const selectedPlan = mockPlans.find(p => p.id === formData.plan);
  const totalAmount = (selectedPlan?.price || 0) + formData.securityDeposit - formData.discount;

  const handleSubmit = () => {
    toast.success('Admission completed! Smart ID: LIB051');
    onClose();
  };

  const steps = [
    { number: 1, title: 'Personal Details' },
    { number: 2, title: 'Seat & Shift' },
    { number: 3, title: 'Plan & Discount' },
    { number: 4, title: 'Family Link' },
    { number: 5, title: 'Payment' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Admission</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className={`flex items-center gap-2 ${step >= s.number ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step > s.number ? 'bg-blue-600 text-white' : 
                  step === s.number ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 
                  'bg-slate-100'
                }`}>
                  {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
              </div>
              {idx < steps.length - 1 && <div className="w-8 h-0.5 bg-slate-200 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={handlePhoneBlur}
              />
              {phoneBlacklisted && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  This phone number is blacklisted
                </div>
              )}
            </div>
            <div>
              <Label>Parent Phone</Label>
              <Input value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <Label>College</Label>
              <Input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} />
            </div>
          </div>
        )}

        {/* Step 2: Seat & Shift */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Shift *</Label>
              <div className="flex gap-2 mt-2">
                {['Morning', 'Evening'].map(shift => (
                  <Button
                    key={shift}
                    variant={formData.shift === shift ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, shift })}
                  >
                    {shift}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Select Seat</Label>
              <div className="grid grid-cols-10 gap-2 mt-2 max-h-64 overflow-y-auto p-2 border rounded">
                {mockSeats.filter(s => s.status === 'available').slice(0, 30).map(seat => (
                  <Button
                    key={seat.id}
                    size="sm"
                    variant={formData.seat === seat.number ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, seat: seat.number })}
                    className="h-10"
                  >
                    {seat.number}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Plan & Discount */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Select Plan *</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {mockPlans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setFormData({ ...formData, plan: plan.id })}
                    className={`p-4 border-2 rounded-lg cursor-pointer ${
                      formData.plan === plan.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                    }`}
                  >
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{plan.price}</p>
                    <ul className="text-xs text-slate-600 mt-2 space-y-1">
                      {plan.features.map(f => <li key={f}>• {f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Coupon Code</Label>
              <div className="flex gap-2">
                <Input 
                  value={formData.coupon} 
                  onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                  placeholder="Enter coupon code"
                />
                <Button onClick={validateCoupon}>Validate</Button>
              </div>
              {formData.discount > 0 && (
                <Badge className="mt-2">Discount: ₹{formData.discount}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Family Link */}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Family linking will be available after admission is complete.</p>
            <Button variant="outline" disabled>Add Sibling</Button>
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Plan Fee:</span>
                  <span>₹{selectedPlan?.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span>₹{formData.securityDeposit}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{formData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>
            <div>
              <Label>Payment Mode *</Label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>
            </div>
            {formData.paymentMode !== 'cash' && (
              <div>
                <Label>Transaction ID *</Label>
                <Input 
                  value={formData.transactionId} 
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
            Previous
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep(step + 1)} disabled={phoneBlacklisted}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Complete Admission
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
