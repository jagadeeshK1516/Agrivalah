import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Store, 
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Calendar,
  Sprout,
  Building,
  Truck,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {useEffect} from "react";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}

export default function SellerDashboardPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [seller, setSeller] = React.useState(null);

  React.useEffect(() => {
    const sellerData = localStorage.getItem('agrivalah_seller');
    if (sellerData) {
      setSeller(JSON.parse(sellerData));
    } else {
      // Redirect to seller signup if no seller data
      navigate(createPageUrl("SellerSignup"));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('agrivalah_seller');
    navigate(createPageUrl("Home"));
  };

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const getSellerTypeInfo = () => {
    switch (seller.sellerType) {
      case 'farmer':
        return {
          title: 'Farmer Dashboard',
          icon: Sprout,
          color: 'from-green-500 to-emerald-600',
          stats: [
            { label: 'Total Produce Listed', value: '12', icon: Package },
            { label: 'Orders This Month', value: '28', icon: ShoppingCart },
            { label: 'Revenue This Month', value: '₹45,000', icon: DollarSign },
            { label: 'Customer Reviews', value: '4.8/5', icon: Users }
          ]
        };
      case 'reseller':
        return {
          title: 'Reseller Dashboard',
          icon: Store,
          color: 'from-blue-500 to-indigo-600',
          stats: [
            { label: 'Products in Store', value: '156', icon: Package },
            { label: 'Sales This Month', value: '89', icon: TrendingUp },
            { label: 'Revenue', value: '₹1,25,000', icon: DollarSign },
            { label: 'Store Visitors', value: '2,340', icon: Eye }
          ]
        };
      case 'startup':
        return {
          title: 'Startup Dashboard',
          icon: Building,
          color: 'from-purple-500 to-violet-600',
          stats: [
            { label: 'Active Projects', value: '7', icon: Package },
            { label: 'Partner Farmers', value: '145', icon: Users },
            { label: 'Monthly Revenue', value: '₹2,80,000', icon: DollarSign },
            { label: 'Success Rate', value: '94%', icon: TrendingUp }
          ]
        };
      case 'service':
        return {
          title: 'Service Provider Dashboard',
          icon: Truck,
          color: 'from-orange-500 to-red-600',
          stats: [
            { label: 'Active Bookings', value: '23', icon: Calendar },
            { label: 'Services Completed', value: '156', icon: Package },
            { label: 'Monthly Earnings', value: '₹95,000', icon: DollarSign },
            { label: 'Customer Rating', value: '4.6/5', icon: Users }
          ]
        };
      default:
        return {
          title: 'Seller Dashboard',
          icon: Store,
          color: 'from-gray-500 to-gray-600',
          stats: []
        };
    }
  };

  const sellerInfo = getSellerTypeInfo();

  const quickActions = [
    { title: "Add New Product", icon: Package, desc: "List new products for sale", color: "from-green-500 to-emerald-600" },
    { title: "Manage Orders", icon: ShoppingCart, desc: "View and process orders", color: "from-blue-500 to-indigo-600" },
    { title: "View Analytics", icon: BarChart3, desc: "Sales and performance data", color: "from-purple-500 to-violet-600" },
    { title: "Update Profile", icon: Settings, desc: "Edit your seller information", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {seller.name}!
            </h1>
            <Badge className={`bg-gradient-to-r ${sellerInfo.color} text-white`}>
              <sellerInfo.icon className="w-4 h-4 mr-2" />
              {seller.sellerType.charAt(0).toUpperCase() + seller.sellerType.slice(1)}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {sellerInfo.stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${sellerInfo.color} rounded-xl flex items-center justify-center text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Information */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">{seller.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email/Phone</label>
                  <p className="text-gray-900">{seller.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Seller Type</label>
                  <p className="text-gray-900 capitalize">{seller.sellerType}</p>
                </div>
                {seller.sellerType === 'farmer' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Land Size</label>
                      <p className="text-gray-900">{seller.acres} acres</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Soil Type</label>
                      <p className="text-gray-900 capitalize">{seller.soilType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Location</label>
                      <p className="text-gray-900">{seller.location}</p>
                    </div>
                  </>
                )}
                {seller.sellerType === 'reseller' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Name</label>
                      <p className="text-gray-900">{seller.businessName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Type</label>
                      <p className="text-gray-900 capitalize">{seller.businessType?.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
                {seller.sellerType === 'startup' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="text-gray-900">{seller.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nature of Business</label>
                      <p className="text-gray-900 capitalize">{seller.natureOfBusiness?.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
                {seller.sellerType === 'service' && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Services Offered</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {seller.selectedServices?.slice(0, 2).map((service, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                            {service.split(' ')[0]}
                          </Badge>
                        ))}
                        {seller.selectedServices?.length > 2 && (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">
                            +{seller.selectedServices.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity found</p>
              <p className="text-sm">Start by adding products or managing your listings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}