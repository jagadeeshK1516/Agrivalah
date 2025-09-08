import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Heart, 
  ShoppingCart, 
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userAPI } from "@/api/apiClient";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}

export default function DashboardPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(createPageUrl("Auth"));
      return;
    }
    
    // Fetch user stats
    const fetchStats = async () => {
      try {
        const response = await userAPI.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout locally
      logout();
      navigate(createPageUrl("Home"));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const quickActions = user.role === 'mitra' ? [
    { title: "View Farmer Partners", icon: User, desc: "See your paired farmers", color: "from-green-500 to-emerald-600" },
    { title: "Monthly Kit Status", icon: Package, desc: "Track your deliveries", color: "from-blue-500 to-indigo-600" },
    { title: "Investment Summary", icon: BarChart3, desc: "View ROI details", color: "from-purple-500 to-violet-600" },
    { title: "Support Tickets", icon: Bell, desc: "Customer support", color: "from-orange-500 to-red-600" }
  ] : [
    { title: "Browse Products", icon: ShoppingCart, desc: "Shop organic produce", color: "from-green-500 to-emerald-600" },
    { title: "Order History", icon: Package, desc: "View past orders", color: "from-blue-500 to-indigo-600" },
    { title: "Delivery Schedule", icon: Calendar, desc: "Upcoming deliveries", color: "from-purple-500 to-violet-600" },
    { title: "Account Settings", icon: Settings, desc: "Manage your account", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user.fullName}!
            </h1>
            <Badge className={`${
              user.role === 'mitra' 
                ? 'bg-pink-100 text-pink-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role === 'mitra' ? (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Mitra Member
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Customer
                </>
              )}
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* User Profile Card */}
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
                  <p className="text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email/Phone</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Type</label>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                {user.role === 'mitra' ? 'Mitra Dashboard' : 'Customer Dashboard'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.role === 'mitra' ? (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">₹42,000</div>
                    <div className="text-sm text-gray-600">Annual Investment</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">₹54,000</div>
                    <div className="text-sm text-gray-600">Product Value</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">₹12,000</div>
                    <div className="text-sm text-gray-600">Net ROI</div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">₹0</div>
                    <div className="text-sm text-gray-600">Amount Spent</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Saved Amount</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{action.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
              <p className="text-sm">Start by exploring our products or services</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}