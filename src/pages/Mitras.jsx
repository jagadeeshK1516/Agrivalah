
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  IndianRupee, 
  Shield, 
  Eye,
  Home,
  Gift,
  TrendingUp,
  CheckCircle,
  Star,
  Package,
  Users,
  HandHeart
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const mitrapPlan = {
  subscription: 12000,
  cultivationSupport: 30000,
  totalContribution: 42000,
  assuredProductValue: 54000,
  monthlyKitValue: 4500,
  netROI: 12000
};

const benefits = [
  "₹42,000 → ₹54,000 in assured product value; ₹12,000 net in-kind ROI",
  "Doorstep kits (₹4,500/month) signal real care & love to family",
  "Zero crop anxiety: insurance + alternate supply pool",
  "Choice-based baskets from a published list",
  "Donation option to NGOs; receipts issued",
  "Transparent portal with farmer linkages and prices paid",
  "Price shield against food inflation during the year"
];

const productCategories = [
  {
    category: "Fresh Vegetables",
    items: ["Organic tomatoes", "Fresh spinach", "Carrots", "Brinjal", "Okra", "Green beans"],
    icon: "🥬"
  },
  {
    category: "Grains & Pulses", 
    items: ["Organic wheat", "Basmati rice", "Moong dal", "Chana dal", "Rajma", "Black gram"],
    icon: "🌾"
  },
  {
    category: "Cooking Oils",
    items: ["Mustard oil", "Coconut oil", "Sesame oil", "Groundnut oil", "Sunflower oil"],
    icon: "🫒"
  },
  {
    category: "Spice Powders",
    items: ["Turmeric powder", "Red chili", "Cumin powder", "Coriander powder", "Garam masala"],
    icon: "🌶️"
  }
];

const testimonials = [
  {
    name: "Anita Sharma",
    location: "Delhi",
    familySize: "4 members",
    testimonial: "₹4,500 worth of organic produce every month delivered to my door. My family eats healthy and I'm supporting farmers directly.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b634?w=100&h=100&fit=crop",
    duration: "2 years"
  },
  {
    name: "Rajesh Gupta",
    location: "Gurgaon",
    familySize: "5 members", 
    testimonial: "Best investment I've made. Good quality organic food at home plus I know exactly which farmer grew my vegetables.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    duration: "1.5 years"
  },
  {
    name: "Priya Singh",
    location: "Mumbai",
    familySize: "3 members",
    testimonial: "I donate half my kits to an NGO and use half at home. The donation receipts help with tax benefits too.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    duration: "1 year"
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Subscribe & Support",
    description: "Pay ₹42,000 annually (₹12,000 subscription + ₹30,000 farmer cultivation support)",
    icon: IndianRupee
  },
  {
    step: 2,
    title: "Get Paired",
    description: "We pair you with verified organic farmers and provide full transparency",
    icon: Users
  },
  {
    step: 3,
    title: "Choose Your Basket",
    description: "Select from our published list of organic products based on your preferences",
    icon: Package
  },
  {
    step: 4,
    title: "Receive Monthly Kits",
    description: "Get ₹4,500 worth of organic produce delivered to your doorstep every month",
    icon: Home
  }
];

export default function MitrasPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-pink-100 text-pink-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <Heart className="w-4 h-4 mr-2" />
            For Mitras (Supporters)
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support Farmers, Feed Your Family
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Become a Mitra (supporter) and get premium organic produce delivered monthly while directly 
            supporting organic farmers. Clear ROI, complete transparency, and the satisfaction of making a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-xl">
                <Heart className="w-5 h-5 mr-2" />
                Become a Mitra
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
              Download Mitra Guide
            </Button>
          </div>
        </div>

        {/* Mitra Plan Redesigned Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mitra Plan - Crystal Clear ROI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, transparent, and rewarding way to support farmers and your family.
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white overflow-hidden">
            {/* Left Side - The Math (now takes full width as other side is moved) */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <IndianRupee className="w-8 h-8 mr-2 text-green-600"/> The Mitra Plan: By the Numbers
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800">Your Contribution</h4>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg mt-2">
                    <span>Subscription Fee</span>
                    <span className="font-bold">₹{mitrapPlan.subscription.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg mt-2">
                    <span>Farmer Cultivation Support</span>
                    <span className="font-bold">₹{mitrapPlan.cultivationSupport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-100 text-red-800 rounded-lg mt-3">
                    <span className="font-bold">Total Annual Contribution</span>
                    <span className="font-bold text-xl">₹{mitrapPlan.totalContribution.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Your Return</h4>
                  <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg mt-2">
                    <span>Assured Product Value (₹4,500/mo)</span>
                    <span className="font-bold">₹{mitrapPlan.assuredProductValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 text-green-800 rounded-lg mt-3">
                    <span className="font-bold">Net In-Kind ROI</span>
                    <span className="font-bold text-xl">₹{mitrapPlan.netROI.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Badge variant="secondary" className="text-md px-4 py-2 bg-white border border-gray-200 shadow-sm">
                    If crops fail, insurance protects your supply.
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>


        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to start supporting farmers and feeding your family
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choice-Based Product Baskets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our published list of premium organic products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{category.icon}</div>
                    <CardTitle className="text-xl font-bold text-gray-900">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Special Features for Mitras
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional benefits that make your Mitra experience exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Insurance Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  If crops fail at your paired farm, insurance + alternate supply pool protects your kit delivery. 
                  Zero anxiety, guaranteed supply.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Donation Option</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Donate all or part of your kits to NGOs with receipts issued in your/family name. 
                  Social impact + tax benefits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Complete Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Access transparent portal showing farmer linkages, prices paid, delivery schedules, 
                  and grievance resolution status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Value Proposition with Join Us Button */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                The Value: More Than Just ROI
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-200 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-xl text-lg px-8 py-4">
                    <Heart className="w-6 h-6 mr-2" />
                    Join Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mitra Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Happy Mitra Families
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real families sharing their AgriValah experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((mitra, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={mitra.image} 
                      alt={mitra.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{mitra.name}</CardTitle>
                      <p className="text-sm text-gray-600">{mitra.location}</p>
                      <Badge className="bg-pink-100 text-pink-800 text-xs mt-1">
                        {mitra.familySize} • {mitra.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm italic leading-relaxed mb-3">
                    "{mitra.testimonial}"
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-red-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Support & Benefit?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of Mitra families who are eating healthy organic food while directly 
                supporting farmers. Clear ROI, complete transparency, zero risk.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-xl">
                    <Heart className="w-5 h-5 mr-2" />
                    Become a Mitra Today
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  Download Mitra Guide
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * ₹42,000 investment → ₹54,000 organic produce | Insurance protected | Donation receipts available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
