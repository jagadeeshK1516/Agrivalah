#!/usr/bin/env python3
"""
Actual Backend API Testing Suite
Tests the real backend APIs that exist in the current implementation
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

class ActualBackendTester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
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

    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    expected_status: int = 200) -> tuple:
        """Make HTTP request and return success status and response"""
        url = f"{self.api_base}/{endpoint}" if endpoint else self.api_base
        
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

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.make_request('GET', '')
        
        if success:
            message = response.get('message', '')
            details = f"Message: {message}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Root API Endpoint", success, details)
        return success

    def test_create_status_check(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{int(time.time())}"
        }
        
        success, response = self.make_request('POST', 'status', test_data)
        
        if success:
            status_id = response.get('id', '')
            client_name = response.get('client_name', '')
            details = f"Created status check - ID: {status_id}, Client: {client_name}"
            # Store for later use
            self.created_status_id = status_id
        else:
            details = f"Response: {response}"
            
        self.log_test("Create Status Check", success, details)
        return success

    def test_get_status_checks(self):
        """Test getting all status checks"""
        success, response = self.make_request('GET', 'status')
        
        if success:
            if isinstance(response, list):
                details = f"Found {len(response)} status checks"
                if response:
                    # Check if our created status exists
                    created_found = any(item.get('id') == getattr(self, 'created_status_id', None) 
                                      for item in response)
                    if created_found:
                        details += " (including our created status)"
            else:
                details = f"Unexpected response format: {type(response)}"
        else:
            details = f"Response: {response}"
            
        self.log_test("Get Status Checks", success, details)
        return success

    def test_backend_connectivity(self):
        """Test basic backend connectivity"""
        try:
            response = requests.get(self.base_url, timeout=10)
            success = response.status_code in [200, 404]  # 404 is ok for root without /api
            details = f"Backend reachable - Status: {response.status_code}"
            self.log_test("Backend Connectivity", success, details)
            return success
        except Exception as e:
            self.log_test("Backend Connectivity", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Actual Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity test
        print("📡 CONNECTIVITY TESTS")
        self.test_backend_connectivity()
        
        # API tests
        print("🔧 API TESTS")
        self.test_root_endpoint()
        self.test_create_status_check()
        self.test_get_status_checks()
        
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
    tester = ActualBackendTester()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()