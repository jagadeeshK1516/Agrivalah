
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, QrCode, Phone, Search, Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const markets = [
  {
    id: 1,
    name: "Gurgaon Sector 14 Market",
    location: "Near Metro Station, Sector 14",
    state: "Haryana",
    district: "Gurgaon",
    hours: "6:00 AM - 10:00 AM, 5:00 PM - 8:00 PM",
    products: ["Tomatoes", "Onions", "Green Chilies", "Ginger", "Garlic"],
    status: "Open",
    phone: "+91-8331919474"
  },
  {
    id: 2,
    name: "Delhi CP Connaught Place",
    location: "Block A, Inner Circle",
    state: "Delhi",
    district: "New Delhi",
    hours: "6:00 AM - 10:00 AM, 4:00 PM - 8:00 PM", 
    products: ["Curry Leaves", "Coriander", "Spinach", "Cauliflower"],
    status: "Open",
    phone: "+91-8331919474"
  },
  {
    id: 3,
    name: "Sonipat Model Town",
    location: "Community Center Market",
    state: "Haryana",
    district: "Sonipat",
    hours: "7:00 AM - 11:00 AM, 5:00 PM - 9:00 PM",
    products: ["Potatoes", "Carrots", "Cabbage", "Peas"],
    status: "Opening Soon",
    phone: "+91-8331919474"
  },
  {
    id: 4,
    name: "Chandigarh Sector 22 Market",
    location: "Near Bus Stand, Sector 22",
    state: "Chandigarh",
    district: "Chandigarh",
    hours: "6:30 AM - 10:30 AM, 5:30 PM - 9:00 PM",
    products: ["Broccoli", "Bell Peppers", "Lettuce", "Mushrooms"],
    status: "Open",
    phone: "+91-8331919474"
  },
  {
    id: 5,
    name: "Mumbai Andheri Market",
    location: "Station Road, Andheri West",
    state: "Maharashtra",
    district: "Mumbai",
    hours: "6:00 AM - 11:00 AM, 4:00 PM - 9:00 PM",
    products: ["Coconut", "Drumsticks", "Okra", "Bitter Gourd"],
    status: "Open",
    phone: "+91-8331919474"
  },
  {
    id: 6,
    name: "Pune Camp Market",
    location: "MG Road, Camp Area",
    state: "Maharashtra",
    district: "Pune",
    hours: "7:00 AM - 10:00 AM, 6:00 PM - 9:00 PM",
    products: ["Sweet Corn", "Baby Corn", "Zucchini", "Cherry Tomatoes"],
    status: "Opening Soon",
    phone: "+91-8331919474"
  }
];

const stockReviews = [
  {
    commodity: "Wheat Futures",
    date: "July 26, 2024",
    price: "₹2,450/q",
    change: "+1.2%",
    status: "Bullish",
    summary: "Strong demand from millers and positive export news drive prices up.",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    commodity: "Soybean Spot",
    date: "July 26, 2024",
    price: "₹4,800/q",
    change: "-0.8%",
    status: "Bearish",
    summary: "Higher than expected sowing area data puts downward pressure on spot prices.",
    icon: TrendingDown,
    color: "text-red-600"
  },
  {
    commodity: "Cotton Bales",
    date: "July 26, 2024",
    price: "₹65,000/bale",
    change: "+2.1%",
    status: "Bullish",
    summary: "International demand remains robust, supporting a firm price trend.",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    commodity: "Maize (Kharif)",
    date: "July 26, 2024",
    price: "₹2,100/q",
    change: "+0.5%",
    status: "Neutral",
    summary: "Prices remain stable as market awaits clearer monsoon progress reports.",
    icon: Minus,
    color: "text-gray-600"
  },
  {
    commodity: "Turmeric Spot",
    date: "July 26, 2024",
    price: "₹18,500/q",
    change: "+3.5%",
    status: "Bullish",
    summary: "Delayed sowing and lower stock reports trigger a sharp rally.",
    icon: TrendingUp,
    color: "text-green-600"
  }
];


// Extract unique states and districts
const states = [...new Set(markets.map(market => market.state))].sort();
const getDistrictsByState = (selectedState) => {
  if (!selectedState) return [];
  return [...new Set(markets.filter(market => market.state === selectedState).map(market => market.district))].sort();
};

