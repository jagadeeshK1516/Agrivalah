import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Share2 } from 'lucide-react';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const storesData = [
  { id: 1, name: "Gurgaon Sec-14 Market", address: "Main Market, Near Metro", hours: "6AM-10AM, 5PM-8PM", status: "Open", features: ["UPI", "COD"] },
  { id: 2, name: "Delhi CP Market", address: "Block A, Inner Circle", hours: "6AM-10AM, 4PM-8PM", status: "Open", features: ["UPI"] },
  { id: 3, name: "Sonipat Model Town Market", address: "Community Center", hours: "7AM-11AM, 5PM-9PM", status: "Opening Soon", features: ["UPI", "COD"] },
];

export default function OfflineStoresPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Offline Stores</h1>
          <p className="text-xl text-gray-600">Find fresh, traceable organic produce at a market near you.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle>Find a Market</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Enter your Pincode or City" className="mb-4" />
                {/* Placeholder for map */}
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map will be shown here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stores List */}
          <div className="lg:col-span-2 space-y-6">
            {storesData.map(store => (
              <Card key={store.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{store.name}</h3>
                      <p className="text-gray-600 flex items-center mt-1"><MapPin className="w-4 h-4 mr-1 text-green-600"/>{store.address}</p>
                    </div>
                    <Badge className={store.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {store.status}
                    </Badge>
                  </div>
                  <div className="border-t my-4"></div>
                  <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="text-sm text-gray-700">
                      <p className="flex items-center"><Clock className="w-4 h-4 mr-2"/>{store.hours}</p>
                      <div className="flex gap-2 mt-2">
                        {store.features.map(f => <Badge key={f} variant="outline">{f}</Badge>)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-2"/>Call</Button>
                      <Button size="sm">Get Directions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}