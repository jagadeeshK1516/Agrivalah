import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  IndianRupee, 
  TrendingUp, 
  Users, 
  Sprout,
  Heart,
  Building,
  CheckCircle,
  Target,
  Shield,
  Eye
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

const farmerPlan = {
  subscription: 12000,
  cultivationSupport: 30000, // optional via Mitra
  services: ["Training", "Storage access", "Branding", "Market linkages", "Insurance facilitation", "Certification guidance"]
};

const revenueStreams = [
  {
    stream: "Farmer Subscriptions",
    amount: "₹12,000",
    description: "Annual subscription per farmer for complete service stack",
    icon: Sprout,
    color: "from-green-500 to-emerald-600"
  },
  {
    stream: "Mitra Subscriptions", 
    amount: "₹12,000",
    description: "Annual subscription per Mitra family for logistics and transparency",
    icon: Heart,
    color: "from-pink-500 to-red-600"
  },
  {
    stream: "Service Fees",
    amount: "Nominal",
    description: "Grading, packing, transport, warehousing, drone rental fees",
    icon: Building,
    color: "from-blue-500 to-indigo-600"
  },
  {
    stream: "Input Margins",
    amount: "Low %",
    description: "Small margins on organic inputs, seeds, and startup tech sales",
    icon: TrendingUp,
    color: "from-purple-500 to-violet-600"
  }
];

const keyFeatures = [
  {
    feature: "Insurance Protection",
    description: "Comprehensive crop insurance protects both farmer livelihoods and Mitra supply continuity",
    icon: Shield
  },
  {
    feature: "Complete Transparency",
    description: "Public dashboards show farmer prices, deliveries, and grievance SLAs - no hidden fees",
    icon: Eye
  },
  {
    feature: "Sustainable Economics",
    description: "No freebies anywhere. Fair pricing that works for farmers, Mitras, and the ecosystem",
    icon: Target
  }
];

const valueProposition = [
  "₹42,000 → ₹54,000 in assured product value; ₹12,000 net in-kind ROI",
  "Doorstep kits (₹4,500/month) signal real care & love to family", 
  "Zero crop anxiety: insurance + alternate supply pool",
  "Choice-based baskets from a published list",
  "Donation option to NGOs; receipts issued",
  "Transparent portal with farmer linkages and prices paid",
  "Price shield against food inflation during the year"
];

export default function BusinessModelPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <IndianRupee className="w-4 h-4 mr-2" />
            Business Model & Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple and Transparent
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our business model is built on transparency, fair economics, and sustainable value creation. 
            No freebies anywhere in the chain - just honest pricing that works for everyone.
          </p>
        </div>

        {/* Mitra Plan Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mitra Plan (per family, per year)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear investment, transparent returns, guaranteed value
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white overflow-hidden mb-8">
            <div className="grid md:grid-cols-2">
              {/* Investment Side */}
              <div className="p-8 bg-gradient-to-br from-red-50 to-pink-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <IndianRupee className="w-8 h-8 mr-2 text-red-600"/> Your Investment
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg">
                    <span className="font-medium">Subscription</span>
                    <span className="font-bold text-red-600">₹{mitrapPlan.subscription.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg">
                    <span className="font-medium">Farmer Cultivation Support</span>
                    <span className="font-bold text-red-600">₹{mitrapPlan.cultivationSupport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border-2 border-red-200">
                    <span className="font-bold">Total Contribution</span>
                    <span className="font-bold text-xl text-red-700">₹{mitrapPlan.totalContribution.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Returns Side */}
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-8 h-8 mr-2 text-green-600"/> Your Returns
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg">
                    <span className="font-medium">Monthly Kit Value</span>
                    <span className="font-bold text-green-600">₹{mitrapPlan.monthlyKitValue.toLocaleString()}/month</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/60 rounded-lg">
                    <span className="font-medium">Annual Product Value</span>
                    <span className="font-bold text-green-600">₹{mitrapPlan.assuredProductValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-200">
                    <span className="font-bold">Net In-Kind ROI</span>
                    <span className="font-bold text-xl text-green-700">₹{mitrapPlan.netROI.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Value Proposition */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                The Value: More Than Just ROI
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {valueProposition.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-200 leading-relaxed">{value}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-xl">
                  <Heart className="w-5 h-5 mr-2" />
                  Join Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farmer Plan Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Farmer Plan (per farmer, per year)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete support stack for organic farming success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Sprout className="w-6 h-6 mr-3 text-green-600"/>
                  Subscription Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-4">₹{farmerPlan.subscription.toLocaleString()}/year</div>
                <div className="space-y-3">
                  {farmerPlan.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-600"/>
                  Optional Mitra Pairing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-4">₹{farmerPlan.cultivationSupport.toLocaleString()}</div>
                <p className="text-gray-600 mb-4">
                  Get paired with a Mitra for cultivation support, or join independently if you're already practicing organic farming.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700 text-sm">Insured cultivation capital</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700 text-sm">Guaranteed market access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700 text-sm">Your name on every pack</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Streams */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AgriValah Revenue Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diversified, sustainable revenue model
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stream.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      <stream.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{stream.stream}</CardTitle>
                      <div className="text-xl font-bold text-green-600">{stream.amount}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{stream.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes AgriValah Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on transparency, powered by insurance, driven by fair economics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 text-center">{feature.feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.description}</p>
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
                Ready to Transform Agriculture?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers, families, and changemakers building India's most transparent food system. 
                No free services - just sustainable economics that work for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl">
                  <Users className="w-6 h-6 mr-2" />
                  Join AgriValah Today
                </Button>
                <Button size="lg" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}