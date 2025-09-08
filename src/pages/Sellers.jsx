import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  TrendingUp, 
  Users, 
  Shield,
  Eye,
  Package,
  CheckCircle,
  Star,
  IndianRupee,
  Truck,
  BarChart3,
  MapPin,
  Calendar
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const sellerBenefits = [
  {
    icon: TrendingUp,
    title: "Direct Market Access",
    description: "Sell directly to consumers, Mitras, and institutional buyers without middlemen",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Your products are verified, graded, and packaged with our quality standards",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Real-time sales data, customer feedback, and pricing transparency",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Package,
    title: "Logistics Support",
    description: "Complete warehousing, packaging, and delivery support across India",
    color: "from-orange-500 to-red-600"
  }
];

const sellerTypes = [
  {
    type: "Individual Sellers",
    description: "Small scale producers and home-based businesses",
    requirements: ["Valid business registration", "Quality certificates", "Minimum 10kg/week supply"],
    commission: "8-12%",
    features: ["Free listing", "Basic analytics", "Local delivery support"]
  },
  {
    type: "Cooperative Sellers",
    description: "Farmer groups, SHGs, and cooperative societies",
    requirements: ["Society registration", "Group certification", "Minimum 100kg/week supply"],
    commission: "6-10%",
    features: ["Premium listing", "Advanced analytics", "Multi-location support", "Bulk pricing"]
  },
  {
    type: "Enterprise Sellers",
    description: "Large producers, processors, and agri-businesses",
    requirements: ["Company registration", "ISO certificates", "Minimum 1000kg/week supply"],
    commission: "4-8%",
    features: ["White-label options", "API integration", "Dedicated account manager", "Custom contracts"]
  }
];

const successStories = [
  {
    name: "Radha Enterprises",
    location: "Haryana",
    category: "Cooperative Seller",
    product: "Organic Vegetables",
    growth: "300% increase in sales",
    testimonial: "AgriValah helped us reach customers directly. Our farmer members now get 40% better prices.",
    image: "https://images.unsplash.com/photo-1607533182644-97ebb3d6ef1d?w=100&h=100&fit=crop"
  },
  {
    name: "Green Valley Foods",
    location: "Punjab",
    category: "Enterprise Seller",
    product: "Organic Pulses",
    growth: "500+ regular customers",
    testimonial: "The platform's quality standards and logistics support helped us scale across 5 states.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
  },
  {
    name: "Maya's Kitchen",
    location: "Gujarat",
    category: "Individual Seller",
    product: "Homemade Spices",
    growth: "₹50,000 monthly revenue",
    testimonial: "Started from home, now I supply to 200+ families. The transparency builds customer trust.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b634?w=100&h=100&fit=crop"
  }
];

const requirements = [
  "Valid business registration or individual seller permit",
  "Quality certificates (organic/FSSAI as applicable)",
  "Regular supply capacity with consistent quality",
  "Adherence to packaging and labeling standards",
  "Willingness to provide product traceability",
  "Commitment to transparent pricing and practices"
];

export default function SellersPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <Store className="w-4 h-4 mr-2" />
            For Sellers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sell Organic Produce Directly
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Join AgriValah's transparent marketplace and sell your organic products directly to consumers, 
            institutions, and our Mitra network. No middlemen, fair pricing, complete support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl">
                <Store className="w-5 h-5 mr-2" />
                Start Selling
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Download Seller Guide
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell with AgriValah?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access India's most transparent organic marketplace with complete support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sellerBenefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seller Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Seller Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible plans designed for different types of sellers and business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {sellerTypes.map((type, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 1 ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : ''
              }`}>
                <CardHeader>
                  {index === 1 && (
                    <Badge className="bg-blue-100 text-blue-800 mb-4 w-fit">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-bold text-gray-900">{type.type}</CardTitle>
                  <p className="text-gray-600 text-sm">{type.description}</p>
                  <div className="text-2xl font-bold text-blue-600 mt-2">{type.commission}</div>
                  <p className="text-xs text-gray-500">commission per sale</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <div className="space-y-1">
                        {type.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-gray-700 text-xs">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <div className="space-y-1">
                        {type.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-blue-600" />
                            <span className="text-gray-700 text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button className={`w-full mt-6 ${
                      index === 1 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}>
                      Choose This Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seller Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real sellers sharing their growth journey with AgriValah
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{story.name}</CardTitle>
                      <p className="text-sm text-gray-600">{story.location}</p>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                        {story.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Product:</span>
                      <span className="font-semibold text-green-600">{story.product}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-semibold text-blue-600">{story.growth}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed mb-3">
                    "{story.testimonial}"
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

        {/* Requirements */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  General Requirements for All Sellers
                </h3>
                <p className="text-green-100 text-lg">
                  Simple requirements to ensure quality and trust for all stakeholders
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-200 mt-1 flex-shrink-0" />
                    <span className="text-green-100 leading-relaxed">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Selling Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to start selling on AgriValah
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Register & Verify", desc: "Complete seller registration and submit required documents", icon: Users },
              { step: 2, title: "List Products", desc: "Add your organic products with photos, descriptions, and pricing", icon: Package },
              { step: 3, title: "Receive Orders", desc: "Get orders from consumers, Mitras, and institutional buyers", icon: BarChart3 },
              { step: 4, title: "Ship & Earn", desc: "Use our logistics support to deliver and receive payments", icon: Truck }
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Start Selling?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of sellers who are growing their business through AgriValah's 
                transparent marketplace. Direct access to customers, fair pricing, complete support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl">
                    <Store className="w-5 h-5 mr-2" />
                    Apply as Seller
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Schedule Seller Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * No upfront fees | Commission-based pricing | Complete logistics support
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}