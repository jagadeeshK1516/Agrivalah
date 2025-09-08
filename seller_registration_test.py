#!/usr/bin/env python3
"""
Seller Registration Backend API Testing
Tests the specific seller registration flow that the frontend is using
"""

import requests
import json
import sys
import time
from datetime import datetime

class SellerRegistrationTester:
    def __init__(self):
        # Use the production URL from frontend/.env
        self.base_url = "https://react-seller-debug.preview.emergentagent.com"
        self.api_base = f"{self.base_url}/api/v1"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test tracking
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Test data storage
        self.test_data = {}

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append(f"{name}: {details}")
        print()

    def make_request(self, method: str, endpoint: str, data: dict = None, 
                    expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_base}/{endpoint}"
        
        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            else:
                return False, {"error": f"Unsupported method: {method}"}
            
            success = response.status_code == expected_status
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text, "status_code": response.status_code}
                
            return success, response_data
            
        except Exception as e:
            return False, {"error": str(e)}

    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                details = f"Status: {data.get('status')}, Uptime: {data.get('uptime', 0):.1f}s"
            else:
                details = f"Status: {response.status_code}"
            self.log_test("Backend Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Error: {str(e)}")
            return False

    def test_farmer_registration(self):
        """Test farmer seller registration with complete data"""
        timestamp = int(time.time())
        farmer_data = {
            "designation": "farmer",
            "name": "John Farmer",
            "email": f"john.farmer.{timestamp}@test.com",
            "password": "password123",
            "confirmPassword": "password123",
            "acres": "10",
            "soilType": "loamy",
            "cropsGrown": ["Grains"],
            "location": "Test Village",
            "pinCode": "123456"
        }
        
        success, response = self.make_request('POST', 'sellers/register', farmer_data)
        
        if success:
            data = response.get('data', {})
            user_id = data.get('userId')
            seller_id = data.get('sellerId')
            status = data.get('status')
            
            # Store for later tests
            self.test_data['farmer_user_id'] = user_id
            self.test_data['farmer_seller_id'] = seller_id
            self.test_data['farmer_email'] = farmer_data['email']
            
            details = f"User ID: {user_id}, Seller ID: {seller_id}, Status: {status}"
            
            # Verify correct status values
            if status != 'pending_approval':
                success = False
                details += f" - Expected status 'pending_approval', got '{status}'"
                
        else:
            details = f"Registration failed: {response}"
            
        self.log_test("Farmer Registration", success, details)
        return success

    def test_farmer_details(self):
        """Test farmer details submission"""
        if not self.test_data.get('farmer_user_id'):
            self.log_test("Farmer Details", False, "No farmer user ID available")
            return False
            
        farmer_data = {
            "userId": self.test_data['farmer_user_id'],
            "acres": 5.5,
            "soilType": "loamy",
            "cropsGrown": ["Grains", "Vegetables"],
            "cropDetails": "Organic farming practices with sustainable methods",
            "location": "Test Village, Test District",
            "pinCode": "123456",
            "language": "en"
        }
        
        success, response = self.make_request('POST', 'sellers/step/farmer', farmer_data)
        
        if success:
            data = response.get('data', {})
            details = f"Step: {data.get('step')}, Seller ID: {data.get('sellerId')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Farmer Details", success, details)
        return success

    def test_send_otp(self):
        """Test sending OTP"""
        if not self.test_data.get('farmer_email'):
            self.log_test("Send OTP", False, "No farmer email available")
            return False
            
        otp_data = {
            "emailOrPhone": self.test_data['farmer_email']
        }
        
        success, response = self.make_request('POST', 'sellers/send-otp', otp_data)
        
        details = f"OTP sent to: {self.test_data['farmer_email']}"
        if not success:
            details = f"Response: {response}"
            
        self.log_test("Send OTP", success, details)
        return success

    def test_verify_otp(self):
        """Test OTP verification"""
        if not self.test_data.get('farmer_user_id') or not self.test_data.get('farmer_email'):
            self.log_test("Verify OTP", False, "Missing farmer user ID or email")
            return False
            
        verify_data = {
            "userId": self.test_data['farmer_user_id'],
            "emailOrPhone": self.test_data['farmer_email'],
            "otp": "123456"  # Mock OTP
        }
        
        success, response = self.make_request('POST', 'sellers/verify-otp', verify_data)
        
        if success:
            data = response.get('data', {})
            details = f"Verified: {data.get('verified')}, KYC Status: {data.get('kycStatus')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Verify OTP", success, details)
        return success

    def test_seller_init_reseller(self):
        """Test seller initialization for reseller"""
        timestamp = int(time.time())
        test_data = {
            "designation": "reseller",
            "name": "Test Reseller",
            "email": f"reseller_{timestamp}@test.com",
            "password": "Test@123",
            "confirmPassword": "Test@123"
        }
        
        success, response = self.make_request('POST', 'sellers/init', test_data)
        
        if success:
            data = response.get('data', {})
            self.test_data['reseller_user_id'] = data.get('userId')
            details = f"User ID: {self.test_data['reseller_user_id']}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Seller Init - Reseller", success, details)
        return success

    def test_reseller_details(self):
        """Test reseller details submission"""
        if not self.test_data.get('reseller_user_id'):
            self.log_test("Reseller Details", False, "No reseller user ID available")
            return False
            
        reseller_data = {
            "userId": self.test_data['reseller_user_id'],
            "businessName": "Test Organic Store",
            "businessType": "retail_shop",
            "gstNumber": "07AABCU9603R1ZM",
            "businessAddress": "123 Market Street, Test City, Test State - 123456",
            "preferredCategories": ["Grocery", "Farm Produce"]
        }
        
        success, response = self.make_request('POST', 'sellers/step/reseller', reseller_data)
        
        if success:
            data = response.get('data', {})
            details = f"Step: {data.get('step')}, Seller ID: {data.get('sellerId')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Reseller Details", success, details)
        return success

    def test_seller_init_startup(self):
        """Test seller initialization for startup"""
        timestamp = int(time.time())
        test_data = {
            "designation": "startup",
            "name": "Test Startup Founder",
            "email": f"startup_{timestamp}@test.com",
            "password": "Test@123",
            "confirmPassword": "Test@123"
        }
        
        success, response = self.make_request('POST', 'sellers/init', test_data)
        
        if success:
            data = response.get('data', {})
            self.test_data['startup_user_id'] = data.get('userId')
            details = f"User ID: {self.test_data['startup_user_id']}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Seller Init - Startup", success, details)
        return success

    def test_startup_details(self):
        """Test startup details submission"""
        if not self.test_data.get('startup_user_id'):
            self.log_test("Startup Details", False, "No startup user ID available")
            return False
            
        startup_data = {
            "userId": self.test_data['startup_user_id'],
            "companyName": "AgriTech Innovations Pvt Ltd",
            "registrationNumber": "U01100DL2020PTC123456",
            "companyAddress": "456 Tech Park, Innovation District, Test City - 110001",
            "natureOfBusiness": "agri_saas",
            "yearsInOperation": "3",
            "collaborationAreas": []
        }
        
        success, response = self.make_request('POST', 'sellers/step/startup', startup_data)
        
        if success:
            data = response.get('data', {})
            details = f"Step: {data.get('step')}, Seller ID: {data.get('sellerId')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Startup Details", success, details)
        return success

    def test_seller_init_service(self):
        """Test seller initialization for service provider"""
        timestamp = int(time.time())
        test_data = {
            "designation": "service",
            "name": "Test Service Provider",
            "email": f"service_{timestamp}@test.com",
            "password": "Test@123",
            "confirmPassword": "Test@123"
        }
        
        success, response = self.make_request('POST', 'sellers/init', test_data)
        
        if success:
            data = response.get('data', {})
            self.test_data['service_user_id'] = data.get('userId')
            details = f"User ID: {self.test_data['service_user_id']}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Seller Init - Service Provider", success, details)
        return success

    def test_service_details(self):
        """Test service provider details submission"""
        if not self.test_data.get('service_user_id'):
            self.log_test("Service Provider Details", False, "No service user ID available")
            return False
            
        service_data = {
            "userId": self.test_data['service_user_id'],
            "selectedServices": ["Tractor Rental Services", "Cold Storage & Warehousing"],
            "vehicleNumber": "HR-01-AB-1234",
            "model": "Mahindra 575 DI",
            "rentPerDay": "2500",
            "serviceArea": "Test District and surrounding areas",
            "equipmentDetails": "Well-maintained tractors with latest implements",
            "serviceCharges": "Rs. 500 per hour",
            "storageCapacity": "1000 tons",
            "storageType": "mixed",
            "rentalModel": "Rs. 50 per quintal per month"
        }
        
        success, response = self.make_request('POST', 'sellers/step/service-provider', service_data)
        
        if success:
            data = response.get('data', {})
            details = f"Step: {data.get('step')}, Seller ID: {data.get('sellerId')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Service Provider Details", success, details)
        return success

    def test_get_seller_profile(self):
        """Test getting seller profile"""
        if not self.test_data.get('farmer_user_id'):
            self.log_test("Get Seller Profile", False, "No farmer user ID available")
            return False
            
        success, response = self.make_request('GET', f'sellers/{self.test_data["farmer_user_id"]}')
        
        if success:
            data = response.get('data', {})
            seller_type = data.get('sellerType')
            kyc_status = data.get('kycStatus')
            details = f"Type: {seller_type}, KYC: {kyc_status}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Get Seller Profile", success, details)
        return success

    def test_invalid_seller_type(self):
        """Test invalid seller type validation"""
        test_data = {
            "designation": "invalid_type",
            "name": "Test User",
            "email": "invalid@test.com",
            "password": "Test@123",
            "confirmPassword": "Test@123"
        }
        
        success, response = self.make_request('POST', 'sellers/init', test_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Validation message: {message}"
        else:
            details = f"Expected 400 status but got: {response}"
            
        self.log_test("Invalid Seller Type Validation", success, details)
        return success

    def test_password_mismatch(self):
        """Test password mismatch validation"""
        test_data = {
            "designation": "farmer",
            "name": "Test User",
            "email": "mismatch@test.com",
            "password": "Test@123",
            "confirmPassword": "Different@123"
        }
        
        success, response = self.make_request('POST', 'sellers/init', test_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Validation message: {message}"
        else:
            details = f"Expected 400 status but got: {response}"
            
        self.log_test("Password Mismatch Validation", success, details)
        return success

    def run_all_tests(self):
        """Run all seller registration tests"""
        print("🚀 Starting Seller Registration API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        print("📡 CONNECTIVITY TESTS")
        self.test_backend_connectivity()
        
        # Validation tests
        print("🔍 VALIDATION TESTS")
        self.test_invalid_seller_type()
        self.test_password_mismatch()
        
        # Farmer registration flow
        print("🌾 FARMER REGISTRATION FLOW")
        self.test_seller_init_farmer()
        self.test_farmer_details()
        self.test_send_otp()
        self.test_verify_otp()
        self.test_get_seller_profile()
        
        # Other seller types
        print("🏪 RESELLER REGISTRATION FLOW")
        self.test_seller_init_reseller()
        self.test_reseller_details()
        
        print("🏢 STARTUP REGISTRATION FLOW")
        self.test_seller_init_startup()
        self.test_startup_details()
        
        print("🚚 SERVICE PROVIDER REGISTRATION FLOW")
        self.test_seller_init_service()
        self.test_service_details()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure}")
        
        print("=" * 60)
        
        # Return exit code
        return 0 if len(self.failed_tests) == 0 else 1

def main():
    """Main function"""
    tester = SellerRegistrationTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()