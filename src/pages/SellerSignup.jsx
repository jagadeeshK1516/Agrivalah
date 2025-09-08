import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Store, 
  Building,
  Truck,
  Sprout,
  Eye, 
  EyeOff,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Upload,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useEffect } from "react";
import { sellerAPI } from "@/api/apiClient";
import { toast } from "sonner";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}

const sellerTypes = [
  {
    type: "farmer",
    title: "Farmer",
    description: "Grow and sell organic produce directly",
    icon: Sprout,
    color: "from-green-600 to-emerald-600"
  },
  {
    type: "reseller",
    title: "Reseller",
    description: "Retail organic products in your area",
    icon: Store,
    color: "from-blue-600 to-indigo-600"
  },
  {
    type: "startup",
    title: "Agritech Startup",
    description: "Provide tech solutions for agriculture",
    icon: Building,
    color: "from-purple-600 to-violet-600"
  },
  {
    type: "service",
    title: "Service Provider",
    description: "Offer equipment and farming services",
    icon: Truck,
    color: "from-orange-600 to-red-600"
  }
];

const soilTypes = ["Sandy", "Loamy", "Clay", "Alluvial", "Black", "Laterite", "Red"];
const cropTypes = ["Grains", "Fruits", "Vegetables", "Spices", "Pulses", "Oil Seeds", "Cash Crops"];
const businessTypes = ["Individual Reseller", "Retail Shop", "Online Seller", "Wholesale Distributor"];
const productCategories = ["Grocery", "Electronics", "Fashion", "Farm Produce", "Agri Inputs", "Tools & Equipment"];
const startupTypes = ["Agri SaaS", "Farm Equipment", "Agri-fintech", "Logistics", "Advisory", "Drone Services", "IoT Solutions"];
const serviceTypes = [
  "Tractor Rental Services",
  "Harvesters / Combine Harvesters", 
  "Power Tillers & Cultivators",
  "Seeders, Planters, Transplanters",
  "Sprayers & Drone Services",
  "Irrigation Providers",
  "Cold Storage & Warehousing"
];

