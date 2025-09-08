#!/usr/bin/env python3
"""
Seller Registration Backend API Testing Suite
Tests the simplified seller registration endpoints as requested
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

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

    def make_request(self, method: str, endpoint: str, data: Dict = None, 
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
                details = f"Backend healthy - Status: {data.get('status')}, Uptime: {data.get('uptime', 0):.1f}s"
            else:
                details = f"Health check failed - Status: {response.status_code}"
            self.log_test("Backend Connectivity", success, details)
            return success
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Error: {str(e)}")
            return False

    def test_farmer_registration(self):
        """Test farmer seller registration with complete data"""
        farmer_data = {
            "designation": "farmer",
            "name": "John Farmer",
            "email": f"john.farmer.{int(time.time())}@test.com",
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

    def test_reseller_registration(self):
        """Test reseller seller registration"""
        reseller_data = {
            "designation": "reseller",
            "name": "Jane Reseller",
            "email": f"jane.reseller.{int(time.time())}@test.com",
            "password": "password123",
            "confirmPassword": "password123",
            "businessName": "Jane's Agri Business",
            "gstNumber": "GST123456789",
            "businessAddress": "123 Business Street",
            "pinCode": "654321"
        }
        
        success, response = self.make_request('POST', 'sellers/register', reseller_data)
        
        if success:
            data = response.get('data', {})
            user_id = data.get('userId')
            seller_id = data.get('sellerId')
            status = data.get('status')
            
            # Store for later tests
            self.test_data['reseller_user_id'] = user_id
            self.test_data['reseller_email'] = reseller_data['email']
            
            details = f"User ID: {user_id}, Seller ID: {seller_id}, Status: {status}"
            
            # Verify correct status values
            if status != 'pending_approval':
                success = False
                details += f" - Expected status 'pending_approval', got '{status}'"
                
        else:
            details = f"Registration failed: {response}"
            
        self.log_test("Reseller Registration", success, details)
        return success

    def test_startup_registration(self):
        """Test startup seller registration"""
        startup_data = {
            "designation": "startup",
            "name": "Tech Startup Founder",
            "email": f"startup.founder.{int(time.time())}@test.com",
            "password": "password123",
            "confirmPassword": "password123",
            "companyName": "AgriTech Innovations",
            "foundingYear": "2020",
            "teamSize": "5-10",
            "fundingStage": "seed",
            "businessModel": "B2B SaaS",
            "pinCode": "560001"
        }
        
        success, response = self.make_request('POST', 'sellers/register', startup_data)
        
        if success:
            data = response.get('data', {})
            user_id = data.get('userId')
            seller_id = data.get('sellerId')
            status = data.get('status')
            
            # Store for later tests
            self.test_data['startup_user_id'] = user_id
            self.test_data['startup_email'] = startup_data['email']
            
            details = f"User ID: {user_id}, Seller ID: {seller_id}, Status: {status}"
            
            # Verify correct status values
            if status != 'pending_approval':
                success = False
                details += f" - Expected status 'pending_approval', got '{status}'"
                
        else:
            details = f"Registration failed: {response}"
            
        self.log_test("Startup Registration", success, details)
        return success

    def test_service_registration(self):
        """Test service provider registration"""
        service_data = {
            "designation": "service",
            "name": "Service Provider",
            "email": f"service.provider.{int(time.time())}@test.com",
            "password": "password123",
            "confirmPassword": "password123",
            "serviceType": "consulting",
            "experience": "5+ years",
            "specialization": "Organic Farming",
            "certifications": "Certified Organic Consultant",
            "serviceArea": "Karnataka",
            "pinCode": "560002"
        }
        
        success, response = self.make_request('POST', 'sellers/register', service_data)
        
        if success:
            data = response.get('data', {})
            user_id = data.get('userId')
            seller_id = data.get('sellerId')
            status = data.get('status')
            
            # Store for later tests
            self.test_data['service_user_id'] = user_id
            self.test_data['service_email'] = service_data['email']
            
            details = f"User ID: {user_id}, Seller ID: {seller_id}, Status: {status}"
            
            # Verify correct status values
            if status != 'pending_approval':
                success = False
                details += f" - Expected status 'pending_approval', got '{status}'"
                
        else:
            details = f"Registration failed: {response}"
            
        self.log_test("Service Provider Registration", success, details)
        return success

    def test_duplicate_email_validation(self):
        """Test duplicate email validation"""
        # Try to register with the farmer's email again
        farmer_email = self.test_data.get('farmer_email')
        if not farmer_email:
            self.log_test("Duplicate Email Validation", False, "No farmer email available from previous test")
            return False
            
        duplicate_data = {
            "designation": "farmer",
            "name": "Another Farmer",
            "email": farmer_email,
            "password": "password123",
            "confirmPassword": "password123",
            "acres": "5",
            "soilType": "clay",
            "cropsGrown": ["Vegetables"],
            "location": "Another Village",
            "pinCode": "111111"
        }
        
        success, response = self.make_request('POST', 'sellers/register', duplicate_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Correctly rejected duplicate email: {message}"
        else:
            details = f"Failed to reject duplicate email: {response}"
            
        self.log_test("Duplicate Email Validation", success, details)
        return success

    def test_password_mismatch_validation(self):
        """Test password mismatch validation"""
        invalid_data = {
            "designation": "farmer",
            "name": "Test Farmer",
            "email": f"test.mismatch.{int(time.time())}@test.com",
            "password": "password123",
            "confirmPassword": "different_password",
            "acres": "5",
            "soilType": "clay",
            "cropsGrown": ["Vegetables"],
            "location": "Test Village",
            "pinCode": "111111"
        }
        
        success, response = self.make_request('POST', 'sellers/register', invalid_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Correctly rejected password mismatch: {message}"
        else:
            details = f"Failed to reject password mismatch: {response}"
            
        self.log_test("Password Mismatch Validation", success, details)
        return success

    def test_invalid_seller_type_validation(self):
        """Test invalid seller type validation"""
        invalid_data = {
            "designation": "invalid_type",
            "name": "Test User",
            "email": f"test.invalid.{int(time.time())}@test.com",
            "password": "password123",
            "confirmPassword": "password123"
        }
        
        success, response = self.make_request('POST', 'sellers/register', invalid_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Correctly rejected invalid seller type: {message}"
        else:
            details = f"Failed to reject invalid seller type: {response}"
            
        self.log_test("Invalid Seller Type Validation", success, details)
        return success

    def test_send_otp_mock(self):
        """Test mock OTP sending"""
        farmer_email = self.test_data.get('farmer_email')
        if not farmer_email:
            self.log_test("Send OTP Mock", False, "No farmer email available from previous test")
            return False
            
        otp_data = {
            "emailOrPhone": farmer_email
        }
        
        success, response = self.make_request('POST', 'sellers/send-otp', otp_data)
        
        if success:
            message = response.get('message', '')
            details = f"OTP send response: {message}"
        else:
            details = f"OTP send failed: {response}"
            
        self.log_test("Send OTP Mock", success, details)
        return success

    def test_verify_otp_mock_success(self):
        """Test mock OTP verification with correct OTP"""
        farmer_user_id = self.test_data.get('farmer_user_id')
        farmer_email = self.test_data.get('farmer_email')
        
        if not farmer_user_id or not farmer_email:
            self.log_test("Verify OTP Mock - Success", False, "Missing farmer data from previous test")
            return False
            
        verify_data = {
            "userId": farmer_user_id,
            "emailOrPhone": farmer_email,
            "otp": "123456"  # Correct mock OTP
        }
        
        success, response = self.make_request('POST', 'sellers/verify-otp', verify_data)
        
        if success:
            data = response.get('data', {})
            verified = data.get('verified')
            status = data.get('status')
            message = response.get('message', '')
            
            details = f"Verified: {verified}, Status: {status}, Message: {message}"
            
            # Verify correct status values
            if status != 'waiting_list':
                success = False
                details += f" - Expected status 'waiting_list', got '{status}'"
                
        else:
            details = f"OTP verification failed: {response}"
            
        self.log_test("Verify OTP Mock - Success", success, details)
        return success

    def test_verify_otp_mock_failure(self):
        """Test mock OTP verification with incorrect OTP"""
        farmer_user_id = self.test_data.get('farmer_user_id')
        farmer_email = self.test_data.get('farmer_email')
        
        if not farmer_user_id or not farmer_email:
            self.log_test("Verify OTP Mock - Failure", False, "Missing farmer data from previous test")
            return False
            
        verify_data = {
            "userId": farmer_user_id,
            "emailOrPhone": farmer_email,
            "otp": "wrong_otp"  # Incorrect OTP
        }
        
        success, response = self.make_request('POST', 'sellers/verify-otp', verify_data, 400)
        
        if success:
            message = response.get('message', '')
            details = f"Correctly rejected wrong OTP: {message}"
        else:
            details = f"Failed to reject wrong OTP: {response}"
            
        self.log_test("Verify OTP Mock - Failure", success, details)
        return success

    def test_get_seller_profile(self):
        """Test getting seller profile"""
        farmer_user_id = self.test_data.get('farmer_user_id')
        
        if not farmer_user_id:
            self.log_test("Get Seller Profile", False, "No farmer user ID available from previous test")
            return False
            
        success, response = self.make_request('GET', f'sellers/{farmer_user_id}')
        
        if success:
            data = response.get('data', {})
            seller_type = data.get('sellerType')
            kyc_status = data.get('kycStatus')
            is_active = data.get('isActive')
            
            details = f"Type: {seller_type}, KYC: {kyc_status}, Active: {is_active}"
            
            # Verify correct values - after OTP verification, should be active with pending KYC
            expected_kyc = 'pending'
            expected_active = True
            
            if kyc_status != expected_kyc or is_active != expected_active:
                success = False
                details += f" - Expected KYC: {expected_kyc}, Active: {expected_active}"
                
        else:
            details = f"Failed to get seller profile: {response}"
            
        self.log_test("Get Seller Profile", success, details)
        return success

    def run_all_tests(self):
        """Run all seller registration tests"""
        print("🚀 Starting Seller Registration Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity test
        print("📡 CONNECTIVITY TESTS")
        self.test_backend_connectivity()
        
        # Registration tests for different seller types
        print("🏪 SELLER REGISTRATION TESTS")
        self.test_farmer_registration()
        self.test_reseller_registration()
        self.test_startup_registration()
        self.test_service_registration()
        
        # Validation tests
        print("✅ VALIDATION TESTS")
        self.test_duplicate_email_validation()
        self.test_password_mismatch_validation()
        self.test_invalid_seller_type_validation()
        
        # OTP tests
        print("📱 OTP TESTS")
        self.test_send_otp_mock()
        self.test_verify_otp_mock_success()
        self.test_verify_otp_mock_failure()
        
        # Profile retrieval test
        print("👤 PROFILE TESTS")
        self.test_get_seller_profile()
        
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