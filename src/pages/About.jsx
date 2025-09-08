
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Eye, 
  Users, 
  Sprout, 
  Building, 
  GraduationCap,
  Heart,
  HandHeart,
  TrendingUp,
  Shield,
  CheckCircle,
  MapPin
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const problemSolution = [
  {
    problem: "Heavy chemical use damaging soil and health",
    solution: "Shift to nature/organic farming with upgraded traditional inputs",
    icon: Sprout
  },
  {
    problem: "Fragile farm incomes with middleman exploitation",
    solution: "Direct pricing and year-round demand guarantee",
    icon: TrendingUp
  },
  {
    problem: "Unreliable supply chains for clean food",
    solution: "Doorstep organic kits with complete traceability",
    icon: Shield
  },
  {
    problem: "Limited startup adoption in rural areas",
    solution: "Ready market for drones, IoT, and agri-tech at scale",
    icon: Building
  }
];

const rolloutPlan = [
  {
    year: "Year 1",
    target: "5 States",
    details: "5,000 Farmers + 5,000 Mitras (1:1 ratio)",
    infrastructure: "125-150 daily markets, 10-15 warehouses, 200 SHG entrepreneurs, 20 startups, 50 school farms",
    expectation: "50% Target Achievement"
  },
  {
    year: "Year 2-3",
    target: "Consolidation",
    details: "Same farmer-Mitra base with deeper penetration",
    infrastructure: "50+ markets per state, exports live, 100 school farms",
    expectation: "100% Target Achievement"
  },
  {
    year: "Year 4",
    target: "Scale Up",
    details: "50,000 Farmers + 50,000 Mitras",
    infrastructure: "100+ city markets, 10,000+ entrepreneurs, 500 school farms, branded exports",
    expectation: "National Presence"
  }
];

const kpis = [
  "Farmer price vs mandi baseline",
  "% land under organic cultivation",
  "Insurance coverage and claim settlement times",
  "On-time kit deliveries and Mitra renewal rate",
  "SHG/youth earnings and retention",
  "Startup adoption (units deployed; cost/acre saved)",
  "School/college participation and output",
  "Customer NPS and complaint resolution times"
];

export default function AboutPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4 transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <Building className="w-4 h-4 mr-2" />
            About AgriValah
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fixing India's Broken Food System
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            AgriValah builds a direct, insured, and transparent bridge from farm to family, 
            eliminating middlemen and ensuring fair prices for farmers while delivering clean, 
            organic food to families.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4">
                <Eye className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                To create India's most transparent and sustainable food system where farmers thrive, 
                families eat clean, and communities prosper through direct, fair trade relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4">
                <Target className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                "Nature Farming With Mother Nature – For a Sustainable Future" - Building sustainable 
                economic bridges that connect farmers directly to families through transparent, 
                insured, and technology-enabled agricultural systems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem → The Solution */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problem → The Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              India's food system faces critical challenges. AgriValah provides systematic solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {problemSolution.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Problem:</h3>
                      <p className="text-red-600 text-sm">{item.problem}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Solution:</h3>
                      <p className="text-green-600 text-sm">{item.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Role of Cyano Foods India */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Cyano Foods India OPC Pvt Ltd
                  </h3>
                  <p className="text-green-100 text-lg leading-relaxed mb-6">
                    The innovator and marketer behind AgriValah, strengthening the core with science-backed 
                    upgrades of traditional organic inputs while powering branding, markets, and exports.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Upgrades traditional inputs: Jeevamrutam, Beejamrutam, Neemastra, Agniastra</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Standardized for quality, stability, and scale</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Powers branding, local daily markets, national retail, and exports</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Leads education drives and advocacy of nature farming</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Building className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold">Company Details</h4>
                    <div className="text-green-100 text-sm space-y-2">
                      <p><strong>CIN:</strong> U15200AP2022OPC122607</p>
                      <p><strong>Phone:</strong> +91-89249-45678</p>
                      <p><strong>Email:</strong> mail.cyano@gmail.com</p>
                      <p><strong>Website:</strong> www.cyanoindia.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rollout Plan */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Timeline & Rollout Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strategic expansion plan with clear targets and measurable outcomes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {rolloutPlan.map((phase, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 0 ? 'ring-2 ring-green-500 ring-opacity-50' : ''
              }`}>
                <CardHeader>
                  {index === 0 && (
                    <Badge className="bg-green-100 text-green-800 mb-4 w-fit">
                      Current Phase
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-bold text-gray-900">{phase.year}</CardTitle>
                  <div className="text-2xl font-bold text-green-600 mt-2">{phase.target}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Target:</h4>
                      <p className="text-gray-700 text-sm">{phase.details}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Infrastructure:</h4>
                      <p className="text-gray-700 text-sm">{phase.infrastructure}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Expected:</strong> {phase.expectation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Key Performance Indicators (KPIs)
              </CardTitle>
              <p className="text-gray-600 text-center">What we track to ensure transparency and success</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {kpis.map((kpi, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 text-sm font-medium">{kpi}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Locations */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Our Locations
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Registered Office</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Repalle-522265<br/>
                  Dist- Bapatla<br/>
                  Andhra Pradesh, India
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Admin Office</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Lower Tipra-174103<br/>
                  Baddi, Dist- Solan<br/>
                  Himachal Pradesh, India
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Register Office</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  MBR Nagar<br/>
                  Dist- Malkajgiri - 500088<br/>
                  Hyderabad, Telangana, India
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
