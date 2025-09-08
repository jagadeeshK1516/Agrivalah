

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Menu,
  X,
  ChevronDown,
  Sprout,
  Heart,
  Building,
  Users,
  GraduationCap,
  Briefcase,
  Tractor,
  Warehouse,
  ShoppingBasket,
  Store,
  Truck,
  Newspaper,
  CloudSun,
  LayoutGrid,
  Video,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "About Us", url: createPageUrl("About") },
];

const agriConnectItems = [
  { title: "For Farmers", url: createPageUrl("Farmers"), icon: Sprout, subtitle: "Grow with us, insured and secure." },
  { title: "For Mitras", url: createPageUrl("Mitras"), icon: Heart, subtitle: "Support farmers, feed your family." },
  { title: "For Sellers", url: createPageUrl("Sellers"), icon: Store, subtitle: "Sell organic produce with us." },
  { title: "For Startups", url: createPageUrl("Startups"), icon: Building, subtitle: "Scale your agri-tech solutions." },
  { title: "SHGs & Youth", url: createPageUrl("SHGs"), icon: Users, subtitle: "Lead change in your community." },
  { title: "Schools & Colleges", url: createPageUrl("Schools"), icon: GraduationCap, subtitle: "Educate future agri-leaders." },
];

const agriZoneItems = [
  { title: "Nature Farming", url: createPageUrl("NatureFarming"), icon: BookOpen, subtitle: "Organic methods and SOPs." },
  { title: "Daily Markets", url: createPageUrl("Markets"), icon: Store, subtitle: "Fresh produce markets." },
  { title: "Services", url: createPageUrl("Services"), icon: Briefcase, subtitle: "Book agri-services on demand." },
  { title: "Buy Farm Machinery", url: createPageUrl("FarmMachineryBuy"), icon: Tractor, subtitle: "Purchase new equipment." },
  { title: "Rent Farm Machinery", url: createPageUrl("FarmMachineryRent"), icon: Briefcase, subtitle: "Lease equipment on demand." },
];

const marketplaceItems = [
  { title: "Online Store", url: createPageUrl("OnlineStore"), icon: ShoppingBasket, subtitle: "Fresh produce delivered." },
  { title: "Offline Stores", url: createPageUrl("OfflineStores"), icon: Store, subtitle: "Find our markets near you." },
  { title: "Business Model", url: createPageUrl("BusinessModel"), icon: Truck, subtitle: "Book Models and agri-services." },
  
];

// Mock user state
const useUser = () => {
  const [user, setUser] = React.useState(null);
  // In a real app, this would be an API call
  React.useEffect(() => {
    // setUser({ name: "Ramesh K." });
  }, []);
  return { user };
};

