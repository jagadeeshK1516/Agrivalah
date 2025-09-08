#!/usr/bin/env python3
"""
AgriValah Backend API Testing Suite
Tests all backend APIs comprehensively using the public endpoint
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

class AgriValahAPITester:
    def __init__(self, base_url="https://farmbackend.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api/v1"
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test tracking
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
        # Auth tokens
        self.customer_token = None
        self.admin_token = None
        self.mitra_token = None
        self.farmer_token = None
        self.reseller_token = None
        
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
                    token: str = None, expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_base}/{endpoint}"
        headers = {}
        
        if token:
            headers['Authorization'] = f'Bearer {token}'
            
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=headers)
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

    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Uptime: {data.get('uptime', 'N/A')}s"
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, f"Error: {str(e)}")
            return False

    def test_api_docs(self):
        """Test API documentation endpoint"""
        try:
            response = requests.get(f"{self.base_url}/docs", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            self.log_test("API Documentation", success, details)
            return success
        except Exception as e:
            self.log_test("API Documentation", False, f"Error: {str(e)}")
            return False

    # Authentication Tests
    def test_customer_login(self):
        """Test customer login"""
        data = {
            "emailOrPhone": "customer@test.com",
            "password": "Test@123"
        }
        success, response = self.make_request('POST', 'auth/login', data)
        
        if success and 'token' in response:
            self.customer_token = response['token']
            self.test_data['customer_id'] = response.get('user', {}).get('id')
            details = f"Token received, User ID: {self.test_data.get('customer_id')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Customer Login", success, details)
        return success

    def test_admin_login(self):
        """Test admin login"""
        data = {
            "emailOrPhone": "admin@agrivalah.com",
            "password": "Admin@123"
        }
        success, response = self.make_request('POST', 'auth/login', data)
        
        if success and 'token' in response:
            self.admin_token = response['token']
            self.test_data['admin_id'] = response.get('user', {}).get('id')
            details = f"Token received, User ID: {self.test_data.get('admin_id')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Admin Login", success, details)
        return success

    def test_signup_flow(self):
        """Test signup with OTP verification"""
        # Step 1: Signup
        signup_data = {
            "name": "Test User",
            "email": f"testuser_{int(time.time())}@test.com",
            "phone": f"9876543{int(time.time()) % 1000:03d}",
            "password": "Test@123",
            "role": "customer"
        }
        
        success, response = self.make_request('POST', 'auth/signup', signup_data)
        
        if not success:
            self.log_test("Signup Flow - Registration", False, f"Signup failed: {response}")
            return False
            
        # Step 2: Verify OTP (using mocked OTP)
        verify_data = {
            "email": signup_data["email"],
            "otp": "123456"  # Mocked OTP
        }
        
        success, response = self.make_request('POST', 'auth/verify-otp', verify_data)
        details = f"Email: {signup_data['email']}, OTP verification: {'Success' if success else 'Failed'}"
        
        self.log_test("Signup Flow - OTP Verification", success, details)
        return success

    def test_token_refresh(self):
        """Test token refresh functionality"""
        if not self.customer_token:
            self.log_test("Token Refresh", False, "No customer token available")
            return False
            
        success, response = self.make_request('POST', 'auth/refresh', 
                                            token=self.customer_token)
        
        if success and 'token' in response:
            details = "New token received"
        else:
            details = f"Response: {response}"
            
        self.log_test("Token Refresh", success, details)
        return success

    def test_logout(self):
        """Test logout functionality"""
        if not self.customer_token:
            self.log_test("Logout", False, "No customer token available")
            return False
            
        success, response = self.make_request('POST', 'auth/logout', 
                                            token=self.customer_token)
        
        details = f"Status: {'Success' if success else 'Failed'}"
        self.log_test("Logout", success, details)
        return success

    # User Management Tests
    def test_get_user_profile(self):
        """Test get user profile"""
        if not self.customer_token:
            self.log_test("Get User Profile", False, "No customer token available")
            return False
            
        success, response = self.make_request('GET', 'users/profile', 
                                            token=self.customer_token)
        
        if success:
            details = f"User: {response.get('name', 'N/A')}, Email: {response.get('email', 'N/A')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Get User Profile", success, details)
        return success

    def test_update_user_profile(self):
        """Test update user profile"""
        if not self.customer_token:
            self.log_test("Update User Profile", False, "No customer token available")
            return False
            
        update_data = {
            "name": "Updated Test User",
            "phone": "9876543210"
        }
        
        success, response = self.make_request('PUT', 'users/profile', 
                                            update_data, self.customer_token)
        
        details = f"Update: {'Success' if success else 'Failed'}"
        self.log_test("Update User Profile", success, details)
        return success

    def test_qr_code_generation(self):
        """Test QR code generation"""
        if not self.customer_token:
            self.log_test("QR Code Generation", False, "No customer token available")
            return False
            
        success, response = self.make_request('GET', 'users/qr-code', 
                                            token=self.customer_token)
        
        if success:
            details = f"QR Code: {'Generated' if 'qrCode' in response else 'Not found'}"
        else:
            details = f"Response: {response}"
            
        self.log_test("QR Code Generation", success, details)
        return success

    # Products Tests
    def test_get_products(self):
        """Test get products list"""
        success, response = self.make_request('GET', 'products')
        
        if success:
            products = response.get('products', [])
            details = f"Found {len(products)} products"
            if products:
                self.test_data['product_id'] = products[0].get('_id')
        else:
            details = f"Response: {response}"
            
        self.log_test("Get Products List", success, details)
        return success

    def test_get_product_details(self):
        """Test get product details by ID"""
        product_id = self.test_data.get('product_id')
        if not product_id:
            self.log_test("Get Product Details", False, "No product ID available")
            return False
            
        success, response = self.make_request('GET', f'products/{product_id}')
        
        if success:
            details = f"Product: {response.get('name', 'N/A')}, Price: {response.get('price', 'N/A')}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Get Product Details", success, details)
        return success

    def test_product_search(self):
        """Test product search"""
        success, response = self.make_request('GET', 'products?search=organic')
        
        if success:
            products = response.get('products', [])
            details = f"Search results: {len(products)} products"
        else:
            details = f"Response: {response}"
            
        self.log_test("Product Search", success, details)
        return success

    def test_product_filter_by_category(self):
        """Test product filtering by category"""
        success, response = self.make_request('GET', 'products?category=vegetables')
        
        if success:
            products = response.get('products', [])
            details = f"Category filter results: {len(products)} products"
        else:
            details = f"Response: {response}"
            
        self.log_test("Product Filter by Category", success, details)
        return success

    # Orders Tests
    def test_create_order(self):
        """Test order creation"""
        if not self.customer_token or not self.test_data.get('product_id'):
            self.log_test("Create Order", False, "Missing customer token or product ID")
            return False
            
        order_data = {
            "items": [
                {
                    "productId": self.test_data['product_id'],
                    "quantity": 2,
                    "price": 100
                }
            ],
            "shippingAddress": {
                "street": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "pincode": "123456",
                "country": "India"
            },
            "paymentMethod": "cod"
        }
        
        success, response = self.make_request('POST', 'orders', order_data, 
                                            self.customer_token, 201)
        
        if success:
            self.test_data['order_id'] = response.get('_id')
            details = f"Order created: {self.test_data['order_id']}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Create Order", success, details)
        return success

    def test_get_orders(self):
        """Test get user orders"""
        if not self.customer_token:
            self.log_test("Get Orders", False, "No customer token available")
            return False
            
        success, response = self.make_request('GET', 'orders', 
                                            token=self.customer_token)
        
        if success:
            orders = response.get('orders', [])
            details = f"Found {len(orders)} orders"
        else:
            details = f"Response: {response}"
            
        self.log_test("Get Orders", success, details)
        return success

    def test_update_order_status(self):
        """Test order status update"""
        order_id = self.test_data.get('order_id')
        if not order_id or not self.customer_token:
            self.log_test("Update Order Status", False, "Missing order ID or token")
            return False
            
        update_data = {"status": "confirmed"}
        success, response = self.make_request('PATCH', f'orders/{order_id}/status', 
                                            update_data, self.customer_token)
        
        details = f"Status update: {'Success' if success else 'Failed'}"
        self.log_test("Update Order Status", success, details)
        return success

    def test_cancel_order(self):
        """Test order cancellation"""
        order_id = self.test_data.get('order_id')
        if not order_id or not self.customer_token:
            self.log_test("Cancel Order", False, "Missing order ID or token")
            return False
            
        success, response = self.make_request('DELETE', f'orders/{order_id}', 
                                            token=self.customer_token)
        
        details = f"Cancellation: {'Success' if success else 'Failed'}"
        self.log_test("Cancel Order", success, details)
        return success

    # Seller Registration Tests
    def test_seller_registration_farmer(self):
        """Test farmer seller registration"""
        if not self.customer_token:
            self.log_test("Seller Registration - Farmer", False, "No customer token available")
            return False
            
        seller_data = {
            "type": "farmer",
            "businessName": "Test Farm",
            "description": "Organic farming business",
            "address": {
                "street": "Farm Road 123",
                "city": "Farm City",
                "state": "Farm State",
                "pincode": "123456",
                "country": "India"
            },
            "documents": {
                "aadhar": "123456789012",
                "pan": "ABCDE1234F"
            }
        }
        
        success, response = self.make_request('POST', 'sellers/register', 
                                            seller_data, self.customer_token, 201)
        
        if success:
            self.test_data['seller_id'] = response.get('_id')
            details = f"Farmer registration: {self.test_data['seller_id']}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Seller Registration - Farmer", success, details)
        return success

    # Admin Tests
    def test_admin_dashboard_stats(self):
        """Test admin dashboard statistics"""
        if not self.admin_token:
            self.log_test("Admin Dashboard Stats", False, "No admin token available")
            return False
            
        success, response = self.make_request('GET', 'admin/dashboard/stats', 
                                            token=self.admin_token)
        
        if success:
            stats = response.get('stats', {})
            details = f"Users: {stats.get('totalUsers', 0)}, Orders: {stats.get('totalOrders', 0)}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Admin Dashboard Stats", success, details)
        return success

    def test_seller_verification(self):
        """Test seller verification by admin"""
        seller_id = self.test_data.get('seller_id')
        if not seller_id or not self.admin_token:
            self.log_test("Seller Verification", False, "Missing seller ID or admin token")
            return False
            
        verify_data = {"status": "verified"}
        success, response = self.make_request('PATCH', f'admin/sellers/{seller_id}/verify', 
                                            verify_data, self.admin_token)
        
        details = f"Verification: {'Success' if success else 'Failed'}"
        self.log_test("Seller Verification", success, details)
        return success

    # File Upload Tests
    def test_signed_url_generation(self):
        """Test signed URL generation for file uploads"""
        if not self.customer_token:
            self.log_test("Signed URL Generation", False, "No customer token available")
            return False
            
        upload_data = {
            "fileName": "test-image.jpg",
            "fileType": "image/jpeg",
            "folder": "products"
        }
        
        success, response = self.make_request('POST', 'upload/signed-url', 
                                            upload_data, self.customer_token)
        
        if success:
            details = f"Signed URL: {'Generated' if 'signedUrl' in response else 'Not found'}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Signed URL Generation", success, details)
        return success

    # Search Tests
    def test_unified_search(self):
        """Test unified search functionality"""
        search_data = {"query": "organic", "type": "all"}
        success, response = self.make_request('POST', 'search', search_data)
        
        if success:
            results = response.get('results', {})
            total = sum(len(v) if isinstance(v, list) else 0 for v in results.values())
            details = f"Search results: {total} items found"
        else:
            details = f"Response: {response}"
            
        self.log_test("Unified Search", success, details)
        return success

    def test_search_suggestions(self):
        """Test search suggestions"""
        success, response = self.make_request('GET', 'search/suggestions?q=org')
        
        if success:
            suggestions = response.get('suggestions', [])
            details = f"Suggestions: {len(suggestions)} items"
        else:
            details = f"Response: {response}"
            
        self.log_test("Search Suggestions", success, details)
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting AgriValah Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        print("📡 CONNECTIVITY TESTS")
        self.test_health_check()
        self.test_api_docs()
        
        # Authentication tests
        print("🔐 AUTHENTICATION TESTS")
        self.test_customer_login()
        self.test_admin_login()
        self.test_signup_flow()
        self.test_token_refresh()
        
        # User management tests
        print("👤 USER MANAGEMENT TESTS")
        self.test_get_user_profile()
        self.test_update_user_profile()
        self.test_qr_code_generation()
        
        # Products tests
        print("📦 PRODUCTS TESTS")
        self.test_get_products()
        self.test_get_product_details()
        self.test_product_search()
        self.test_product_filter_by_category()
        
        # Orders tests
        print("🛒 ORDERS TESTS")
        self.test_create_order()
        self.test_get_orders()
        self.test_update_order_status()
        self.test_cancel_order()
        
        # Seller registration tests
        print("🏪 SELLER REGISTRATION TESTS")
        self.test_seller_registration_farmer()
        
        # Admin tests
        print("👑 ADMIN TESTS")
        self.test_admin_dashboard_stats()
        self.test_seller_verification()
        
        # File upload tests
        print("📁 FILE UPLOAD TESTS")
        self.test_signed_url_generation()
        
        # Search tests
        print("🔍 SEARCH TESTS")
        self.test_unified_search()
        self.test_search_suggestions()
        
        # Logout test (at the end)
        print("🚪 LOGOUT TEST")
        self.test_logout()
        
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
    tester = AgriValahAPITester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()