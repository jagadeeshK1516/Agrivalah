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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  Clock,
  School,
  UsersRound,
  Wrench
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
    type: "reseller",
    title: "Reseller / Seller",
    description: "Local shopkeepers, organic stores, bulk buyers",
    icon: Store,
    color: "from-blue-600 to-indigo-600"
  },
  {
    type: "farmer",
    title: "Farmer",
    description: "Grow and sell organic produce directly",
    icon: Sprout,
    color: "from-green-600 to-emerald-600"
  },
  {
    type: "mitra",
    title: "Mitra (Subscriber)",
    description: "Support farmers with subscriptions and donations",
    icon: Users,
    color: "from-pink-600 to-red-600"
  },
  {
    type: "service_provider",
    title: "Service Provider",
    description: "Tractor owners, logistics, consultants, etc.",
    icon: Wrench,
    color: "from-orange-600 to-red-600"
  },
  {
    type: "school",
    title: "Schools & Colleges",
    description: "Educational institutions for nutrition programs",
    icon: School,
    color: "from-purple-600 to-violet-600"
  },
  {
    type: "shg",
    title: "SHGs / Youth Groups",
    description: "Self Help Groups and Women Entrepreneurs",
    icon: UsersRound,
    color: "from-teal-600 to-cyan-600"
  }
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
    
    // Common fields
    contactPerson: '',
    mobile: '',
    address: '',
    pinCode: '',
    
    // Reseller fields
    businessName: '',
    gstNumber: '',
    sellerType: '', // retailer/wholesaler/distributor/online_seller
    productInterest: [],
    monthlyVolume: '',
    paymentTerms: '',
    coldStorage: '',
    transportation: '',
    deliverySchedule: '',
    coBranding: '',
    organicExperience: '',
    
    // Farmer fields
    aadhaarId: '',
    whatsappNumber: '',
    district: '',
    landSize: '',
    landOwnership: '',
    cropsGrown: '',
    irrigationFacilities: '',
    organicLand: '',
    certificationStatus: '',
    inputUsage: '',
    mitraInterest: '',
    insuranceRequirement: '',
    shgMachinery: '',
    trainingNeeds: '',
    sellingPoints: '',
    averageYield: '',
    creditDependency: '',
    
    // Mitra fields (simplified since main auth handles this)
    familySize: '',
    dietPreference: '',
    specialNeeds: '',
    planChoice: '',
    basketType: '',
    deliveryPreference: '',
    farmerPairing: '',
    paymentMode: '',
    farmVisitInterest: '',
    referralWillingness: '',
    
    // Service Provider fields
    companyName: '',
    serviceArea: '',
    businessRegNumber: '',
    serviceType: [],
    availability: '',
    serviceCost: '',
    assetsCount: '',
    coldStorageCapacity: '',
    staffCount: '',
    shgPartnership: '',
    gstFacility: '',
    
    // School fields
    schoolName: '',
    registrationNumber: '',
    principalContact: '',
    studentCount: '',
    staffCount: '',
    nutritionBaskets: '',
    modelFarm: '',
    agriActivities: '',
    startupFairs: '',
    storageSpace: '',
    erpIntegration: '',
    
    // SHG fields
    groupName: '',
    memberCount: '',
    leaderContact: '',
    bankLinkage: '',
    currentSkills: [],
    infrastructure: [],
    equipmentAccess: [],
    serviceRole: [],
    loanSupport: '',
    paymentMode: '',
    farmerBranding: ''
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
    
    if (!formData.designation) newErrors.designation = 'Please select your type';
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
    
    // Type-specific validation
    if (selectedType === 'reseller') {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.sellerType) newErrors.sellerType = 'Seller type is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.pinCode) newErrors.pinCode = 'PIN code is required';
    } else if (selectedType === 'farmer') {
      if (!formData.aadhaarId) newErrors.aadhaarId = 'Aadhaar ID is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.landSize) newErrors.landSize = 'Land size is required';
      if (!formData.landOwnership) newErrors.landOwnership = 'Land ownership is required';
    } else if (selectedType === 'service_provider') {
      if (formData.serviceType.length === 0) newErrors.serviceType = 'Select at least one service type';
      if (!formData.serviceArea) newErrors.serviceArea = 'Service area is required';
    } else if (selectedType === 'school') {
      if (!formData.schoolName) newErrors.schoolName = 'School name is required';
      if (!formData.principalContact) newErrors.principalContact = 'Principal contact is required';
      if (!formData.studentCount) newErrors.studentCount = 'Student count is required';
    } else if (selectedType === 'shg') {
      if (!formData.groupName) newErrors.groupName = 'Group name is required';
      if (!formData.memberCount) newErrors.memberCount = 'Member count is required';
      if (!formData.leaderContact) newErrors.leaderContact = 'Leader contact is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setLoading(true);
      try {
        // Send OTP first
        await sellerAPI.sendOTP({ emailOrPhone: formData.email });
        setStep(3);
        toast.success("OTP sent to your email/phone!");
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
      // Submit complete registration data in one call
      const registrationData = {
        ...formData,
        designation: selectedType
      };

      const response = await sellerAPI.register(registrationData);
      
      if (response.data.success) {
        // Mock OTP verification (always succeeds with 123456)
        const otpResponse = await sellerAPI.verifyOTP({
          userId: response.data.data.userId,
          emailOrPhone: formData.email,
          otp: formData.otp
        });
        
        if (otpResponse.data.success) {
          toast.success("Registration completed! You're on our waiting list.");
          setStep(4); // Success step with waiting list message
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP';
      setErrors({ otp: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    if (step === 3) return 90;
    return 100;
  };

  // Step 1: Type Selection & Basic Info
  if (step === 1) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Store className="w-4 h-4 mr-2" />
              Business Registration
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join AgriValah Ecosystem</h1>
            <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Step 1 of 3: Choose Your Role</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {sellerTypes.map((seller) => (
                  <Card
                    key={seller.type}
                    className={`cursor-pointer border-2 transition-all duration-300 ${
                      selectedType === seller.type 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => {
                      console.log('Selecting type:', seller.type);
                      setSelectedType(seller.type);
                      setFormData(prev => ({ ...prev, designation: seller.type }));
                      if (errors.designation) {
                        setErrors(prev => ({ ...prev, designation: '' }));
                      }
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
                  <Label htmlFor="name">Full Name / Business Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name or business name"
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
                {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

                <div className="flex justify-end">
                  <Button 
                    type="button"
                    onClick={handleNext} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Next Step'} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Type-specific Information
  if (step === 2) {
    const getTitle = () => {
      switch(selectedType) {
        case 'reseller': return 'Reseller / Seller Details';
        case 'farmer': return 'Farmer Profile';
        case 'mitra': return 'Mitra Subscription Details';
        case 'service_provider': return 'Service Provider Information';
        case 'school': return 'School / College Details';
        case 'shg': return 'SHG / Group Information';
        default: return 'Business Details';
      }
    };

    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-green-100 text-green-800 mb-4">
              <Store className="w-4 h-4 mr-2" />
              Business Registration
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{getTitle()}</h1>
            <Progress value={getProgressPercentage()} className="w-full max-w-md mx-auto mb-4" />
            <p className="text-gray-600">Step 2 of 3: Detailed Information</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                
                {/* RESELLER FIELDS */}
                {selectedType === 'reseller' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
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
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input
                          id="contactPerson"
                          placeholder="Contact person name"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input
                          id="mobile"
                          placeholder="Enter mobile number"
                          value={formData.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="gstNumber">GST / Business Registration Number</Label>
                        <Input
                          id="gstNumber"
                          placeholder="Enter GST or registration number"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address (Shop/Outlet) *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="pinCode">PIN Code *</Label>
                        <Input
                          id="pinCode"
                          placeholder="Enter PIN code"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                          className={errors.pinCode ? 'border-red-500' : ''}
                        />
                        {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                      </div>

                      <div>
                        <Label htmlFor="sellerType">Type of Seller *</Label>
                        <Select value={formData.sellerType} onValueChange={(value) => handleInputChange('sellerType', value)}>
                          <SelectTrigger className={errors.sellerType ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select seller type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="wholesaler">Wholesaler</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="online_seller">Online Seller</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.sellerType && <p className="text-red-500 text-sm mt-1">{errors.sellerType}</p>}
                      </div>
                    </div>

                    <div>
                      <Label>Product Interest</Label>
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        {['Vegetables', 'Fruits', 'Pulses', 'Oils', 'Spices', 'Mixed Basket'].map(product => (
                          <div key={product} className="flex items-center space-x-2">
                            <Checkbox
                              id={product}
                              checked={formData.productInterest.includes(product)}
                              onCheckedChange={(checked) => handleMultiSelect('productInterest', product, checked)}
                            />
                            <Label htmlFor={product} className="text-sm">{product}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="monthlyVolume">Monthly Volume Requirement</Label>
                        <Input
                          id="monthlyVolume"
                          placeholder="e.g. 500kg, 2 tons, 1000 litres"
                          value={formData.monthlyVolume}
                          onChange={(e) => handleInputChange('monthlyVolume', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="paymentTerms">Payment Terms Preference</Label>
                        <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="advance">Advance</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly_credit">Monthly Credit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label>Cold Storage Available?</Label>
                        <RadioGroup value={formData.coldStorage} onValueChange={(value) => handleInputChange('coldStorage', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="cold-yes" />
                            <Label htmlFor="cold-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="cold-no" />
                            <Label htmlFor="cold-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Transportation Available?</Label>
                        <RadioGroup value={formData.transportation} onValueChange={(value) => handleInputChange('transportation', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="trans-yes" />
                            <Label htmlFor="trans-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="trans-no" />
                            <Label htmlFor="trans-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="deliverySchedule">Preferred Delivery Schedule</Label>
                        <Select value={formData.deliverySchedule} onValueChange={(value) => handleInputChange('deliverySchedule', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* FARMER FIELDS */}
                {selectedType === 'farmer' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="aadhaarId">Aadhaar/ID Proof *</Label>
                        <Input
                          id="aadhaarId"
                          placeholder="Enter Aadhaar number"
                          value={formData.aadhaarId}
                          onChange={(e) => handleInputChange('aadhaarId', e.target.value)}
                          className={errors.aadhaarId ? 'border-red-500' : ''}
                        />
                        {errors.aadhaarId && <p className="text-red-500 text-sm mt-1">{errors.aadhaarId}</p>}
                      </div>

                      <div>
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <Input
                          id="whatsappNumber"
                          placeholder="Enter WhatsApp number"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="district">Village, Mandal, District *</Label>
                        <Input
                          id="district"
                          placeholder="Village, Mandal, District"
                          value={formData.district}
                          onChange={(e) => handleInputChange('district', e.target.value)}
                          className={errors.district ? 'border-red-500' : ''}
                        />
                        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                      </div>

                      <div>
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input
                          id="pinCode"
                          placeholder="Enter PIN code"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="landSize">Landholding Size (acres/hectares) *</Label>
                        <Input
                          id="landSize"
                          placeholder="e.g. 5 acres"
                          value={formData.landSize}
                          onChange={(e) => handleInputChange('landSize', e.target.value)}
                          className={errors.landSize ? 'border-red-500' : ''}
                        />
                        {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize}</p>}
                      </div>

                      <div>
                        <Label htmlFor="landOwnership">Land Ownership *</Label>
                        <Select value={formData.landOwnership} onValueChange={(value) => handleInputChange('landOwnership', value)}>
                          <SelectTrigger className={errors.landOwnership ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select ownership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="own">Own</SelectItem>
                            <SelectItem value="lease">Lease</SelectItem>
                            <SelectItem value="sharecropper">Sharecropper</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.landOwnership && <p className="text-red-500 text-sm mt-1">{errors.landOwnership}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cropsGrown">Crops Grown (season-wise)</Label>
                      <Textarea
                        id="cropsGrown"
                        placeholder="List crops grown in different seasons"
                        value={formData.cropsGrown}
                        onChange={(e) => handleInputChange('cropsGrown', e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="irrigationFacilities">Irrigation Facilities</Label>
                        <Input
                          id="irrigationFacilities"
                          placeholder="e.g. borewell, drip, rain-fed"
                          value={formData.irrigationFacilities}
                          onChange={(e) => handleInputChange('irrigationFacilities', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>25% Organic Land?</Label>
                        <RadioGroup value={formData.organicLand} onValueChange={(value) => handleInputChange('organicLand', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="organic-yes" />
                            <Label htmlFor="organic-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="organic-no" />
                            <Label htmlFor="organic-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="certificationStatus">Organic Certification Status</Label>
                        <Select value={formData.certificationStatus} onValueChange={(value) => handleInputChange('certificationStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certified">Certified</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="not_certified">Not Certified</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="inputUsage">Current Input Usage</Label>
                        <Select value={formData.inputUsage} onValueChange={(value) => handleInputChange('inputUsage', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select input type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="chemical">Chemical</SelectItem>
                            <SelectItem value="organic">Organic</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* SERVICE PROVIDER FIELDS */}
                {selectedType === 'service_provider' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                        <Input
                          id="businessRegNumber"
                          placeholder="Enter registration number"
                          value={formData.businessRegNumber}
                          onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceArea">Service Coverage Area *</Label>
                      <Input
                        id="serviceArea"
                        placeholder="Areas where you provide services"
                        value={formData.serviceArea}
                        onChange={(e) => handleInputChange('serviceArea', e.target.value)}
                        className={errors.serviceArea ? 'border-red-500' : ''}
                      />
                      {errors.serviceArea && <p className="text-red-500 text-sm mt-1">{errors.serviceArea}</p>}
                    </div>

                    <div>
                      <Label>Type of Service *</Label>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        {[
                          'Tractor Hire', 'Motor Repair', 'Drone Service', 'Logistics', 
                          'Cold Storage', 'Training', 'Advisory', 'Irrigation Installation'
                        ].map(service => (
                          <div key={service} className="flex items-center space-x-2">
                            <Checkbox
                              id={service}
                              checked={formData.serviceType.includes(service)}
                              onCheckedChange={(checked) => handleMultiSelect('serviceType', service, checked)}
                            />
                            <Label htmlFor={service} className="text-sm">{service}</Label>
                          </div>
                        ))}
                      </div>
                      {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                            <SelectItem value="on_call">On Call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="serviceCost">Average Service Cost</Label>
                        <Input
                          id="serviceCost"
                          placeholder="Per hour/acre cost"
                          value={formData.serviceCost}
                          onChange={(e) => handleInputChange('serviceCost', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="staffCount">Staff Count</Label>
                        <Input
                          id="staffCount"
                          placeholder="Number of staff"
                          value={formData.staffCount}
                          onChange={(e) => handleInputChange('staffCount', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* SCHOOL FIELDS */}
                {selectedType === 'school' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="schoolName">School/College Name *</Label>
                        <Input
                          id="schoolName"
                          placeholder="Enter institution name"
                          value={formData.schoolName}
                          onChange={(e) => handleInputChange('schoolName', e.target.value)}
                          className={errors.schoolName ? 'border-red-500' : ''}
                        />
                        {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                          id="registrationNumber"
                          placeholder="Institution registration number"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="principalContact">Principal/Head Contact *</Label>
                        <Input
                          id="principalContact"
                          placeholder="Principal contact details"
                          value={formData.principalContact}
                          onChange={(e) => handleInputChange('principalContact', e.target.value)}
                          className={errors.principalContact ? 'border-red-500' : ''}
                        />
                        {errors.principalContact && <p className="text-red-500 text-sm mt-1">{errors.principalContact}</p>}
                      </div>

                      <div>
                        <Label htmlFor="studentCount">Number of Students *</Label>
                        <Input
                          id="studentCount"
                          placeholder="Total student count"
                          value={formData.studentCount}
                          onChange={(e) => handleInputChange('studentCount', e.target.value)}
                          className={errors.studentCount ? 'border-red-500' : ''}
                        />
                        {errors.studentCount && <p className="text-red-500 text-sm mt-1">{errors.studentCount}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Nutrition Baskets for Students?</Label>
                        <RadioGroup value={formData.nutritionBaskets} onValueChange={(value) => handleInputChange('nutritionBaskets', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="nutrition-yes" />
                            <Label htmlFor="nutrition-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="nutrition-no" />
                            <Label htmlFor="nutrition-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label>Model Farm on Campus?</Label>
                        <RadioGroup value={formData.modelFarm} onValueChange={(value) => handleInputChange('modelFarm', value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="farm-yes" />
                            <Label htmlFor="farm-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="farm-no" />
                            <Label htmlFor="farm-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </>
                )}

                {/* SHG FIELDS */}
                {selectedType === 'shg' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="groupName">SHG/Group Name *</Label>
                        <Input
                          id="groupName"
                          placeholder="Enter group name"
                          value={formData.groupName}
                          onChange={(e) => handleInputChange('groupName', e.target.value)}
                          className={errors.groupName ? 'border-red-500' : ''}
                        />
                        {errors.groupName && <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="memberCount">Number of Members *</Label>
                        <Input
                          id="memberCount"
                          placeholder="Total members"
                          value={formData.memberCount}
                          onChange={(e) => handleInputChange('memberCount', e.target.value)}
                          className={errors.memberCount ? 'border-red-500' : ''}
                        />
                        {errors.memberCount && <p className="text-red-500 text-sm mt-1">{errors.memberCount}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="leaderContact">Leader Contact *</Label>
                        <Input
                          id="leaderContact"
                          placeholder="Leader mobile/email"
                          value={formData.leaderContact}
                          onChange={(e) => handleInputChange('leaderContact', e.target.value)}
                          className={errors.leaderContact ? 'border-red-500' : ''}
                        />
                        {errors.leaderContact && <p className="text-red-500 text-sm mt-1">{errors.leaderContact}</p>}
                      </div>

                      <div>
                        <Label htmlFor="bankLinkage">Registration/Bank Linkage Details</Label>
                        <Input
                          id="bankLinkage"
                          placeholder="Bank account/registration details"
                          value={formData.bankLinkage}
                          onChange={(e) => handleInputChange('bankLinkage', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Current Skills</Label>
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        {['Grading', 'Packing', 'Bookkeeping', 'Logistics', 'Processing', 'Marketing'].map(skill => (
                          <div key={skill} className="flex items-center space-x-2">
                            <Checkbox
                              id={skill}
                              checked={formData.currentSkills.includes(skill)}
                              onCheckedChange={(checked) => handleMultiSelect('currentSkills', skill, checked)}
                            />
                            <Label htmlFor={skill} className="text-sm">{skill}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Service Role in AgriValah</Label>
                      <div className="grid md:grid-cols-2 gap-4 mt-2">
                        {[
                          'Procurement Hub', 'Packing Hub', 'Local Market Stall', 
                          'Logistics', 'Student Activities', 'Farmer Training'
                        ].map(role => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={role}
                              checked={formData.serviceRole.includes(role)}
                              onCheckedChange={(checked) => handleMultiSelect('serviceRole', role, checked)}
                            />
                            <Label htmlFor={role} className="text-sm">{role}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

                <div className="flex justify-between">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleNext} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Get OTP'} <ArrowRight className="w-4 h-4 ml-2" />
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
              Business Registration
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
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Complete'}
                  </Button>
                </div>
              </form>

              <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => {
                  setLoading(true);
                  sellerAPI.sendOTP({ emailOrPhone: formData.email })
                    .then(() => {
                      toast.success("OTP resent successfully!");
                      setLoading(false);
                    })
                    .catch(() => {
                      toast.error("Failed to resend OTP");
                      setLoading(false);
                    });
                }}>
                  Resend OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 4: Success - Waiting List Message
  if (step === 4) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl text-center">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Clock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in joining AgriValah. Your {selectedType.replace('_', ' ')} application has been submitted successfully and is now in our waiting list for review.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-orange-800 text-sm font-medium">
                  🕐 <strong>What's Next?</strong>
                </p>
                <p className="text-orange-700 text-sm mt-2">
                  Our team will review your application and notify you via email/phone once approved. This typically takes 2-3 business days.
                </p>
              </div>
              <Button 
                onClick={() => navigate(createPageUrl("Home"))}
                className="bg-gradient-to-r from-green-600 to-emerald-600 w-full"
              >
                Back to Home
              </Button>
              <p className="text-gray-500 text-sm mt-4">
                Need help? Contact us at support@agrivalah.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}