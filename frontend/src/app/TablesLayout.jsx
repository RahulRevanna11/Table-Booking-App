'use client'
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from 'lucide-react';
import './globals.css';
import BookingModal from './Booking';
const TablesLayout = () => {
  // State declarations remain the same
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotAvailability, setSlotAvailability] = useState({});

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Constants and API functions remain the same
  const API_URL = process.env.NEXT_PUBLIC_API_URL 
  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  // Existing useEffect and fetch functions remain unchanged
  useEffect(() => {
    fetchTables();
    fetchAllSlotsAvailability()
  }, []);
  useEffect(() => {
    setBookings({})
    fetchAllSlotsAvailability()

  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAvailability();
    }
  }, [selectedDate, selectedTime]);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/tables`);
      const data = await response.json();
      if (data.status === 'success') {
        setTables(data.data);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(
        `${API_URL}/tables/availability?date=${selectedDate.toISOString()}&time=${selectedTime}`
      );
      const data = await response.json();
      // console.log(data);
      setBookings({})
      if (data.status === 'success') {
        const bookingsMap = {};
        data.data.forEach(table => {
          if (!table.isAvailable) {
            if (!bookingsMap[selectedTime]) {
              bookingsMap[selectedTime] = [];
            }
            bookingsMap[selectedTime].push(table._id);
          }
        });
        setBookings(bookingsMap);
        // setTables
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };
// console.log(bookings);
const fetchAllSlotsAvailability = async () => {
  setLoading(true);
  const availabilityData = {};
  
  try {
    // Fetch availability for all time slots
    const promises = timeSlots.map(async (slot) => {
      const response = await fetch(
        `${API_URL}/tables/availability?date=${selectedDate.toISOString()}&time=${slot}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        const bookedTables = data.data.filter(table => !table.isAvailable).length;
        const totalTables = data.data.length;
        console.log(data);
        console.log(bookedTables);
        
        
        availabilityData[slot] = {
          bookedTables,
          totalTables,
          status: bookedTables === 0 ? 'available' : 
                  bookedTables === totalTables ? 'fully-booked' : 
                  'partially-booked'
        };
      }
    });

    await Promise.all(promises);
    setSlotAvailability(availabilityData);
  } catch (error) {
    console.error('Error fetching availability:', error);
    setError('Failed to fetch availability');
  } finally {
    setLoading(false);
  }
};
// console.log(slotAvailability);


const getSlotColor = (time) => {
  if (loading) return 'bg-gray-100';
  
  const availability = slotAvailability[time]?.status;
  
  if (selectedTime === time) {
    return 'bg-purple-600 hover:bg-purple-700 text-white';
  }
  
  switch (availability) {
    case 'available':
      return 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300';
    case 'partially-booked':
      return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300';
    case 'fully-booked':
      return 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300';
  }
};

const renderTimeSlots = () => {
  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) {
      acc[slot.period] = [];
    }
    acc[slot.period].push(slot);
    return acc;
  }, {});
  console.log(groupedSlots);
