import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  CreditCard, 
  Users, 
  Calendar, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  Table as TableIcon
} from 'lucide-react';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  selectedTable, 
  selectedDate, 
  selectedTime,
  onSubmit ,
  setFormData,
  formData
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const [paymentformData, setPaymentFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep(3);
    setBookingConfirmed(true);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const renderBookingDetails = () => (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg space-y-3">
      <div className="flex items-center text-sm">
        <Calendar className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-gray-600">Date:</span>
        <span className="ml-auto font-medium">{selectedDate?.toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-sm">
        <Clock className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-gray-600">Time:</span>
        <span className="ml-auto font-medium">{selectedTime}</span>
      </div>
      <div className="flex items-center text-sm">
        <TableIcon className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-gray-600">Table:</span>
        <span className="ml-auto font-medium">{selectedTable?.tableNumber}</span>
      </div>
      <div className="flex items-center text-sm">
        <Users className="w-4 h-4 mr-2 text-purple-600" />
        <span className="text-gray-600">Capacity:</span>
        <span className="ml-auto font-medium">{selectedTable?.capacity} guests</span>
      </div>
    </div>
  );

  const steps = {
    1: (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-500">
            Book Table {selectedTable?.tableNumber}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className='text-blue-400'>Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-purple-200 focus:border-purple-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className='text-blue-400' htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-purple-200 focus:border-purple-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className='text-blue-400' htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="border-purple-200 focus:border-purple-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className='text-blue-400'htmlFor="specialRequests">Special Requests</Label>
            <Input
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              className="border-purple-200 focus:border-purple-500"
            />
          </div>

          {renderBookingDetails()}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={onSubmit}
          >
            Proceed to Payment
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-500">
            Payment Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-4">
          <Card className="p-4 border-2 border-purple-200">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className='text-blue-400' htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentformData.cardNumber}
                    onChange={(e) => {
                      const formattedValue = formatCardNumber(e.target.value.slice(0, 19));
                      setPaymentFormData(prev => ({ ...prev, cardNumber: formattedValue }));
                    }}
                    className="pl-10 border-purple-200 focus:border-purple-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className='text-blue-400'htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentformData.expiryDate}
                    onChange={handlePaymentInputChange}
                    placeholder="MM/YY"
                    className="border-purple-200 focus:border-purple-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className='text-blue-400' htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    maxLength="3"
                    value={paymentformData.cvv}
                    onChange={handlePaymentInputChange}
                    className="border-purple-200 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className='text-blue-400' htmlFor="cardName">Name on Card</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  value={paymentformData.cardName}
                  onChange={handlePaymentInputChange}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
            </div>
          </Card>

          {renderBookingDetails()}

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-purple-500">$50.00</span>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            disabled={loading}
        
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    ),
    3: (
      <div className="space-y-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-500">
            Booking Confirmed!
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-800">
            Thank you, {formData.name}!
          </p>
          <p className="text-green-200">
            Your booking has been confirmed. A confirmation email has been sent to {formData.email}
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Booking Reference</p>
                <p className="font-medium text-gray-800">BK{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-800">
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Table</p>
                <p className="font-medium text-gray-800">Table {selectedTable?.tableNumber} ({selectedTable?.capacity} guests)</p>
              </div>
              <div>
                <p className="text-gray-500">Amount Paid</p>
                <p className="font-medium text-gray-800">$50.00</p>
              </div>
            </div>

            {formData.specialRequests && (
              <div className="text-left">
                <p className="text-gray-500">Special Requests</p>
                <p className="font-medium text-gray-800">{formData.specialRequests}</p>
              </div>
            )}
          </div>
        </Card>

        <Button 
          onClick={()=>{
            onClose()
            setStep(1)
            setPaymentFormData({ specialRequests: '',
              cardNumber: '',
              expiryDate: '',
              cvv: '',
              cardName: ''})
            setFormData({
              name: '',
              email: '',
              phone: '',
             
            })
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"

        >
          Close
        </Button>
      </div>
    )
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {steps[step]}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;