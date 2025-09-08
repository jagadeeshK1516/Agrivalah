#!/usr/bin/env python3
"""
Authentication Data Verification Test
Verifies that mitra subscription and donation data is properly stored
"""

import requests
import json
import sys
import time
from datetime import datetime

class AuthDataVerificationTester:
    def __init__(self, base_url="https://react-seller-debug.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api/v1"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test tracking
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

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
                    token: str = None, expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_base}/{endpoint}"
        headers = {}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
            
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=30)
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

    def test_duplicate_signup_prevention(self):
        """Test that duplicate signups are prevented"""
        print("🔒 Testing Duplicate Signup Prevention")
        
        # First signup
        email = f"duplicate_test_{int(time.time())}@test.com"
        signup_data = {
            "name": "Test User",
            "emailOrPhone": email,
            "password": "password123",
            "role": "customer"
        }
        
        success1, response1 = self.make_request('POST', 'auth/signup', signup_data)
        
        if not success1:
            self.log_test("Duplicate Signup Prevention - First Signup", False, f"First signup failed: {response1}")
            return False
            
        # Second signup with same email
        success2, response2 = self.make_request('POST', 'auth/signup', signup_data, expected_status=400)
        
        if success2 and not response2.get('success'):
            details = f"Duplicate signup properly prevented - Message: {response2.get('message')}"
            self.log_test("Duplicate Signup Prevention", True, details)
            return True
        else:
            details = f"Duplicate signup not prevented: {response2}"
            self.log_test("Duplicate Signup Prevention", False, details)
            return False

    def test_phone_number_signup(self):
        """Test signup with phone number instead of email"""
        print("📱 Testing Phone Number Signup")
        
        phone = f"91987654{int(time.time()) % 10000:04d}"
        signup_data = {
            "name": "Phone User",
            "emailOrPhone": phone,
            "password": "password123",
            "role": "customer"
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data)
        
        if success and response.get('success'):
            data = response.get('data', {})
            details = f"Phone signup successful - Target: {data.get('target')}, OTP sent: {data.get('otpSent')}"
            self.log_test("Phone Number Signup", True, details)
            return True
        else:
            details = f"Phone signup failed: {response}"
            self.log_test("Phone Number Signup", False, details)
            return False

    def test_mitra_subscription_data_integrity(self):
        """Test that mitra subscription data is properly stored and validated"""
        print("💳 Testing Mitra Subscription Data Integrity")
        
        # Test with subscription data
        email = f"mitra_sub_test_{int(time.time())}@test.com"
        signup_data = {
            "name": "Subscription Mitra",
            "emailOrPhone": email,
            "password": "password123",
            "role": "mitra",
            "subscriptionType": "subscription",
            "paymentAmount": 12000
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data)
        
        if not success:
            self.log_test("Mitra Subscription Data Integrity", False, f"Signup failed: {response}")
            return False
            
        # Verify all mitra fields are returned
        data = response.get('data', {})
        expected_fields = ['userId', 'otpSent', 'role', 'subscriptionType', 'paymentAmount']
        missing_fields = [field for field in expected_fields if field not in data]
        
        if missing_fields:
            details = f"Missing fields in response: {missing_fields}"
            self.log_test("Mitra Subscription Data Integrity", False, details)
            return False
            
        # Verify field values
        if (data.get('role') != 'mitra' or 
            data.get('subscriptionType') != 'subscription' or 
            data.get('paymentAmount') != 12000):
            details = f"Incorrect field values: {data}"
            self.log_test("Mitra Subscription Data Integrity", False, details)
            return False
            
        details = f"All mitra subscription fields correct - Amount: ₹{data.get('paymentAmount')}, Type: {data.get('subscriptionType')}"
        self.log_test("Mitra Subscription Data Integrity", True, details)
        return True

    def test_mitra_donation_data_integrity(self):
        """Test that mitra donation data is properly stored and validated"""
        print("🎁 Testing Mitra Donation Data Integrity")
        
        # Test with donation data
        email = f"mitra_don_test_{int(time.time())}@test.com"
        signup_data = {
            "name": "Donation Mitra",
            "emailOrPhone": email,
            "password": "password123",
            "role": "mitra",
            "subscriptionType": "donation",
            "paymentAmount": 30000,
            "creditsEarned": 9000
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data)
        
        if not success:
            self.log_test("Mitra Donation Data Integrity", False, f"Signup failed: {response}")
            return False
            
        # Verify all mitra donation fields are returned
        data = response.get('data', {})
        expected_fields = ['userId', 'otpSent', 'role', 'subscriptionType', 'paymentAmount', 'creditsEarned']
        missing_fields = [field for field in expected_fields if field not in data]
        
        if missing_fields:
            details = f"Missing fields in response: {missing_fields}"
            self.log_test("Mitra Donation Data Integrity", False, details)
            return False
            
        # Verify field values
        if (data.get('role') != 'mitra' or 
            data.get('subscriptionType') != 'donation' or 
            data.get('paymentAmount') != 30000 or
            data.get('creditsEarned') != 9000):
            details = f"Incorrect field values: {data}"
            self.log_test("Mitra Donation Data Integrity", False, details)
            return False
            
        details = f"All mitra donation fields correct - Amount: ₹{data.get('paymentAmount')}, Credits: {data.get('creditsEarned')}"
        self.log_test("Mitra Donation Data Integrity", True, details)
        return True

    def test_invalid_otp_handling(self):
        """Test invalid OTP handling"""
        print("🚫 Testing Invalid OTP Handling")
        
        # First create a user
        email = f"otp_test_{int(time.time())}@test.com"
        signup_data = {
            "name": "OTP Test User",
            "emailOrPhone": email,
            "password": "password123",
            "role": "customer"
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data)
        
        if not success:
            self.log_test("Invalid OTP Handling - Setup", False, f"Signup failed: {response}")
            return False
            
        # Try to verify with wrong OTP
        verify_data = {
            "emailOrPhone": email,
            "otp": "999999"  # Wrong OTP
        }
        
        success, response = self.make_request('POST', 'auth/verify-otp', verify_data, expected_status=400)
        
        if success and not response.get('success'):
            details = f"Invalid OTP properly rejected - Message: {response.get('message')}"
            self.log_test("Invalid OTP Handling", True, details)
            return True
        else:
            details = f"Invalid OTP not properly handled: {response}"
            self.log_test("Invalid OTP Handling", False, details)
            return False

    def test_missing_required_fields(self):
        """Test validation of required fields"""
        print("📝 Testing Required Field Validation")
        
        # Test missing name
        signup_data = {
            "emailOrPhone": "test@test.com",
            "password": "password123",
            "role": "customer"
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data, expected_status=400)
        
        if success and not response.get('success'):
            details = f"Missing required fields properly validated - Message: {response.get('message')}"
            self.log_test("Required Field Validation", True, details)
            return True
        else:
            details = f"Required field validation failed: {response}"
            self.log_test("Required Field Validation", False, details)
            return False

    def run_all_tests(self):
        """Run all data verification tests"""
        print("🚀 Starting Authentication Data Verification Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Run all tests
        self.test_duplicate_signup_prevention()
        print()
        self.test_phone_number_signup()
        print()
        self.test_mitra_subscription_data_integrity()
        print()
        self.test_mitra_donation_data_integrity()
        print()
        self.test_invalid_otp_handling()
        print()
        self.test_missing_required_fields()
        
        # Print summary
        return self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 DATA VERIFICATION TEST SUMMARY")
        print("=" * 80)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for i, failure in enumerate(self.failed_tests, 1):
                print(f"{i}. {failure}")
        else:
            print("\n✅ ALL TESTS PASSED!")
        
        print("=" * 80)
        
        # Return exit code
        return 0 if len(self.failed_tests) == 0 else 1

def main():
    """Main function"""
    tester = AuthDataVerificationTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()