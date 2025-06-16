// Test Production Deployment
const axios = require('axios');

const PRODUCTION_URL = 'https://borouge-pv2eppf4u-mitty530s-projects.vercel.app';

async function testProduction() {
  console.log('🚀 Testing Borouge ESG Intelligence Platform - Production');
  console.log('====================================================');
  console.log('URL:', PRODUCTION_URL);
  console.log('');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    try {
      const healthResponse = await axios.get(`${PRODUCTION_URL}/api/health`, {
        timeout: 30000
      });
      console.log('✅ Health Check Status:', healthResponse.data.status);
      console.log('   Services:', Object.keys(healthResponse.data.services || {}));
      
      // Check individual services
      if (healthResponse.data.services) {
        Object.entries(healthResponse.data.services).forEach(([service, status]) => {
          console.log(`   ${service}: ${status.status}`);
        });
      }
    } catch (error) {
      console.log('❌ Health Check Failed:', error.response?.status || error.message);
    }

    // Test 2: API Root
    console.log('\n2. Testing API Root...');
    try {
      const rootResponse = await axios.get(`${PRODUCTION_URL}/api`, {
        timeout: 10000
      });
      console.log('✅ API Root Status:', rootResponse.data.status);
      console.log('   Version:', rootResponse.data.version);
      console.log('   Endpoints:', Object.keys(rootResponse.data.endpoints || {}));
    } catch (error) {
      console.log('❌ API Root Failed:', error.response?.status || error.message);
    }

    // Test 3: API Status
    console.log('\n3. Testing API Status...');
    try {
      const statusResponse = await axios.get(`${PRODUCTION_URL}/api/esg-intelligence/status`, {
        timeout: 10000
      });
      console.log('✅ API Status Retrieved');
      if (statusResponse.data.services) {
        console.log('   Gemini Remaining:', statusResponse.data.services.gemini?.remainingRequests || 'N/A');
        console.log('   NewsAPI Remaining:', statusResponse.data.services.newsapi?.remainingRequests || 'N/A');
        console.log('   Database Status:', statusResponse.data.services.database?.status || 'N/A');
      }
    } catch (error) {
      console.log('❌ API Status Failed:', error.response?.status || error.message);
    }

    // Test 4: Frontend Access
    console.log('\n4. Testing Frontend Access...');
    try {
      const frontendResponse = await axios.get(PRODUCTION_URL, {
        timeout: 10000
      });
      if (frontendResponse.status === 200 && frontendResponse.data.includes('Borouge ESG Intelligence')) {
        console.log('✅ Frontend Loaded Successfully');
        console.log('   Status:', frontendResponse.status);
        console.log('   Content-Type:', frontendResponse.headers['content-type']);
      } else {
        console.log('⚠️ Frontend Loaded but content may be incorrect');
        console.log('   Status:', frontendResponse.status);
      }
    } catch (error) {
      console.log('❌ Frontend Failed:', error.response?.status || error.message);
    }

    console.log('\n====================================================');
    console.log('🏁 Production Testing Complete');
    console.log('🌐 Application URL:', PRODUCTION_URL);
    console.log('📊 Dashboard URL:', 'https://vercel.com/mitty530s-projects/borouge');

  } catch (error) {
    console.error('❌ Test Suite Failed:', error.message);
  }
}

// Run tests
if (require.main === module) {
  testProduction();
}

module.exports = testProduction;