export default function SellerSignupPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [selectedType, setSelectedType] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Universal fields
    designation: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    
    // Farmer fields
    acres: '',
    soilType: '',
    cropsGrown: [],
    cropDetails: '',
    location: '',
    pinCode: '',
    language: '',
    
    // Reseller fields
    businessName: '',
    businessType: '',
    gstNumber: '',
    businessAddress: '',
    preferredCategories: [],
    
    // Startup fields
    companyName: '',
    registrationNumber: '',
    companyAddress: '',
    natureOfBusiness: '',
    yearsInOperation: '',
    collaborationAreas: [],
    
    // Service Provider fields
    selectedServices: [],
    vehicleNumber: '',
    model: '',
    rentPerDay: '',
    serviceArea: '',
    equipmentDetails: '',
    capacity: '',
    serviceCharges: '',
    storageCapacity: '',
    storageType: '',
    rentalModel: ''
  });
  const [errors, setErrors] = React.useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMultiSelect = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.designation) newErrors.designation = 'Please select your designation';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email/Phone is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && !/^\d{10}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email or 10-digit phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (selectedType === 'farmer') {
      if (!formData.acres) newErrors.acres = 'Acres of land is required';
      if (!formData.soilType) newErrors.soilType = 'Soil type is required';
      if (formData.cropsGrown.length === 0) newErrors.cropsGrown = 'Select at least one crop type';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.pinCode) newErrors.pinCode = 'Pin code is required';
    } else if (selectedType === 'reseller') {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
    } else if (selectedType === 'startup') {
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.companyAddress) newErrors.companyAddress = 'Company address is required';
      if (!formData.natureOfBusiness) newErrors.natureOfBusiness = 'Nature of business is required';
    } else if (selectedType === 'service') {
      if (formData.selectedServices.length === 0) newErrors.selectedServices = 'Select at least one service type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [sellerId, setSellerId] = React.useState(null);

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setLoading(true);
      try {
        // Initialize seller registration
        const response = await sellerAPI.initSeller({
          designation: selectedType,
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        
        if (response.data.success) {
          setSellerId(response.data.data.userId);
          setStep(2);
          toast.success("Basic information saved!");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else if (step === 2 && validateStep2()) {
      setLoading(true);
      try {
        let response;
        
        // Call appropriate API based on seller type
        if (selectedType === 'farmer') {
          response = await sellerAPI.farmerDetails({
            userId: sellerId,
            acres: parseFloat(formData.acres),
            soilType: formData.soilType,
            cropsGrown: formData.cropsGrown,
            cropDetails: formData.cropDetails,
            location: formData.location,
            pinCode: formData.pinCode,
            language: formData.language || 'en'
          });
        } else if (selectedType === 'reseller') {
          response = await sellerAPI.resellerDetails({
            userId: sellerId,
            businessName: formData.businessName,
            businessType: formData.businessType,
            businessAddress: formData.businessAddress,
            gstNumber: formData.gstNumber,
            preferredCategories: formData.preferredCategories || []
          });
        } else if (selectedType === 'startup') {
          response = await sellerAPI.startupDetails({
            userId: sellerId,
            companyName: formData.companyName,
            companyAddress: formData.companyAddress,
            natureOfBusiness: formData.natureOfBusiness,
            registrationNumber: formData.registrationNumber,
            yearsInOperation: formData.yearsInOperation,
            collaborationAreas: formData.collaborationAreas || []
          });
        } else if (selectedType === 'service') {
          response = await sellerAPI.serviceProviderDetails({
            userId: sellerId,
            selectedServices: formData.selectedServices,
            serviceArea: formData.serviceArea,
            vehicleNumber: formData.vehicleNumber,
            model: formData.model,
            rentPerDay: formData.rentPerDay,
            equipmentDetails: formData.equipmentDetails,
            serviceCharges: formData.serviceCharges,
            storageCapacity: formData.storageCapacity,
            storageType: formData.storageType,
            rentalModel: formData.rentalModel
          });
        }
        
        if (response?.data.success) {
          // Send OTP
          await sellerAPI.sendOTP({ emailOrPhone: formData.email });
          setStep(3);
          toast.success("Details saved! OTP sent to your email.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    try {
      const response = await sellerAPI.verifyOTP({
        userId: sellerId,
        emailOrPhone: formData.email,
        otp: formData.otp
      });
      
      if (response.data.success) {
        toast.success("Seller registration completed successfully!");
        setStep(4); // Success step
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      setErrors({ otp: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate(createPageUrl("SellerDashboard"));
  };

  const getProgressPercentage = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    if (step === 3) return 90;
    return 100;
  };

  // Step 1: Seller Type Selection & Basic Info
  if (step === 1) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Store className="w-4 h-4 mr-2" />
              Seller Registration
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join as a Seller</h1>
            <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Step 1 of 3: Basic Information</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {sellerTypes.map((seller) => (
                  <Card
                    key={seller.type}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                      selectedType === seller.type 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => {
                      setSelectedType(seller.type);
                      setFormData(prev => ({ ...prev, designation: seller.type }));
                    }}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${seller.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                        <seller.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg">{seller.title}</CardTitle>
                      <p className="text-sm text-gray-600">{seller.description}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <form className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email or Phone Number *</Label>
                  <Input
                    id="email"
                    placeholder="Enter email or phone number"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="bg-gradient-to-r from-green-600 to-emerald-600">
                    Next Step <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Role-specific Information
  if (step === 2) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Store className="w-4 h-4 mr-2" />
              Seller Registration
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {selectedType === 'farmer' && 'Farmer Details'}
              {selectedType === 'reseller' && 'Reseller Information'}
              {selectedType === 'startup' && 'Startup Information'}
              {selectedType === 'service' && 'Service Provider Details'}
            </h1>
            <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Step 2 of 3: Detailed Information</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                {/* Farmer Fields */}
                {selectedType === 'farmer' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="acres">Acres of Land *</Label>
                        <Input
                          id="acres"
                          type="number"
                          placeholder="e.g. 5.5"
                          value={formData.acres}
                          onChange={(e) => handleInputChange('acres', e.target.value)}
                          className={errors.acres ? 'border-red-500' : ''}
                        />
                        {errors.acres && <p className="text-red-500 text-sm mt-1">{errors.acres}</p>}
                      </div>

                      <div>
                        <Label htmlFor="soilType">Type of Soil *</Label>
                        <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                          <SelectTrigger className={errors.soilType ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {soilTypes.map(soil => (
                              <SelectItem key={soil} value={soil.toLowerCase()}>{soil}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.soilType && <p className="text-red-500 text-sm mt-1">{errors.soilType}</p>}
                      </div>
                    </div>

                    <div>
                      <Label>Crops Grown *</Label>
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        {cropTypes.map(crop => (
                          <div key={crop} className="flex items-center space-x-2">
                            <Checkbox
                              id={crop}
                              checked={formData.cropsGrown.includes(crop)}
                              onCheckedChange={(checked) => handleMultiSelect('cropsGrown', crop, checked)}
                            />
                            <Label htmlFor={crop} className="text-sm">{crop}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.cropsGrown && <p className="text-red-500 text-sm mt-1">{errors.cropsGrown}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cropDetails">Crop Details</Label>
                      <Textarea
                        id="cropDetails"
                        placeholder="Describe your crops, farming methods, yield estimates..."
                        value={formData.cropDetails}
                        onChange={(e) => handleInputChange('cropDetails', e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="District, State, Village"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                      </div>

                      <div>
                        <Label htmlFor="pinCode">Pin Code *</Label>
                        <Input
                          id="pinCode"
                          placeholder="e.g. 110001"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                          className={errors.pinCode ? 'border-red-500' : ''}
                        />
                        {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Reseller Fields */}
                {selectedType === 'reseller' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessName">Business/Shop Name *</Label>
                        <Input
                          id="businessName"
                          placeholder="Enter business name"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className={errors.businessName ? 'border-red-500' : ''}
                        />
                        {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                          <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map(type => (
                              <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gstNumber">GST Number / Tax ID</Label>
                      <Input
                        id="gstNumber"
                        placeholder="e.g. 07AABCU9603R1ZM (Optional)"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <Textarea
                        id="businessAddress"
                        placeholder="Enter complete business address"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        className={errors.businessAddress ? 'border-red-500' : ''}
                      />
                      {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>}
                    </div>

                    <div>
                      <Label>Preferred Product Categories</Label>
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        {productCategories.map(category => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={formData.preferredCategories.includes(category)}
                              onCheckedChange={(checked) => handleMultiSelect('preferredCategories', category, checked)}
                            />
                            <Label htmlFor={category} className="text-sm">{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Startup Fields */}
                {selectedType === 'startup' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Startup/Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className={errors.companyName ? 'border-red-500' : ''}
                        />
                        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="registrationNumber">Registration Number / Tax ID</Label>
                        <Input
                          id="registrationNumber"
                          placeholder="Company registration number"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="companyAddress">Business Address *</Label>
                      <Textarea
                        id="companyAddress"
                        placeholder="Enter complete business address"
                        value={formData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        className={errors.companyAddress ? 'border-red-500' : ''}
                      />
                      {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="natureOfBusiness">Nature of Business *</Label>
                        <Select value={formData.natureOfBusiness} onValueChange={(value) => handleInputChange('natureOfBusiness', value)}>
                          <SelectTrigger className={errors.natureOfBusiness ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select business nature" />
                          </SelectTrigger>
                          <SelectContent>
                            {startupTypes.map(type => (
                              <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.natureOfBusiness && <p className="text-red-500 text-sm mt-1">{errors.natureOfBusiness}</p>}
                      </div>

                      <div>
                        <Label htmlFor="yearsInOperation">Years in Operation</Label>
                        <Input
                          id="yearsInOperation"
                          type="number"
                          placeholder="e.g. 2"
                          value={formData.yearsInOperation}
                          onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Service Provider Fields */}
                {selectedType === 'service' && (
                  <>
                    <div>
                      <Label>Service Type *</Label>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        {serviceTypes.map(service => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.selectedServices.includes(service)}
                              onCheckedChange={(checked) => handleMultiSelect('selectedServices', service, checked)}
                            />
                            <Label htmlFor={service} className="text-sm">{service}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.selectedServices && <p className="text-red-500 text-sm mt-1">{errors.selectedServices}</p>}
                    </div>

                    {/* Dynamic fields based on selected services */}
                    {formData.selectedServices.includes("Tractor Rental Services") && (
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                          <Input
                            id="vehicleNumber"
                            placeholder="e.g. HR-01-AB-1234"
                            value={formData.vehicleNumber}
                            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model</Label>
                          <Input
                            id="model"
                            placeholder="e.g. Mahindra 575"
                            value={formData.model}
                            onChange={(e) => handleInputChange('model', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="rentPerDay">Rent per Day (₹)</Label>
                          <Input
                            id="rentPerDay"
                            type="number"
                            placeholder="e.g. 2500"
                            value={formData.rentPerDay}
                            onChange={(e) => handleInputChange('rentPerDay', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {(formData.selectedServices.includes("Sprayers & Drone Services") || 
                      formData.selectedServices.includes("Harvesters / Combine Harvesters")) && (
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="equipmentDetails">Equipment Details</Label>
                          <Textarea
                            id="equipmentDetails"
                            placeholder="Describe your equipment..."
                            value={formData.equipmentDetails}
                            onChange={(e) => handleInputChange('equipmentDetails', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="serviceCharges">Service Charges (₹)</Label>
                          <Input
                            id="serviceCharges"
                            placeholder="Per hour/acre charges"
                            value={formData.serviceCharges}
                            onChange={(e) => handleInputChange('serviceCharges', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {formData.selectedServices.includes("Cold Storage & Warehousing") && (
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="storageCapacity">Storage Capacity</Label>
                          <Input
                            id="storageCapacity"
                            placeholder="e.g. 1000 tons"
                            value={formData.storageCapacity}
                            onChange={(e) => handleInputChange('storageCapacity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="storageType">Storage Type</Label>
                          <Select value={formData.storageType} onValueChange={(value) => handleInputChange('storageType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grain">Grain Storage</SelectItem>
                              <SelectItem value="vegetables">Vegetable Cold Storage</SelectItem>
                              <SelectItem value="fruits">Fruit Cold Storage</SelectItem>
                              <SelectItem value="mixed">Mixed Storage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="rentalModel">Rental Model</Label>
                          <Input
                            id="rentalModel"
                            placeholder="e.g. ₹50/quintal/month"
                            value={formData.rentalModel}
                            onChange={(e) => handleInputChange('rentalModel', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={handleNext} className="bg-gradient-to-r from-green-600 to-emerald-600">
                    Get OTP <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: OTP Verification
  if (step === 3) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Store className="w-4 h-4 mr-2" />
              Seller Registration
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Verify OTP</h1>
            <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Step 3 of 3: Verification</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Verify Your Account
              </CardTitle>
              <p className="text-gray-600 text-center">
                We've sent a 6-digit code to {formData.email}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, ''))}
                    className={`text-center text-2xl tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <Alert>
                  <AlertDescription>
                    For demo purposes, use OTP: <strong>123456</strong>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Complete'}
                  </Button>
                </div>
              </form>

              <div className="text-center mt-6">
                <Button variant="ghost">
                  Resend OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to AgriValah!
              </h2>
              <p className="text-gray-600 mb-8">
                Your seller account has been successfully created. You can now access your dashboard and start managing your business.
              </p>
              <Button 
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-green-600 to-emerald-600 w-full"
              >
                Go to Seller Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}