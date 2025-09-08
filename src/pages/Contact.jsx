import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  MessageSquare,
  Clock,
  Globe
} from "lucide-react";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}


const contactDetails = [
  {
    type: "Registered Office",
    address: "Repalle-522265, Dist- Bapatla, Andhra Pradesh, India",
    icon: Building,
    color: "from-green-500 to-emerald-600"
  },
  {
    type: "Admin Office", 
    address: "Lower Tipra-174103, Baddi, Dist- Solan, Himachal Pradesh, India",
    icon: Building,
    color: "from-blue-500 to-indigo-600"
  },
  {
    type: "Unit Office",
    address: "MBR Nagar, Dist- Malkajgiri - 500088, Hyderabad, Telangana, India",
    icon: Building,
    color: "from-purple-500 to-violet-600"
  }
];

const quickContacts = [
    {
        title: "Call Us",
        value: "+91-8331919474",
        icon: Phone,
        href: "tel:+918331919474",
        color: "from-green-500 to-emerald-600"
    },
    {
        title: "Email Us",
        value: "mail.cyano@gmail.com", 
        icon: Mail,
        href: "mailto:mail.cyano@gmail.com",
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Follow Us",
        value: "@cyanofoods",
        icon: User,
        href: "https://twitter.com/cyanofoods",
        color: "from-purple-500 to-violet-600"
    },
    {
        title: "Website",
        value: "www.cyanoindia.com",
        icon: Globe,
        href: "https://www.cyanoindia.com",
        color: "from-orange-500 to-red-600"
    }
];

const businessHours = [
  { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
  { day: "Saturday", time: "10:00 AM - 4:00 PM" },
  { day: "Sunday", time: "Closed" }
];

export default function ContactPage() {
  useScrollToTop();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    alert("Thank you for your message. We will get back to you shortly.");
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4  transition-colors duration-300 hover:bg-green-600 hover:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Let's Connect
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Ready to join the AgriValah movement? Have questions about our programs? 
            We're here to help you get started on your journey to sustainable agriculture.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {quickContacts.map((contact, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <contact.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{contact.title}</h3>
                <a 
                  href={contact.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                >
                  {contact.value}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Send Us a Message
                </CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input id="name" placeholder="Your Name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input id="phone" type="tel" placeholder="Your Phone Number" />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="mitra">Prospective Mitra</SelectItem>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="shg">SHG / Youth Group</SelectItem>
                          <SelectItem value="school">School / College</SelectItem>
                          <SelectItem value="consumer">Consumer</SelectItem>
                          <SelectItem value="investor">Investor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Input id="subject" placeholder="What's this about?" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} required />
                  </div>
                  <div>
                    <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            {/* Business Hours */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600"/>
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{schedule.day}</span>
                    <span className="font-semibold text-gray-900">{schedule.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Locations */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600"/>
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactDetails.map((office, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${office.color} rounded-lg flex items-center justify-center`}>
                        <office.icon className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-800">{office.type}</h4>
                    </div>
                    <p className="text-gray-600 text-sm">{office.address}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Company Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>CIN:</strong> U15200AP2022OPC122607</p>
                  <p><strong>Nature:</strong> One Person Company</p>
                  <p><strong>Sector:</strong> Agricultural Technology</p>
                  <p><strong>Founded:</strong> 2022</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}