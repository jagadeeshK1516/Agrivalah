import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Sprout, 
  Users, 
  BookOpen,
  Award,
  HandHeart,
  CheckCircle,
  Lightbulb,
  TreePine,
  Target,
  Star,
  ArrowRight
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const programs = [
  {
    icon: Sprout,
    title: "Model Farm Setup",
    description: "Establish educational organic farms on school premises with our complete setup assistance",
    color: "from-green-500 to-emerald-600",
    features: ["Site preparation and soil testing", "Organic seed and input supply", "Irrigation system setup", "Tool and equipment provision"]
  },
  {
    icon: BookOpen,
    title: "Curriculum Integration",
    description: "Integrate practical agriculture into academic curriculum with hands-on learning modules",
    color: "from-blue-500 to-indigo-600",
    features: ["Age-appropriate lesson plans", "Practical activity guides", "Assessment frameworks", "Teacher training programs"]
  },
  {
    icon: Users,
    title: "Student Activities",
    description: "Engage students in farming activities that teach science, responsibility, and sustainability",
    color: "from-purple-500 to-violet-600",
    features: ["Seed to harvest programs", "Composting workshops", "Weather monitoring", "Crop rotation education"]
  },
  {
    icon: HandHeart,
    title: "Take-Home Produce",
    description: "Students take fresh organic produce home, connecting families to healthy eating",
    color: "from-orange-500 to-red-600",
    features: ["Weekly harvest distribution", "Family nutrition education", "Cooking recipe sharing", "Health impact tracking"]
  }
];

const benefits = {
  students: [
    "Hands-on science learning",
    "Understanding of food systems",
    "Responsibility and patience development",
    "Connection to nature and environment",
    "Healthy eating habits formation"
  ],
  schools: [
    "Enhanced curriculum value",
    "Improved student engagement",
    "Community recognition",
    "Additional revenue streams",
    "Environmental leadership"
  ],
  families: [
    "Fresh organic produce at home",
    "Children's health consciousness",
    "Family bonding over gardening",
    "Reduced grocery expenses",
    "Knowledge of sustainable practices"
  ]
};

const successStories = [
  {
    school: "Green Valley International",
    location: "Gurgaon, Haryana",
    students: 450,
    program: "Model Farm + Curriculum",
    impact: "80% increase in science scores",
    testimonial: "Our students now understand where food comes from and why organic matters. The model farm has become the heart of our school.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=100&h=100&fit=crop"
  },
  {
    school: "Bright Minds Public School",
    location: "Delhi NCR",
    students: 320,
    program: "Take-home Program",
    impact: "95% parent satisfaction rate",
    testimonial: "Children are excited to bring home vegetables they grew themselves. It has transformed how families think about food.",
    image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=100&h=100&fit=crop"
  },
  {
    school: "Future Leaders Academy",
    location: "Sonipat, Haryana",
    students: 280,
    program: "Agri Fair Hosting",
    impact: "50+ startups showcased",
    testimonial: "Hosting agri fairs has made our school a hub of innovation. Students are inspired by agricultural technology.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop"
  }
];

const partnershipTypes = [
  {
    type: "Basic Partnership",
    cost: "No cost",
    duration: "1 year renewable",
    features: [
      "Curriculum integration support",
      "Student activity guides",
      "Teacher training (online)",
      "Basic organic farming kit"
    ],
    ideal: "Schools with limited space"
  },
  {
    type: "Model Farm Partnership",
    cost: "Setup assistance",
    duration: "3 year commitment",
    features: [
      "Complete model farm setup",
      "Advanced curriculum materials",
      "On-site teacher training",
      "Take-home produce program",
      "Startup showcase hosting"
    ],
    ideal: "Schools with available land (500+ sqft)"
  },
  {
    type: "Innovation Hub",
    cost: "Revenue sharing",
    duration: "5 year partnership",
    features: [
      "Advanced agri-tech demonstrations",
      "Regular startup showcases",
      "Student internship programs",
      "Community outreach programs",
      "Export of excess produce"
    ],
    ideal: "Progressive schools with 1000+ students"
  }
];

export default function SchoolsPage() {
  useScrollToTop();
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-100 text-purple-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <GraduationCap className="w-4 h-4 mr-2" />
            For Schools & Colleges
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grow Future Farmers & Leaders
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Transform your educational approach with hands-on agricultural learning. Our model farms 
            and integrated curriculum help students understand food systems, science, and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("JoinUs")}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-xl">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Partnership
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Download Program Guide
            </Button>
          </div>
        </div>

        {/* Programs Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Educational Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive programs designed to integrate agriculture into education meaningfully
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <program.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{program.title}</CardTitle>
                  <p className="text-gray-600">{program.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our programs create value for students, schools, and families alike
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.students.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">For Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.schools.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <HandHeart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">For Families</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {benefits.families.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              School Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how schools are transforming education with agricultural integration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={story.image} 
                      alt={story.school}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{story.school}</CardTitle>
                      <p className="text-sm text-gray-600">{story.location}</p>
                      <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">
                        {story.students} students
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Program:</span>
                      <span className="font-semibold text-purple-600">{story.program}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Impact:</span>
                      <span className="font-semibold text-green-600">{story.impact}</span>
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

        {/* Partnership Types */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible partnership options to match your school's resources and commitment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {partnershipTypes.map((partnership, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                index === 1 ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
              }`}>
                <CardHeader>
                  {index === 1 && (
                    <Badge className="bg-purple-100 text-purple-800 mb-4 w-fit">
                      Most Popular
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-bold text-gray-900">{partnership.type}</CardTitle>
                  <div className="text-2xl font-bold text-gray-900 mt-2">{partnership.cost}</div>
                  <p className="text-sm text-gray-600">{partnership.duration}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {partnership.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      <strong>Ideal for:</strong> {partnership.ideal}
                    </p>
                  </div>
                  <Button 
                    className={`w-full mt-6 ${
                      index === 1 
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Choose This Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Agri Fairs & Innovation */}
        <div className="mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Agri Fairs & Startup Showcases
                  </h3>
                  <p className="text-green-100 text-lg leading-relaxed mb-6">
                    Transform your school into an innovation hub by hosting agricultural fairs 
                    and startup demonstrations that inspire students and communities.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Monthly startup demonstrations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Student-startup interaction programs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Career guidance in agri-tech</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-200" />
                      <span className="text-green-100">Community engagement opportunities</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                      <Lightbulb className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold">Innovation Hub Benefits</h4>
                    <div className="grid grid-cols-2 gap-4 text-center pt-4">
                      <div>
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-xs text-green-200">Startups/year</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-green-200">Events/year</div>
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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Education?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join progressive schools across India that are preparing students for the future 
                of agriculture and sustainable living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("JoinUs")}>
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-xl">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Start Your Partnership
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Schedule School Visit
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * No setup costs for basic partnership | Flexible program duration | Ongoing support included
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}