export default function MarketsPage() 
{ useScrollToTop();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredMarkets, setFilteredMarkets] = useState(markets);
  const scrollContainerRef = useRef(null);
  const intervalRef = useRef(null);

  // Filter markets based on search and location filters
  useEffect(() => {
    let filtered = markets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(market =>
        market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.products.some(product => 
          product.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        market.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply state filter
    if (selectedState) {
      filtered = filtered.filter(market => market.state === selectedState);
    }

    // Apply district filter
    if (selectedDistrict) {
      filtered = filtered.filter(market => market.district === selectedDistrict);
    }

    setFilteredMarkets(filtered);
  }, [searchTerm, selectedState, selectedDistrict]);

  // Reset district when state changes
  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedState]);

  // Auto-scroll for stock reviews
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const startScrolling = () => {
      stopScrolling(); // Ensure no multiple intervals are running
      intervalRef.current = setInterval(() => {
        if (scrollContainer) {
          const isAtEnd = Math.ceil(scrollContainer.scrollLeft) + scrollContainer.clientWidth >= scrollContainer.scrollWidth;
          if (isAtEnd) {
             scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
             scrollContainer.scrollBy({ left: 320 + 24, behavior: 'smooth' }); // Card width + gap
          }
        }
      }, 3000); // scroll every 3 seconds
    };

    const stopScrolling = () => {
      clearInterval(intervalRef.current);
    };

    startScrolling();
    scrollContainer.addEventListener('mouseenter', stopScrolling);
    scrollContainer.addEventListener('mouseleave', startScrolling);

    return () => {
      stopScrolling();
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', stopScrolling);
        scrollContainer.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, []);


  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedDistrict("");
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            Daily Markets
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 ">
            Fresh Daily Markets
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Find farm-fresh, traceable organic produce at our daily markets. 
            Every product comes with QR traceability directly to the farmer.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-12 shadow-lg">
          <CardContent className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            <div className="flex-grow flex items-center bg-white rounded-lg border px-3">
              <Search className="w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search by market, product, or location"
                className="border-0 shadow-none focus-visible:ring-0 flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All States</SelectItem>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Districts</SelectItem>
                  {getDistrictsByState(selectedState).map(district => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
          </CardContent>
        </Card>

        {/* Markets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
            <Card key={market.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold text-gray-900">{market.name}</CardTitle>
                  <Badge className={market.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                    {market.status}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{market.location}, {market.district}, {market.state}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-700 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{market.hours}</span>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Available Today:</h4>
                  <div className="flex flex-wrap gap-2">
                    {market.products.map(product => (
                      <Badge key={product} variant="secondary" className="bg-gray-200 text-gray-800">{product}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-2" />
                    Traceability
                  </Button>
                  <a href={`tel:${market.phone}`}>
                    <Button size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-800">No Markets Found</h3>
              <p className="text-gray-600 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        
        {/* Why Choose Our Markets Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Daily Markets?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer more than just fresh produce; we offer trust and transparency.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-green-700" />
                </div>
                <CardTitle>Direct Traceability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Scan a QR code on any product to see the farmer's story, farm location, and certification details.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-green-700" />
                </div>
                <CardTitle>Zero Chemical Residue</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All produce is sourced from our network of verified nature-farming practitioners. Clean food guaranteed.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-green-700" />
                </div>
                <CardTitle>Hyperlocal Sourcing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our markets prioritize produce from local farmers, reducing food miles and ensuring maximum freshness.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stock Market Daily Reviews Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stock Market – Daily Reviews
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Daily insights and analysis on agricultural commodity markets.
            </p>
          </div>
          <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
            {stockReviews.map((review, index) => (
              <Card key={index} className="flex-shrink-0 w-[320px] border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-900">{review.commodity}</CardTitle>
                    <Badge className={
                      review.status === 'Bullish' ? 'bg-green-100 text-green-800' :
                      review.status === 'Bearish' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2 mb-4">
                    <p className="text-2xl font-bold">{review.price}</p>
                    <div className={`flex items-center text-sm font-semibold ${review.color}`}>
                      <review.icon className="w-4 h-4 mr-1" />
                      <span>{review.change}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed h-16">
                    {review.summary}
                  </p>
                  <Button variant="outline" className="w-full">
                    Read Full Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Want to Sell at Our Markets?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our network of verified farmers and get direct access to thousands of daily customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://agrivalah-connect-57ea877e.base44.app" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                      Become a Farmer
                    </Button>
                  </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
