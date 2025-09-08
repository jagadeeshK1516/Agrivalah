import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users,
  TrendingUp, 
  Target,
  Zap,
  Network,
  CheckCircle,
  Lightbulb,
  Rocket,
  Globe,
  ArrowRight,
  Star
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const partnershipModel = [
  {
    icon: Users,
    title: "Farmer Network Access",
    description: "Direct access to our network of 2,500+ verified organic farmers across multiple states",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Target,
    title: "Demo Plots in Schools",
    description: "Test and showcase your solutions in our partner schools with real-world applications",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: TrendingUp,
    title: "Low-Margin Distribution",
    description: "Scale your solutions across our network with sustainable, low-margin distribution models",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Globe,
    title: "Multi-State Scaling",
    description: "Expand your reach across multiple states through our established infrastructure",
    color: "from-orange-500 to-red-600"
  }
];

const solutionCategories = [
  {
    category: "AgriTech & IoT",
    description: "Smart farming solutions, sensors, and monitoring systems",
    examples: ["Soil moisture sensors", "Weather monitoring stations", "Smart irrigation controllers"],
    icon: Zap,
    color: "bg-blue-50 border-blue-200"
  },
  {
    category: "Drones & Automation",
    description: "Aerial monitoring, spraying, and autonomous farming equipment",
    examples: ["Crop monitoring drones", "Automated spraying systems", "Precision agriculture tools"],
    icon: Rocket,
    color: "bg-purple-50 border-purple-200"
  },
  {
    category: "Irrigation Solutions",
    description: "Water management and efficient irrigation technologies",
    examples: ["Drip irrigation systems", "Smart water management", "Solar-powered pumps"],
    icon: Network,
    color: "bg-green-50 border-green-200"
  },
  {
    category: "Farm Machinery",
    description: "Modern equipment for efficient farming operations",
    examples: ["Mini tractors", "Harvesting equipment", "Processing machinery"],
    icon: Building,
    color: "bg-orange-50 border-orange-200"
  }
];

const successStories = [
  {
    company: "AgroSense Technologies",
    solution: "IoT Soil Monitoring",
    impact: "500+ farmers using smart sensors",
    growth: "300% increase in adoption",
    testimonial: "AgriValah's farmer network helped us scale from 50 to 500 farmers in just 6 months.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
  },
  {
    company: "DroneAgri Solutions",
    solution: "Crop Monitoring Drones",
    impact: "200+ demo plots across schools",
    growth: "250% revenue increase",
    testimonial: "The school demo plots were game-changers. Students became our best advocates to their farmer families.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=100&h=100&fit=crop"
  },
  {
    company: "Smart Irrigation Co.",
    solution: "AI-Powered Irrigation",
    impact: "30% water savings for farmers",
    growth: "5 states presence",
    testimonial: "AgriValah's transparent model helped farmers trust our technology and see immediate benefits.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop"
  }
];

const benefits = [
  "Direct access to verified farmer network",
  "Demo plots for real-world testing",
  "Low-risk, low-margin distribution model",
  "Marketing support through farmer testimonials",
  "Technology adoption training programs",
  "Scale across multiple states efficiently",
  "Transparent feedback from end users",
  "Long-term partnership opportunities"
];

export default function StartupsPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <Building className="w-4 h-4 mr-2" />
            For Agri Startups
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Scale Your AgriTech Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Partner with AgriValah to access our verified farmer network, test your solutions in real-world 
            environments, and scale across multiple states with sustainable distribution models.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("JoinUs")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl">
                <Building className="w-5 h-5 mr-2" />
                Partner with Us
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Download Partnership Guide
            </Button>
          </div>
        </div>

        {/* Partnership Model */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Partnership Model
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the infrastructure, farmers, and support you need to scale your agricultural innovations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnershipModel.map((model, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${model.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <model.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{model.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{model.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Solution Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solution Categories We Support
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From IoT sensors to drones, we help scale diverse agricultural technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutionCategories.map((category, index) => (
              <Card key={index} className={`border-2 ${category.color} hover:shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <category.icon className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{category.category}</CardTitle>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 mb-3">Examples:</h4>
                  <div className="space-y-2">
                    {category.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 text-sm">{example}</span>
                      </div>
                    ))}
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
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how startups have scaled their solutions through AgriValah partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={story.image} 
                      alt={story.company}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{story.company}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">
                        {story.solution}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <span className="font-semibold text-green-600">{story.impact}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Growth:</span>
                      <span className="font-semibold text-blue-600">{story.growth}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed">
                    "{story.testimonial}"
                  </p>
                  <div className="flex mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Why Partner with AgriValah?
                  </h3>
                  <p className="text-blue-100 text-lg leading-relaxed mb-6">
                    We provide the complete ecosystem you need to test, scale, and succeed with your agricultural innovations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-200" />
                        <span className="text-blue-100 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Lightbulb className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold">Innovation Ecosystem</h4>
                    <p className="text-blue-100">
                      From ideation to implementation, we support your complete journey
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center pt-4">
                      <div>
                        <div className="text-2xl font-bold">2,500+</div>
                        <div className="text-xs text-blue-200">Farmers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">150+</div>
                        <div className="text-xs text-blue-200">Schools</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">10</div>
                        <div className="text-xs text-blue-200">States</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Scale Your AgriTech?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our network of innovative startups transforming agriculture across India. 
                Let's build the future of farming together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("JoinUs")}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl">
                    <Building className="w-5 h-5 mr-2" />
                    Apply for Partnership
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Schedule a Call
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * No upfront costs | Revenue sharing model | 30-day pilot program available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}