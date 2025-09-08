import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, MessageCircle, GitCompare, ArrowRight, Shield, Leaf, Truck } from 'lucide-react';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


// This is mock data. In a real app, you'd fetch this based on URL param.
const product = { 
  id: 1, 
  name: "Mini Tiller (5HP)", 
  brand: "AgroTech", 
  price: 45000, 
  rating: 4.5, 
  reviews: 24,
  images: [
    "https://plus.unsplash.com/premium_photo-1678297244327-a682a39a75db?w=800",
    "https://images.unsplash.com/photo-1621255375556-248d8853a8f3?w=400",
    "https://images.unsplash.com/photo-1599599810694-b5b37304c547?w=400"
  ],
  description: "A robust and efficient 5HP mini tiller, perfect for small to medium-sized farms. Makes soil preparation quick and easy. Comes with adjustable handles and durable blades for various soil types.",
  specs: [
    { name: "Engine Power", value: "5 HP" },
    { name: "Fuel Type", value: "Petrol" },
    { name: "Tilling Width", value: "24 inches" },
    { name: "Weight", value: "75 kg" },
  ],
  emi: "Starts at ₹3,750/month"
};

export default function ProductDetailPage() {
  useScrollToTop();
  const [mainImage, setMainImage] = React.useState(product.images[0]);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`aspect-square bg-gray-100 rounded-md cursor-pointer overflow-hidden ${mainImage === img ? 'ring-2 ring-green-600' : ''}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info & Actions */}
          <div>
            <Badge>{product.brand}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold my-3">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <p className="text-4xl font-bold text-green-700 mb-2">₹{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mb-6">{product.emi}</p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Request Installation
              </Button>
            </div>
            
            <Card>
                <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
                    <div className="text-sm">
                        <Shield className="mx-auto w-6 h-6 mb-1 text-green-600"/>
                        <p>1 Year Warranty</p>
                    </div>
                    <div className="text-sm">
                        <Leaf className="mx-auto w-6 h-6 mb-1 text-green-600"/>
                        <p>AgriValah Assured</p>
                    </div>
                     <div className="text-sm">
                        <Truck className="mx-auto w-6 h-6 mb-1 text-green-600"/>
                        <p>Pan-India Delivery</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* Details & Reviews Tabs */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {product.specs.map(spec => (
                  <div key={spec.name} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-semibold text-gray-700">{spec.name}</span>
                    <span className="text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}