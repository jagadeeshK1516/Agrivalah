import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Microscope, Package, Truck, Calendar, Clock, MapPin, Check } from 'lucide-react';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const services = [
  { name: "Drone Spraying", icon: Rocket, description: "Precision spraying for large fields. Save time and resources." },
  { name: "Soil Testing", icon: Microscope, description: "Get a detailed analysis of your soil's health and nutrient profile." },
  { name: "Grading & Packing", icon: Package, description: "Professional grading and packing services to get better market prices." },
  { name: "Transport & Logistics", icon: Truck, description: "Reliable transportation of your produce from farm to market." },
];

export default function ServicesPage() {

  useScrollToTop();
  const [step, setStep] = React.useState(0);
  const [selectedService, setSelectedService] = React.useState(null);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep(1);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {step === 0 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book Agri-Services</h1>
              <p className="text-xl text-gray-600">On-demand professional services to support your farming needs.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map(service => (
                <Card key={service.name} className="text-center hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-8 h-8 text-blue-700" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <Button onClick={() => handleSelectService(service)}>Book Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {step === 1 && selectedService && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Book: {selectedService.name}</h2>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Service Details</h3>
                  <Input placeholder="Enter your Pincode for service availability" />
                  <Textarea placeholder="Any specific requirements? (e.g., acreage for spraying, number of samples for testing)" className="mt-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Schedule a Slot</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input type="date" />
                    <Input type="time" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="font-semibold">Estimated Cost</p>
                    <p className="text-2xl font-bold text-blue-700">₹1,500</p>
                    <p className="text-xs text-gray-500">(Final price after requirement analysis)</p>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={() => setStep(2)}>Confirm Booking</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {step === 2 && selectedService && (
            <Card className="shadow-xl p-8 text-center">
               <h2 className="text-3xl font-bold mb-4 text-green-700">Booking Received!</h2>
               <p>Your request for <strong>{selectedService.name}</strong> has been submitted.</p>
               <p className="text-sm text-gray-600 mt-2">Ticket ID: AV-SERV-2051</p>
               <div className="mt-6 p-4 bg-green-50 text-left rounded-lg">
                  <h4 className="font-semibold">Next Steps:</h4>
                  <p className="text-sm text-gray-700">Our nearest service hub will contact you within 24 hours to confirm details and provide a final quote.</p>
               </div>

                {/* Progress Tracker */}
                <div className="mt-8">
                    <h4 className="font-semibold mb-4">Live Status</h4>
                    <div className="flex justify-between items-center relative w-full">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2">
                            <div className="h-1 bg-green-600 w-0"></div> {/* Adjust width with state */}
                        </div>
                        <div className="flex flex-col items-center z-10">
                            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center"><Check/></div>
                            <p className="text-xs mt-1">Booked</p>
                        </div>
                        <div className="flex flex-col items-center z-10">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">2</div>
                            <p className="text-xs mt-1">In Progress</p>
                        </div>
                        <div className="flex flex-col items-center z-10">
                            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">3</div>
                            <p className="text-xs mt-1">Completed</p>
                        </div>
                    </div>
                </div>

               <Button className="w-full mt-8" onClick={() => setStep(0)}>Book Another Service</Button>
            </Card>
        )}
      </div>
    </div>
  );
}