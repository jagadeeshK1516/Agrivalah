
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Shield, 
  TrendingUp, 
  Award,
  Users,
  Building,
  CheckCircle,
  Star,
  IndianRupee,
  Package,
  Truck,
  GraduationCap
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const services = [
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Seeds, organic fertilizers/bio-pesticides, nature farming principles, yield improvement, marketing techniques"
  },
  {
    icon: Package,
    title: "Grading, Packing, Supply",
    description: "Support to prepare produce for fair prices; help farmers draft their own business plans"
  },
  {
    icon: Truck,
    title: "Export & Storage",
    description: "Post-harvest management, export readiness, common warehouses, storage know-how to hold for right price"
  },
  {
    icon: Building,
    title: "Facilities at Nominal Prices",
    description: "Drones for spraying, machinery, spares—pay-per-use/rental options via SHG hubs"
  },
  {
    icon: Shield,
    title: "Insurance Assistance",
    description: "Crop insurance facilitation so weather/yield risks are covered"
  },
  {
    icon: TrendingUp,
    title: "Finance Linkage",
    description: "Connect to Mitra or institutions for cultivation support"
  },
  {
    icon: Award,
    title: "Organic Certification",
    description: "Assist farmers in obtaining certification with guidance and support"
  },
  {
    icon: Users,
    title: "Farmer Branding",
    description: "Farmer name & farm details stamped on packs to build reputation and accountability"
  }
];

const benefits = [
  "No lender interest; insurance-backed cultivation support",
  "Direct price; no brokerage or middlemen",
  "Predictable demand via Mitra engine + daily markets + exports",
  "Lower input costs with traditional inputs upgraded by Cyano",
  "Access to tech & machinery (drones, sensors, mini-tillers) at lower cost",
  "Brand recognition: name & farm on pack; direct orders possible",
  "Training: nature/organic methods, export compliance, best practices",
  "Certification: assistance to achieve organic certification",
  "Student networks increase local prestige and adoption"
];

const comparisonTable = [
  { area: "Capital", statusQuo: "Informal debt; high interest", withAgriValah: "Insurance-linked support; no lender interest" },
  { area: "Pricing", statusQuo: "Brokered; deductions", withAgriValah: "Direct; transparent; fair" },
  { area: "Inputs", statusQuo: "High chemical cost", withAgriValah: "Upgraded traditional inputs + startup tech at fair prices" },
  { area: "Risk", statusQuo: "Weather/price on the farmer", withAgriValah: "Insurance + assured demand" },
  { area: "Brand", statusQuo: "Anonymous", withAgriValah: "Name on pack; direct orders" }
];

const testimonials = [
  {
    name: "Rajesh Patel",
    location: "Gujarat",
    farmSize: "5 acres",
    testimonial: "AgriValah helped me transition to organic farming. Now I get fair prices and my name is on every pack. No more middlemen taking cuts.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    crop: "Organic Cotton"
  },
  {
    name: "Sunita Devi",
    location: "Haryana", 
    farmSize: "3 acres",
    testimonial: "The insurance coverage gives me peace of mind. Even when weather is bad, I know my family and Mitra families will be protected.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b634?w=100&h=100&fit=crop",
    crop: "Organic Wheat"
  },
  {
    name: "Kumar Singh",
    location: "Punjab",
    farmSize: "8 acres", 
    testimonial: "Training programs taught me nature farming. My soil is healthier, costs are lower, and I'm proud to see my name on the products.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    crop: "Organic Rice"
  }
];

export default function FarmersPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <Sprout className="w-4 h-4 mr-2" />
            For Farmers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grow with Dignity, Earn with Pride
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Join AgriValah and get direct market access, fair prices, insurance protection, and your name on every pack. 
            Move to sustainable organic farming with complete support and guaranteed buyers.
          </p>
          
        {/* Selection Criteria */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Farmer Selection Criteria
                </h3>
                <p className="text-blue-100 text-lg">
                  Simple requirements to join the AgriValah farmer network
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold">25%</span>
                  </div>
                  <h4 className="font-bold mb-2">Minimum Organic Land</h4>
                  <p className="text-blue-100 text-sm">At least 25% of land committed to organic/nature farming practices</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold mb-2">In-Person Onboarding</h4>
                  <p className="text-blue-100 text-sm">Personal verification by AgriValah representative to ensure quality</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold mb-2">Certification Support</h4>
                  <p className="text-blue-100 text-sm">Complete assistance provided to achieve organic certification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services & Facilities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Support Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in organic farming - no freebies, just fair pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AgriValah?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your farming with guaranteed benefits and support
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Quo vs AgriValah */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transform Your Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference AgriValah makes in every aspect of farming
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Area</th>
                      <th className="px-6 py-4 text-left">Status Quo</th>
                      <th className="px-6 py-4 text-left">With AgriValah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonTable.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-6 py-4 font-semibold text-gray-900">{row.area}</td>
                        <td className="px-6 py-4 text-red-600">{row.statusQuo}</td>
                        <td className="px-6 py-4 text-green-600">{row.withAgriValah}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        
          {/* Pricing Card */}
          <Card className="max-w-md mx-auto mb-8 border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 mr-2 text-green-600" />
                Farmer Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">₹12,000</div>
                <div className="text-gray-600 mb-4">per year subscription</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>✓ Training & workshops</p>
                  <p>✓ Storage access & branding</p>
                  <p>✓ Market linkages</p>
                  <p>✓ Insurance facilitation</p>
                  <p>✓ Certification guidance</p>
                  <p>✓ Optional Mitra pairing (₹30,000 cultivation support)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://agrivalah-connect-57ea877e.base44.app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                <Sprout className="w-5 h-5 mr-2" />
                Become a Farmer
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Download Farmer Guide
            </Button>
          </div>
        </div>

        

        {/* Farmer Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Farmers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real farmers sharing their transformation journey with AgriValah
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((farmer, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={farmer.image} 
                      alt={farmer.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{farmer.name}</CardTitle>
                      <p className="text-sm text-gray-600">{farmer.location}</p>
                      <Badge className="bg-green-100 text-green-800 text-xs mt-1">
                        {farmer.farmSize} • {farmer.crop}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm italic leading-relaxed mb-3">
                    "{farmer.testimonial}"
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Farm with Pride?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers who have transformed their lives through AgriValah. 
                Get direct market access, fair prices, and your name on every pack.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://agrivalah-connect-57ea877e.base44.app" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                    <Sprout className="w-5 h-5 mr-2" />
                    Start Your Journey
                  </Button>
                </a>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  Schedule Farm Visit
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Minimum 25% organic land required | In-person verification | Certification support included
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
