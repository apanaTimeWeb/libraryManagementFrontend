'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockBlacklist, mockPlans, mockCoupons, mockSeats, mockStudents } from '@/lib/opsData';
import { toast } from 'sonner';
import { AlertCircle, Check, Upload, X } from 'lucide-react';

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
    photo: null as File | null,
    documents: [] as File[],
    shift: 'Morning',
    isHybrid: false,
    customSlots: [] as any[],
    seat: '',
    plan: '',
    coupon: '',
    discount: 0,
    addSibling: false,
    linkedStudentId: '',
    relationship: '',
    isGuardian: false,
    securityDeposit: 500,
    paymentMode: 'cash',
    transactionId: '',
  });
  const [phoneBlacklisted, setPhoneBlacklisted] = useState(false);
  const [phoneDuplicate, setPhoneDuplicate] = useState(false);
  const [seatConflict, setSeatConflict] = useState(false);

  const handlePhoneBlur = () => {
    // Check blacklist
    const blacklisted = mockBlacklist.find(b => b.phone === formData.phone);
    if (blacklisted) {
      setPhoneBlacklisted(true);
      toast.error(`Phone blacklisted: ${blacklisted.reason}`);
      return;
    } else {
      setPhoneBlacklisted(false);
    }

    // Check duplicate
    const duplicate = mockStudents.find(s => s.phone === formData.phone);
    if (duplicate) {
      setPhoneDuplicate(true);
      toast.warning(`Phone already exists for ${duplicate.name}`);
    } else {
      setPhoneDuplicate(false);
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
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" />
            </div>
            <div>
              <Label>Phone (E.164 format) *</Label>
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onBlur={handlePhoneBlur}
                placeholder="+919876543210"
              />
              {phoneBlacklisted && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  This phone number is blacklisted
                </div>
              )}
              {phoneDuplicate && (
                <div className="flex items-center gap-2 mt-2 text-orange-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Phone number already exists in system
                </div>
              )}
            </div>
            <div>
              <Label>Parent Phone</Label>
              <Input value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} placeholder="+919123456789" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="student@example.com" />
            </div>
            <div>
              <Label>College</Label>
              <Input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} placeholder="College name" />
            </div>
            <div>
              <Label>Photo Upload</Label>
              <div className="flex items-center gap-2">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                />
                {formData.photo && <Badge variant="outline">{formData.photo.name}</Badge>}
              </div>
            </div>
            <div>
              <Label>Documents (Aadhar, ID Proof)</Label>
              <Input 
                type="file" 
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({ ...formData, documents: Array.from(e.target.files || []) })}
              />
              {formData.documents.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.documents.map((doc, idx) => (
                    <Badge key={idx} variant="outline">{doc.name}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Seat & Shift */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Shift *</Label>
              <RadioGroup value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value, isHybrid: value === 'Hybrid' })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Morning" id="morning" />
                  <Label htmlFor="morning">Morning (6:00 AM - 2:00 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Evening" id="evening" />
                  <Label htmlFor="evening">Evening (2:00 PM - 10:00 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">Hybrid (Custom Schedule)</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.isHybrid && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                <Label>Custom Slot Builder</Label>
                <p className="text-sm text-slate-600">Select days and time slots for hybrid schedule</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox id={day} />
                      <Label htmlFor={day} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <Input type="time" className="text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <Input type="time" className="text-sm" />
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Select Seat (Visual Grid)</Label>
              <div className="grid grid-cols-10 gap-2 mt-2 max-h-64 overflow-y-auto p-2 border rounded">
                {mockSeats.slice(0, 50).map(seat => {
                  const isAvailable = seat.status === 'available';
                  const isOccupied = seat.status === 'occupied';
                  const isMaintenance = seat.status === 'maintenance';
                  
                  return (
                    <Button
                      key={seat.id}
                      size="sm"
                      variant={formData.seat === seat.number ? 'default' : 'outline'}
                      onClick={() => {
                        if (isMaintenance) {
                          toast.warning('This seat is under maintenance. Proceed anyway?');
                        }
                        if (isOccupied) {
                          setSeatConflict(true);
                          toast.error('Seat occupied for selected time slot');
                          return;
                        }
                        setFormData({ ...formData, seat: seat.number });
                        setSeatConflict(false);
                      }}
                      className={`h-10 ${
                        isAvailable ? 'bg-green-50 hover:bg-green-100' :
                        isOccupied ? 'bg-red-50 border-red-300 cursor-not-allowed' :
                        'bg-orange-50 border-orange-300'
                      }`}
                      disabled={isOccupied}
                    >
                      {seat.number}
                    </Button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-green-500 rounded" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-red-500 rounded" />
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-orange-500 rounded" />
                  <span>Maintenance</span>
                </div>
              </div>
              {seatConflict && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Seat conflict detected for selected time slot
                </div>
              )}
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
            <div className="flex items-center justify-between">
              <div>
                <Label>Add Sibling?</Label>
                <p className="text-xs text-slate-500">Link to existing student as family member</p>
              </div>
              <Switch
                checked={formData.addSibling}
                onCheckedChange={(checked) => setFormData({ ...formData, addSibling: checked })}
              />
            </div>

            {formData.addSibling && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label>Search Existing Student</Label>
                  <Input
                    placeholder="Search by name or Smart ID..."
                    onChange={(e) => {
                      const query = e.target.value.toLowerCase();
                      const found = mockStudents.find(s => 
                        s.name.toLowerCase().includes(query) || 
                        s.smartId.toLowerCase().includes(query)
                      );
                      if (found) {
                        setFormData({ ...formData, linkedStudentId: found.id });
                      }
                    }}
                  />
                </div>

                {formData.linkedStudentId && (
                  <div className="p-3 bg-white rounded border">
                    <p className="font-medium">
                      {mockStudents.find(s => s.id === formData.linkedStudentId)?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {mockStudents.find(s => s.id === formData.linkedStudentId)?.smartId}
                    </p>
                  </div>
                )}

                <div>
                  <Label>Relationship</Label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select relationship</option>
                    <option value="sibling">Sibling</option>
                    <option value="parent">Parent</option>
                    <option value="spouse">Spouse</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guardian"
                    checked={formData.isGuardian}
                    onCheckedChange={(checked) => setFormData({ ...formData, isGuardian: checked as boolean })}
                  />
                  <Label htmlFor="guardian" className="text-sm">
                    Set as Guardian (auto-mark dependents)
                  </Label>
                </div>
              </div>
            )}

            {!formData.addSibling && (
              <p className="text-sm text-slate-500 text-center py-4">Skip this step to continue without family linking</p>
            )}
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
