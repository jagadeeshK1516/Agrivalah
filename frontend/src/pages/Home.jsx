
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Heart, 
  Building, 
  GraduationCap,
  Users,
  Shield,
  Eye,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  HandHeart
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}



const metrics = [
  { label: "Target Farmers", value: "5,000", color: "text-green-600", link: createPageUrl("Farmers") },
  { label: "Target Mitras", value: "5,000", color: "text-blue-600", link: createPageUrl("Mitras") },
  { label: "Sellers", value: "1,000+", color: "text-purple-600", link: createPageUrl("Sellers") },
  { label: "Daily Markets", value: "125+", color: "text-orange-600", link: createPageUrl("Markets") }
];

const features = [
  {
    icon: Shield,
    title: "Insurance Protected",
    description: "Crop failures don't break farmer livelihoods or Mitra supplies with comprehensive insurance coverage"
  },
  {
    icon: Eye,
    title: "Complete Transparency",
    description: "Public dashboards show farmer prices, deliveries, and grievance SLAs - no hidden fees"
  },
  {
    icon: TrendingUp,
    title: "Guaranteed ROI",
    description: "Mitras get ₹54,000 worth of organic produce for ₹42,000 investment - ₹12,000 net ROI"
  }
];

const testimonials = [
  {
    name: "Ramesh Kumar",
    role: "Organic Farmer, Haryana",
    content: "With AgriValah, I get fair prices directly and my name is on every pack. No more middlemen taking cuts.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    name: "Priya Sharma",
    role: "Mitra, Delhi",
    content: "₹4,500 worth of organic produce delivered monthly. My family eats healthy and I support farmers directly.",
    image: "https://blogs-images.forbes.com/cognitiveworld/files/2019/07/Depositphotos_162344144_s-2019.jpg"
  },
  {
    name: "Arun Singh",
    role: "Student, Green Valley School",
    content: "We grow vegetables in our school farm and take fresh produce home. It's amazing to know where food comes from!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  }
];

const ctaOptions = [
  {
    title: "Join as a Mitra",
    description: "Support farmers and get ₹54,000 worth of organic produce for ₹42,000",
    icon: Heart,
    color: "from-pink-600 to-red-600",
    link: "Mitras"
  },
  {
    title: "Onboard as Farmer",
    description: "₹12,000/year subscription for training, storage, branding & market access",
    icon: Sprout,
    color: "from-green-600 to-emerald-600",
    link: "Farmers"
  },
  {
    title: "Start a Local Hub",
    description: "Run procurement, packing & logistics. Earn 8% on kits with loan support",
    icon: HandHeart,
    color: "from-purple-600 to-violet-600",
    link: "SHGs"
  },
  {
    title: "Partner as Startup",
    description: "Access 5,000+ farmers for low-margin distribution of agri-tech solutions",
    icon: Building,
    color: "from-blue-600 to-indigo-600",
    link: "Startups"
  }
];

export default function HomePage() {
  useScrollToTop();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200')] bg-cover bg-center opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-6 text-lg px-6 py-2 transition-colors duration-300 hover:bg-green-600 hover:text-white">
              From Farmer to Family – Clean, Insured, Transparent
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AgriValah
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 mb-6 font-medium">
              Fixing India's Broken Food System
            </p>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
              A direct, insured, and transparent bridge connecting farmers and families. 
              No middlemen. No guesswork. No freebies. Just clean organic food and fair prices for everyone.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <div key={index} className="group">
                  {metric.link ? (
                    <Link to={metric.link}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:scale-105">
                        <div className={`text-3xl font-bold ${metric.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          {metric.label}
                        </div>
                        <ArrowRight className="w-4 h-4 mx-auto mt-2 text-gray-400 group-hover:text-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                      <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to={createPageUrl("JoinUs")}>
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl text-lg px-8 py-4">
                  <Users className="w-6 h-6 mr-2" />
                  Get Started Now
                </Button>
              </Link>
              <Link to={createPageUrl("HowItWorks")}>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  Watch How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why AgriValah Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on transparency, powered by insurance, driven by fair economics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Video/Infographic */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple 7-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              From farmer onboarding to doorstep delivery - completely transparent
            </p>
          </div>

          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-7 gap-4">
                {[
                  "Onboard & Verify Farmers",
                  "Train & Supply Inputs",
                  "Insure Crop Cycles",
                  "Procure via Local Hubs",
                  "Stamp & Pack with Names",
                  "Distribute to All Channels",
                  "Publish Transparent Data"
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to={createPageUrl("HowItWorks")}>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get Started Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to join the AgriValah ecosystem - all with clear benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ctaOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <Link to={createPageUrl(option.link)}>
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed text-lg mb-4">{option.description}</p>
                    <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from farmers, families, and students who are part of the AgriValah community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-xl mb-8 text-green-100 leading-relaxed">
            Join thousands of farmers, families, and changemakers building India's most transparent food system.
            No free services - just sustainable economics that work for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://agrivalah-connect-57ea877e.base44.app" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-xl text-lg px-8 py-4">
                <Users className="w-6 h-6 mr-2" />
                Join AgriValah Today
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-white text-green-400 hover:bg-white/10 text-lg px-8 py-4">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
