import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Search, Filter, Sprout, Wheat, Droplets, Utensils, MessageCircle, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const products = [
  { id: 1, name: "Organic Tomatoes", price: 60, unit: "kg", category: "Vegetables", farmer: "Ramesh K.", image: "https://images.unsplash.com/photo-1582284540020-8acbe03f6d20?w=400" },
  { id: 2, name: "Organic Spinach", price: 40, unit: "bunch", category: "Vegetables", farmer: "Sunita D.", image: "https://images.unsplash.com/photo-1576045057995-568f588f21fb?w=400" },
  { id: 3, name: "Basmati Rice", price: 150, unit: "kg", category: "Grains", farmer: "Kumar S.", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400" },
  { id: 4, name: "Mustard Oil", price: 220, unit: "L", category: "Oils", farmer: "Agro Oils Ltd.", image: "https://images.unsplash.com/photo-1626380126294-a7b5a884489b?w=400" },
];

const categories = [
  { name: "Vegetables", icon: Sprout },
  { name: "Grains", icon: Wheat },
  { name: "Oils", icon: Droplets },
  { name: "Spices", icon: Utensils },
];

export default function OnlineStorePage() {
  useScrollToTop();
  const [cartCount, setCartCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
       <header className="bg-white shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex-1 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <input type="text" placeholder="Search for fresh produce..." className="w-full pl-10 pr-4 py-2 border rounded-full"/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon"><Filter className="w-5 h-5"/></Button>
                <div className="relative">
                    <Button variant="ghost" size="icon"><ShoppingCart className="w-6 h-6"/></Button>
                    {cartCount > 0 && <Badge className="absolute -top-1 -right-2 px-1.5 py-0.5">{cartCount}</Badge>}
                </div>
            </div>
        </div>
       </header>
       
       <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Categories Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(cat => (
                        <div key={cat.name} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                <cat.icon className="w-8 h-8 text-green-700"/>
                            </div>
                            <p className="font-semibold">{cat.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <section>
                 <h2 className="text-2xl font-bold mb-6">Fresh from the Farm</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(p => (
                        <Card key={p.id} className="group overflow-hidden">
                            <CardHeader className="p-0 relative">
                                <img src={p.image} alt={p.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform"/>
                                <Button size="icon" variant="secondary" className="absolute top-2 right-2 bg-white/70 w-8 h-8 rounded-full">
                                    <Heart className="w-4 h-4"/>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-sm text-gray-500">by {p.farmer}</p>
                                <h3 className="font-bold text-lg mt-1">{p.name}</h3>
                                <div className="flex justify-between items-center mt-3">
                                    <p className="font-semibold text-lg">₹{p.price} <span className="text-sm font-normal text-gray-500">/{p.unit}</span></p>
                                    <Button size="sm" onClick={() => setCartCount(c => c + 1)}>Add +</Button>
                                </div>
                                <Button variant="ghost" className="w-full h-auto p-1 mt-3 text-xs text-green-600 justify-start">
                                    <QrCode className="w-3 h-3 mr-1"/> Know your Farmer
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
        </div>
       </main>
    </div>
  );
}