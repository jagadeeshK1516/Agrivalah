import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, MessageCircle, GitCompare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const machineryData = [
  { id: 1, name: "Mini Tiller (5HP)", brand: "AgroTech", price: 45000, rating: 4.5, image: "https://plus.unsplash.com/premium_photo-1678297244327-a682a39a75db?w=400", acreage: "1-3 acres" },
  { id: 2, name: "Seed Drill (2-row)", brand: "FarmEasy", price: 22000, rating: 4.2, image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400", acreage: "3-5 acres" },
  { id: 3, name: "Power Sprayer (16L)", brand: "CropGuard", price: 8500, rating: 4.8, image: "https://images.unsplash.com/photo-1599599810694-b5b37304c547?w=400", acreage: "All" },
  { id: 4, name: "IoT Soil Sensor Kit", brand: "Cyano", price: 15000, rating: 4.9, image: "https://images.unsplash.com/photo-1615878414901-a68b20a01a24?w=400", acreage: "All" },
  { id: 5, name: "Grain Dryer (Small)", brand: "HarvestPro", price: 65000, rating: 4.4, image: "https://images.unsplash.com/photo-1591785532290-3494a86a1f86?w=400", acreage: "5+ acres" },
  { id: 6, name: "Mini Tractor (15HP)", brand: "AgroTech", price: 275000, rating: 4.7, image: "https://images.unsplash.com/photo-1621255375556-248d8853a8f3?w=400", acreage: "5+ acres" },
];

export default function FarmMachineryBuyPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
       <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
          <MessageCircle className="w-8 h-8" />
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Farm Machinery - Buy</h1>
          <p className="text-xl text-gray-600">Quality equipment for modern, efficient farming.</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-4 flex flex-wrap gap-4 items-center">
            <Input placeholder="Search machinery..." className="max-w-xs" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agrotech">AgroTech</SelectItem>
                <SelectItem value="farmeasy">FarmEasy</SelectItem>
                <SelectItem value="cropguard">CropGuard</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Acreage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 acres</SelectItem>
                <SelectItem value="3-5">3-5 acres</SelectItem>
                <SelectItem value="5+">5+ acres</SelectItem>
              </SelectContent>
            </Select>
            <Button>Apply Filters</Button>
          </CardContent>
        </Card>

        {/* Machinery Catalog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machineryData.map(item => (
            <Card key={item.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <Badge className="w-fit mb-2  ">{item.brand}</Badge>
                <h3 className="text-lg font-bold flex-grow">{item.name}</h3>
                <div className="flex items-center justify-between my-2">
                  <p className="text-xl font-semibold text-green-700">₹{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                <Link to={createPageUrl(`ProductDetail?id=${item.id}`)} className="w-full">
                  <Button variant="ghost" className="w-full mt-2 text-green-600">
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}