import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Heart, 
  ShoppingCart, 
  Eye, 
  EyeOff,
  CheckCircle,
  ArrowLeft,
  LogIn,
  CreditCard,
  Gift,
  Crown,
  Coins,
  Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/api/apiClient";
import { toast } from "sonner";

function useScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);
}

export default function AuthPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [step, setStep] = React.useState('choice'); // 'choice', 'signup', 'login', 'payment', 'otp', 'success'
  const [userType, setUserType] = React.useState(''); // 'customer' or 'mitra'
  const [paymentOption, setPaymentOption] = React.useState(''); // 'subscription' or 'donation'
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    otp: '',
    paymentMethod: 'upi' // Default payment method
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email/Phone is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && !/^\d{10}$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email or 10-digit phone number';
    }

    if (!isLogin && !formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (isLogin) {
        // Login API call
        const response = await authAPI.login({
          emailOrPhone: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          login(response.data.user, {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          });
          toast.success("Login successful!");
          navigate(createPageUrl("Dashboard"));
        }
      } else {
        // Check if customer (no payment) or mitra (needs payment)
        if (userType === 'customer') {
          // Direct signup for customer
          const response = await authAPI.signup({
            name: formData.fullName,
            emailOrPhone: formData.email,
            password: formData.password,
            role: userType
          });
          
          if (response.data.success || response.data.ok) {
            toast.success("OTP sent to your email/phone!");
            setStep('otp');
          }
        } else {
          // Mitra signup - go to payment selection
          setStep('payment');
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful payment, create the mitra account
      const response = await authAPI.signup({
        name: formData.fullName,
        emailOrPhone: formData.email,
        password: formData.password,
        role: userType,
        subscriptionType: paymentOption,
        paymentAmount: paymentOption === 'subscription' ? 12000 : 30000,
        creditsEarned: paymentOption === 'donation' ? 9000 : 0
      });
      
      if (response.data.success || response.data.ok) {
        toast.success("Payment successful! OTP sent to your email/phone!");
        setStep('otp');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Payment failed';
      setErrors({ payment: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
      const response = await authAPI.verifyOTP({
        emailOrPhone: formData.email,
        otp: formData.otp
      });
      
      if (response.data.success) {
        login(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        });
        setStep('success');
        toast.success("Account verified successfully!");
        
        // Redirect after showing success
        setTimeout(() => {
          navigate(createPageUrl("Dashboard"));
        }, 2000);
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
    navigate(createPageUrl("Dashboard"));
  };

  // Choice Step
  if (step === 'choice') {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-4 transition-colors duration-300 hover:bg-green-600 hover:text-white">
              <Users className="w-4 h-4 mr-2" />
              Join AgriValah
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to AgriValah
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to join our organic farming community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer" 
                  onClick={() => { setUserType('customer'); setStep('signup'); }}>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Customer</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 mt-2">FREE</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Buy fresh, organic produce directly from verified farmers. 
                  Access our daily markets and online store.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Direct access to organic produce</li>
                  <li>✓ QR-code traceability to farmers</li>
                  <li>✓ Competitive pricing</li>
                  <li>✓ Doorstep delivery</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => { setUserType('mitra'); setStep('signup'); }}>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-10 h-10" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Mitra</CardTitle>
                <Badge className="bg-pink-100 text-pink-800 mt-2">PREMIUM</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Support farmers with subscription or donation options. 
                  Get premium benefits and help build sustainable agriculture.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ ₹12K/year subscription</li>
                  <li>✓ ₹30K donation with 9K credits/month</li>
                  <li>✓ Premium farmer support</li>
                  <li>✓ Exclusive benefits</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => { setIsLogin(true); setStep('login'); }}>
              <LogIn className="w-4 h-4 mr-2" />
              Login to Existing Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Signup/Login Form
  if (step === 'signup' || step === 'login') {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setStep('choice')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {isLogin ? 'Welcome Back' : `${userType === 'mitra' ? 'Mitra' : 'Customer'} Signup`}
                  </CardTitle>
                  <p className="text-gray-600">
                    {isLogin ? 'Login to your account' : `Create your ${userType} account`}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email or Phone Number</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter email or phone number"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Password</Label>
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

                {!isLogin && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                )}

                {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600" disabled={loading}>
                  {loading ? 'Processing...' : (isLogin ? 'Login' : (userType === 'customer') ? 'Create Account' : 'Continue to Payment')}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Button variant="ghost" onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mitra Payment Selection
  if (step === 'payment') {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-pink-100 text-pink-800 mb-4">
              <Heart className="w-4 h-4 mr-2" />
              Mitra Membership
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600">Support farmers and get exclusive benefits</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Subscription Option */}
            <Card className={`border-2 cursor-pointer transition-all duration-300 ${
              paymentOption === 'subscription' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentOption('subscription')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Annual Subscription</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-2">₹12,000</div>
                <p className="text-gray-600">per year</p>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-3">
                  <li>✓ Premium organic produce access</li>
                  <li>✓ Direct farmer partnerships</li>
                  <li>✓ Monthly delivery guarantee</li>
                  <li>✓ Quality assurance</li>
                  <li>✓ Customer support priority</li>
                </ul>
              </CardContent>
            </Card>

            {/* Donation Option */}
            <Card className={`border-2 cursor-pointer transition-all duration-300 ${
              paymentOption === 'donation' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300'
            }`}
            onClick={() => setPaymentOption('donation')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Gift className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Farmer Support Donation</CardTitle>
                <div className="text-4xl font-bold text-green-600 mt-2">₹30,000</div>
                <p className="text-gray-600">one-time donation</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center text-yellow-800 font-medium">
                    <Coins className="w-4 h-4 mr-2" />
                    Get ₹4,500 worth credits back
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">9,000 credits monthly (₹0.50 per credit)</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li>✓ All subscription benefits</li>
                  <li>✓ 9,000 credits every month</li>
                  <li>✓ Direct farmer impact</li>
                  <li>✓ Tax benefits eligible</li>
                  <li>✓ VIP customer status</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {paymentOption && (
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Plan Selected:</span>
                      <span className="font-bold">
                        {paymentOption === 'subscription' ? 'Annual Subscription' : 'Farmer Support Donation'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Amount:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{paymentOption === 'subscription' ? '12,000' : '30,000'}
                      </span>
                    </div>
                    {paymentOption === 'donation' && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Credits back:</span>
                        <span>9,000 credits/month</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {['UPI', 'Card', 'Net Banking'].map((method) => (
                        <Button
                          key={method}
                          type="button"
                          variant={formData.paymentMethod === method.toLowerCase().replace(' ', '_') ? 'default' : 'outline'}
                          onClick={() => handleInputChange('paymentMethod', method.toLowerCase().replace(' ', '_'))}
                          className="w-full"
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setStep('signup')}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600" disabled={loading}>
                      {loading ? 'Processing Payment...' : `Pay ₹${paymentOption === 'subscription' ? '12,000' : '30,000'}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {!paymentOption && (
            <div className="text-center">
              <Button variant="outline" onClick={() => setStep('signup')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Signup
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // OTP Verification
  if (step === 'otp') {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                Verify OTP
              </CardTitle>
              <p className="text-gray-600 text-center">
                We've sent a 6-digit code to {formData.email}
              </p>
              {userType === 'mitra' && paymentOption && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Payment successful! Complete verification to activate your {paymentOption === 'subscription' ? 'subscription' : 'donation benefits'}.
                  </AlertDescription>
                </Alert>
              )}
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

                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
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

  // Success Step
  if (step === 'success') {
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
              <p className="text-gray-600 mb-6">
                Your {userType} account has been successfully created.
                {userType === 'mitra' && paymentOption === 'donation' && (
                  <span className="block mt-2 text-green-600 font-medium">
                    You'll receive 9,000 credits monthly!
                  </span>
                )}
              </p>
              <Button 
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-green-600 to-emerald-600 w-full"
              >
                Go to {userType === 'mitra' ? 'Mitra' : 'Customer'} Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}