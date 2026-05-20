import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('🚀 Starting API Integration Tests...\n');
  let exitCode = 0;
  let token = '';
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // Helper function to print test results
  const report = (name, success, info = '') => {
    if (success) {
      console.log(`✅ [PASS] ${name} ${info ? `- ${info}` : ''}`);
    } else {
      console.log(`❌ [FAIL] ${name} ${info ? `- ${info}` : ''}`);
      exitCode = 1;
    }
  };

  // Test 1: Health Check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    report('1. Health Check GET /health', res.status === 200 && res.data.status === 'ok', `status: ${res.data.status}`);
  } catch (error) {
    report('1. Health Check GET /health', false, error.message);
  }

  // Test 2: User Signup
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/signup`, {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    });
    const signupSuccess = res.status === 201 && res.data.success === true;
    report('2. Email Signup POST /api/auth/signup', signupSuccess, `Email: ${testEmail}`);
  } catch (error) {
    report('2. Email Signup POST /api/auth/signup', false, error.response?.data?.error || error.message);
  }

  // Test 3: User Login
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testEmail,
      password: testPassword
    });
    const loginSuccess = res.status === 200 && res.data.success === true && res.data.token;
    if (loginSuccess) {
      token = res.data.token;
    }
    report('3. Email Login POST /api/auth/login', loginSuccess, token ? 'Token received' : 'No token received');
  } catch (error) {
    report('3. Email Login POST /api/auth/login', false, error.response?.data?.error || error.message);
  }

  // Test 4: Auth Status (using Token)
  if (token) {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statusSuccess = res.status === 200 && res.data.success === true && res.data.user.email === testEmail;
      report('4. Auth Status GET /api/auth/status', statusSuccess, `User: ${res.data.user.name}`);
    } catch (error) {
      report('4. Auth Status GET /api/auth/status', false, error.response?.data?.error || error.message);
    }
  } else {
    report('4. Auth Status GET /api/auth/status', false, 'Skipped because login failed (no token)');
  }

  // Test 5: Get Projects List (using Token)
  if (token) {
    try {
      const res = await axios.get(`${BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Should return success and an array of projects (empty list initially)
      const projectsSuccess = res.status === 200 && res.data.success === true && Array.isArray(res.data.projects);
      report('5. Get Projects GET /api/projects', projectsSuccess, `Found ${res.data.projects?.length || 0} projects`);
    } catch (error) {
      report('5. Get Projects GET /api/projects', false, error.response?.data?.error || error.message);
    }
  } else {
    report('5. Get Projects GET /api/projects', false, 'Skipped because login failed (no token)');
  }

  // Test 6: User Logout (using Token)
  if (token) {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      report('6. Email Logout POST /api/auth/logout', res.status === 200 && res.data.success === true, res.data.message);
    } catch (error) {
      report('6. Email Logout POST /api/auth/logout', false, error.response?.data?.error || error.message);
    }
  } else {
    report('6. Email Logout POST /api/auth/logout', false, 'Skipped because login failed (no token)');
  }

  console.log('\n🏁 API Integration Tests Finished.');
  process.exit(exitCode);
}

runTests();
