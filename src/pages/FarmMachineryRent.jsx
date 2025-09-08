import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar as CalendarIcon, MessageCircle } from 'lucide-react';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const rentalData = [
  { id: 1, name: "Mini Tiller (5HP)", rate: "₹350/hr", deposit: "₹1000", distance: "5km", hub: "Sonipat SHG Hub", rating: 4.8, image: "https://plus.unsplash.com/premium_photo-1678297244327-a682a39a75db?w=400" },
  { id: 2, name: "Drone Sprayer (10L)", rate: "₹700/acre", deposit: "₹5000", distance: "12km", hub: "Karnal Youth Hub", rating: 4.9, image: "https://images.unsplash.com/photo-1639352423375-1c95a12a5a2f?w=400" },
  { id: 3, name: "Mini Tractor (15HP)", rate: "₹800/hr", deposit: "₹3000", distance: "8km", hub: "Gurgaon Agri-Service", rating: 4.7, image: "https://images.unsplash.com/photo-1621255375556-248d8853a8f3?w=400" },
];

export default function FarmMachineryRentPage() {
  useScrollToTop();
  const [bookingStep, setBookingStep] = React.useState(0);
  const [selectedMachine, setSelectedMachine] = React.useState(null);

  const handleBooking = (machine) => {
    setSelectedMachine(machine);
    setBookingStep(1);
  };

  return (
    <div className="min-h-screen py-16">
       <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {bookingStep === 0 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Farm Machinery - Rent</h1>
              <p className="text-xl text-gray-600">Affordable, on-demand machinery from your nearest SHG hub.</p>
            </div>

            <Card className="mb-8 shadow-lg">
              <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                <Input placeholder="Enter pincode..." className="flex-grow" />
                <Input type="date" className="flex-grow"/>
                <Button className="flex-grow">Search Availability</Button>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentalData.map(item => (
                <Card key={item.id} className="hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0">
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <div className="flex items-center justify-between my-2">
                      <p className="text-xl font-semibold text-green-700">{item.rate}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit mb-2">{item.hub}</Badge>
                    <p className="text-sm text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-1"/> {item.distance} away</p>
                    <Button onClick={() => handleBooking(item)} className="w-full mt-4">Book Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {bookingStep === 1 && selectedMachine && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Book: {selectedMachine.name}</h2>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Select Date & Time</h3>
                  {/* A full calendar component would go here */}
                  <Input type="datetime-local" />
                </div>
                 <div>
                  <h3 className="font-semibold">Booking Summary</h3>
                  <div className="text-sm space-y-1 mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="flex justify-between"><span>Rate:</span> <span>{selectedMachine.rate}</span></p>
                    <p className="flex justify-between"><span>Security Deposit:</span> <span>{selectedMachine.deposit}</span></p>
                    <p className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Payable:</span> <span>{selectedMachine.deposit}</span></p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Note: Rental fee will be deducted from the deposit upon return.</p>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => setBookingStep(0)}>Back</Button>
                  <Button onClick={() => setBookingStep(2)}>Pay Deposit & Confirm</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {bookingStep === 2 && selectedMachine && (
          <div className="max-w-2xl mx-auto text-center">
             <Card className="shadow-xl p-8">
               <h2 className="text-3xl font-bold mb-4 text-green-700">Booking Confirmed!</h2>
               <p>Your booking for <strong>{selectedMachine.name}</strong> is confirmed.</p>
               <p className="text-sm text-gray-600 mt-2">Booking ID: AV-RENT-1024</p>
               <div className="mt-6 p-4 bg-green-50 text-left rounded-lg">
                  <h4 className="font-semibold">Pickup Details:</h4>
                  <p>{selectedMachine.hub}</p>
                  <p className="text-sm">{selectedMachine.distance} away from your location.</p>
               </div>
               <Button className="w-full mt-6" onClick={() => setBookingStep(0)}>Make Another Booking</Button>
             </Card>
          </div>
        )}

      </div>
    </div>
  );
}