const MyAgriValahStrip = () => (
  <div className="bg-green-800 text-white p-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My AgriValah</h2>
        <Button variant="ghost" size="sm" className="text-white hover:bg-green-700">Dismiss</Button>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-green-700 p-3 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center"><Newspaper className="w-4 h-4 mr-2"/>Agri News & Schemes</h3>
          <p className="text-sm text-green-200">PM-KISAN update for Haryana.</p>
        </div>
        <div className="bg-green-700 p-3 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center"><CloudSun className="w-4 h-4 mr-2"/>Weather & Alerts</h3>
          <p className="text-sm text-green-200">Light rain expected tomorrow.</p>
        </div>
        <div className="bg-green-700 p-3 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center"><LayoutGrid className="w-4 h-4 mr-2"/>Marketplace</h3>
          <p className="text-sm text-green-200">New sprayers available for rent.</p>
        </div>
        <div className="bg-green-700 p-3 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center"><Video className="w-4 h-4 mr-2"/>Media & Community</h3>
          <p className="text-sm text-green-200">Watch new training video on drip irrigation.</p>
        </div>
      </div>
    </div>
  </div>
);


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hoveredDropdown, setHoveredDropdown] = React.useState(null);
  const hoverTimeoutRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const [mainPadding, setMainPadding] = React.useState(0);

  // Redirect to home page on browser refresh
  React.useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    if (navigationEntries.length > 0 && navigationEntries[0].type === 'reload') {
      // Check if we are not already on the home page to avoid a refresh loop
      if (location.pathname !== createPageUrl("Home")) {
         navigate(createPageUrl("Home"));
      }
    }
  }, [navigate, location.pathname]);


  // Dynamically calculate header height and set padding for main content
  React.useEffect(() => {
    const updatePadding = () => {
      if (headerRef.current) {
        setMainPadding(headerRef.current.offsetHeight);
      }
    };
    updatePadding();
    // Recalculate on window resize
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [user, children]); // Recalculate if user state or page changes

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        location.pathname === to
          ? 'bg-green-100 text-green-800 shadow-sm'
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      {children}
    </Link>
  );

  const handleMouseEnter = (dropdownKey) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredDropdown(dropdownKey);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing the dropdown
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
    }, 150); // 150ms delay
  };

  // New HoverDropdown component
  const HoverDropdown = ({ title, items, dropdownKey }) => (
    <div 
      className="relative"
      onMouseEnter={() => handleMouseEnter(dropdownKey)}
      onMouseLeave={handleMouseLeave}
    >
      <Button 
        variant="ghost" 
        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 data-[state=open]:bg-green-50"
      >
        {title} <ChevronDown className="w-4 h-4 ml-1" />
      </Button>
      
      {hoveredDropdown === dropdownKey && (
        <div 
          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
          onMouseEnter={() => handleMouseEnter(dropdownKey)}
          onMouseLeave={handleMouseLeave}
        >
          {items.map(item => (
            <Link 
              key={item.title} 
              to={item.url} 
              className="flex items-start p-3 hover:bg-gray-50 transition-colors duration-200"
            >
              <item.icon className="w-5 h-5 mr-3 text-green-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
        {user && <MyAgriValahStrip />}
        <header className="bg-white shadow-lg border-b border-green-100 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-24">
              <Link to={createPageUrl("Home")} className="flex items-center space-x-3 group">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f10ca34cd_agrivalahLogo.jpg"
                  alt="AgriValah Logo"
                  className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  AgriValah
                </h1>
              </Link>

              <nav className="hidden lg:flex items-center space-x-1">
                {mainNavItems.map(item => <NavLink key={item.title} to={item.url}>{item.title}</NavLink>)}
                {/* Replace Dropdown with HoverDropdown */}
                <HoverDropdown title="AgriConnect" items={agriConnectItems} dropdownKey="agriconnect" />
                <HoverDropdown title="AgriZone" items={agriZoneItems} dropdownKey="agrizone" />
                <HoverDropdown title="Marketplace" items={marketplaceItems} dropdownKey="marketplace" />
              </nav>

              <div className="hidden sm:flex items-center space-x-3">
                <Link to={createPageUrl("SellerSignup")}>
                  <Button className="bg-green-800 hover:bg-green-900 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Store className="w-4 h-4 mr-2" />
                    Seller
                  </Button>
                </Link>
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    Contact Us
                  </Button>
                </Link>
                <Link to={createPageUrl("Auth")}>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Users className="w-4 h-4 mr-2" />
                    Login/Signup
                  </Button>
                </Link>
              </div>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="connect">
                        <AccordionTrigger className="font-medium">AgriConnect</AccordionTrigger>
                        <AccordionContent>
                          {agriConnectItems.map(item => (
                            <Link key={item.title} to={item.url} className="flex p-3 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                              <item.icon className="w-5 h-5 mr-3 text-green-600"/> {item.title}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="zone">
                        <AccordionTrigger className="font-medium">AgriZone</AccordionTrigger>
                        <AccordionContent>
                          {agriZoneItems.map(item => (
                            <Link key={item.title} to={item.url} className="flex p-3 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                              <item.icon className="w-5 h-5 mr-3 text-green-600"/> {item.title}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="market">
                        <AccordionTrigger className="font-medium">Marketplace</AccordionTrigger>
                        <AccordionContent>
                          {marketplaceItems.map(item => (
                            <Link key={item.title} to={item.url} className="flex p-3 hover:bg-gray-50" onClick={() => setMobileMenuOpen(false)}>
                              <item.icon className="w-5 h-5 mr-3 text-green-600"/> {item.title}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {[
                      ...mainNavItems, 
                      { title: "Seller", url: createPageUrl("SellerSignup") }, 
                      { title: "Contact", url: createPageUrl("Contact") }, 
                      { title: "Login/Signup", url: createPageUrl("Auth") }
                    ].map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className="px-4 py-3 rounded-xl transition-all duration-200 font-medium text-gray-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          Contact Us
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      </div>

      <main className="flex-1" style={{ paddingTop: `${mainPadding}px` }}>
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/f10ca34cd_agrivalahLogo.jpg"
                  alt="AgriValah Logo"
                  className="h-16 w-auto object-contain"
                />
                 <h2 className="text-3xl font-bold bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent">
                  AgriValah
                </h2>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                "Nature Farming With Mother Nature – For a Sustainable Future"
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Building a direct, insured, and transparent bridge from farm to family.
              </p>
              <div className="flex space-x-4">
                <span className="text-sm text-gray-400">📞 +91-8331919474</span>
                <span className="text-sm text-gray-400">✉️ mail.cyano@gmail.com</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("About")} className="block text-gray-300 hover:text-white transition-colors">About Us</Link>
                <Link to={createPageUrl("BusinessModel")} className="block text-gray-300 hover:text-white transition-colors">Business Model</Link>
                <Link to={createPageUrl("Contact")} className="block text-gray-300 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Get Started</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("Farmers")} className="block text-gray-300 hover:text-white transition-colors">Become a Farmer</Link>
                <Link to={createPageUrl("Mitras")} className="block text-gray-300 hover:text-white transition-colors">Join as Mitra</Link>
                <Link to={createPageUrl("Startups")} className="block text-gray-300 hover:text-white transition-colors">Partner as Startup</Link>
                <Link to={createPageUrl("Schools")} className="block text-gray-300 hover:text-white transition-colors">School Partnership</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © 2024 Cyano Foods India OPC Pvt Ltd. CIN: U15200AP2022OPC122607. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-sm text-gray-400">🌐 www.cyanoindia.com</span>
                <span className="text-sm text-gray-400">📱 @cyanofoods</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