console.log(slotAvailability);

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4">
        <Badge variant="outline" className="px-3 py-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
          Available
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
          Partially Booked
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          Fully Booked
        </Badge>
      </div>
      
      {/* {Object.entries(slotAvailability).map(([period, slots]) => ( */}
        <div  className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500"></h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const availability = slotAvailability[slot];
              return (
                <Button
                  key={slot}
                  variant="outline"
                  onClick={() => setSelectedTime(slot)}
                  className={`justify-between border ${getSlotColor(slot)}`}
                  disabled={availability?.status === 'fully-booked'}
                >
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {slot}
                  </div>
                  {availability && (
                    <span className="text-xs">
                      {availability.totalTables - availability.bookedTables}/{availability.totalTables}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      {/* ))} */}
    </div>
  );
};
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(selectedDate.toISOString());
      console.log(formData);
      
      
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString(),
          time: selectedTime,
          table: selectedTable._id,
          guests: selectedTable.capacity,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setBookingStatus('success');
        setBookingFormOpen(false);
        fetchAvailability();
        setFormData({
          name: '',
          email: '',
          phone: '',
          specialRequests: '',
        })
      } else {
        setBookingStatus('error');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const isTableBooked = (tableId, time) => bookings[time]?.includes(tableId);

  const getTableColor = (capacity) => {
    if (capacity <= 2) return 'bg-indigo-500 hover:bg-indigo-600';
    if (capacity <= 4) return 'bg-violet-500 hover:bg-violet-600';
    if (capacity <= 6) return 'bg-purple-500 hover:bg-purple-600';
    return 'bg-fuchsia-500 hover:bg-fuchsia-600';
  };

  const TableShape = ({ table, isBooked, isSelected }) => {
    const baseStyles = "flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg";
    const selectedStyles = isSelected ? "ring-4 ring-yellow-400" : "";
    const bookedStyles = isBooked ? "bg-gray-400 opacity-50 cursor-not-allowed" : 
    getTableColor(table.capacity);
    // console.log(table);
    // console.log(isBooked);
    
    
    
    const shapeStyles = {
      round: "rounded-full",
      square: "rounded-lg",
      rectangle: "rounded-lg"
    };

    const dimensions = {
      round: "w-28 h-28",
      square: "w-28 h-28",
      rectangle: "w-36 h-28"
    };

    return (
      <div className={`${baseStyles} ${selectedStyles} ${bookedStyles} ${shapeStyles[table.shape]} ${dimensions[table.shape]}`}>
        <div className="text-center text-white">
          <div className="text-lg font-bold">Table {table.tableNumber}</div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Users size={18} />
            <span className="font-medium">{table.capacity}</span>
          </div>
        </div>
      </div>
    );
  };
console.log(selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Restaurant Table Booking
          </h1>
          <p className="text-gray-600">Choose your perfect dining spot</p>
        </div>

        {bookingStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200 mb-6">
            <AlertDescription>Booking confirmed successfully!</AlertDescription>
          </Alert>
        )}

{/* <CustomCalendar/> */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-xl border-t-4 border-t-purple-500">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="text-purple-800">Select Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border shadow-sm mx-auto"
                disabled={(date) => date < new Date()}
              />
              <div className="mt-8">
                <Label className="text-lg font-semibold text-purple-800 mb-4 block">Time Slots</Label>
                <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="text-purple-800">Select Time Slot</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {renderTimeSlots()}
      </CardContent>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-t-4 border-t-indigo-500">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="text-indigo-800">Table Layout</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-white rounded-xl shadow-inner p-8 mb-6 min-h-[500px]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                  {tables?.map((table) => (
                    <div
                      key={table.tableNumber}
                      className="transform hover:scale-105 transition-transform"
                      onClick={() => {
                        if (!isTableBooked(table._id, selectedTime) && selectedTime) {
                          setSelectedTable(table);
                          setBookingFormOpen(true);
                        }
                      }}
                    >
                      <TableShape 
                        table={table}
                        isBooked={isTableBooked(table._id, selectedTime)}
                        isSelected={selectedTable?.tableNumber === table.tableNumber}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-6 justify-center">
                <Badge variant="outline" className="px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                  Available
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
                  Booked
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <Dialog open={bookingFormOpen} onOpenChange={setBookingFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-purple-800">
                Book Table {selectedTable?.tableNumber}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Input
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Table:</span>
                  <span className="font-medium">#{selectedTable?.tableNumber} ({selectedTable?.capacity} guests)</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </DialogContent>
        </Dialog> */}
        <BookingModal
  isOpen={bookingFormOpen}
  onClose={() => setBookingFormOpen(false)}
  selectedTable={selectedTable}
  selectedDate={selectedDate}
  selectedTime={selectedTime}
  onSubmit={handleBooking}
  setFormData={setFormData}
  formData={formData}
/>

      </div>
    </div>
  );
};


export default TablesLayout;