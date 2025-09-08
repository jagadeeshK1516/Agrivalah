import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  HandHeart, 
  Briefcase, 
  IndianRupee,
  Rocket,
  CheckCircle,
  Percent,
  Star
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const roleFeatures = [
  {
    icon: Briefcase,
    title: "Procurement & Logistics",
    description: "Run village-level procurement, digital weighing, quality checks, grading, packing, and transport.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Users,
    title: "Farmer Network",
    description: "Identify promising local farmers, recommend them for cultivation support, and be the local AgriValah face.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Rocket,
    title: "Service Hub",
    description: "Operate pay-per-use hubs for agri-tech like drones and machinery provided by startups.",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: IndianRupee,
    title: "Loan Facilitation",
    description: "Supported to access loans for hub setup and operations. No procurement capital needed.",
    color: "from-orange-500 to-red-600"
  }
];

const financialModel = [
  {
    metric: "Commission on Kits",
    value: "8%",
    description: "Earn a steady 8% commission on the value of produce kits procured and packed at your hub.",
    icon: Percent
  },
  {
    metric: "Performance Bonus",
    value: "+2%",
    description: "An optional +2% reward for top performance in quality, timeliness, and farmer satisfaction.",
    icon: Star
  },
  {
    metric: "Service Fees",
    value: "Variable",
    description: "Additional revenue from managing machinery rentals and other services for local farmers.",
    icon: IndianRupee
  }
];

const benefits = [
  "Create meaningful employment in your own village",
  "Gain valuable skills in logistics, quality control, and business management",
  "Become a respected leader and change-maker in your community",
  "No procurement capital risk - your role is service-based",
  "Directly contribute to a sustainable and fair food system",
  "Access to training, technology, and financial support",
  "Build a profitable, long-term enterprise"
];

export default function SHGsPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <HandHeart className="w-4 h-4 mr-2" />
            For SHGs, Youth & Women
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Be the Heart of the Agri-Revolution
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            AgriValah empowers local entrepreneurs—Self-Help Groups (SHGs), youth, and women—to run the last-mile operations.
            Create jobs, build businesses, and lead the change in your own community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-xl">
                <Users className="w-5 h-5 mr-2" />
                Start a Local Hub
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Download Program Guide
            </Button>
          </div>
        </div>

        {/* The Role of Local Entrepreneurs */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Role as a Local Hub
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You are the service engine of AgriValah, not a buyer. This is a zero-risk, high-impact opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {roleFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Financial Model */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              A Business Model That Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Steady, performance-based earnings with multiple revenue streams.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {financialModel.map((item, index) => (
               <Card key={index} className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-700">{item.value}</CardTitle>
                  <p className="font-semibold text-gray-800">{item.metric}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
           <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-violet-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Why Become an AgriValah Entrepreneur?
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-purple-200 mt-1 flex-shrink-0" />
                    <span className="text-purple-100 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Lead the Change?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                If you are part of an SHG, a youth group, or are a woman entrepreneur looking for a real business opportunity, 
                we want to partner with you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-xl">
                    <HandHeart className="w-5 h-5 mr-2" />
                    Contact Us to Start a Hub
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Training and loan facilitation support provided *
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}