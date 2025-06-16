// Test Backend API Locally
require('dotenv').config();
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_QUERY = 'carbon emissions regulations petrochemical industry';

async function testBackend() {
  console.log('🚀 Testing Borouge ESG Intelligence Backend API');
  console.log('================================================');

  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Check...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Health Check Status:', healthResponse.data.status);
      console.log('   Services:', Object.keys(healthResponse.data.services));
    } catch (error) {
      console.log('❌ Health Check Failed:', error.message);
    }

    // Test 2: API Root
    console.log('\n2. Testing API Root...');
    try {
      const rootResponse = await axios.get(`${BASE_URL}/api`);
      console.log('✅ API Root Status:', rootResponse.data.status);
      console.log('   Version:', rootResponse.data.version);
    } catch (error) {
      console.log('❌ API Root Failed:', error.message);
    }

    // Test 3: API Status
    console.log('\n3. Testing API Status...');
    try {
      const statusResponse = await axios.get(`${BASE_URL}/api/esg-intelligence/status`);
      console.log('✅ API Status Retrieved');
      console.log('   Gemini Remaining:', statusResponse.data.services.gemini.remainingRequests);
      console.log('   NewsAPI Remaining:', statusResponse.data.services.newsapi.remainingRequests);
    } catch (error) {
      console.log('❌ API Status Failed:', error.message);
    }

    // Test 4: ESG Intelligence Analysis
    console.log('\n4. Testing ESG Intelligence Analysis...');
    console.log('   Query:', TEST_QUERY);
    try {
      const analysisResponse = await axios.post(`${BASE_URL}/api/esg-intelligence/analyze`, {
        query: TEST_QUERY,
        userId: '00000000-0000-0000-0000-000000000000'
      }, {
        timeout: 60000 // 60 second timeout
      });

      console.log('✅ ESG Analysis Completed');
      console.log('   Session ID:', analysisResponse.data.sessionId);
      console.log('   Query Type:', analysisResponse.data.queryType);
      console.log('   Confidence:', analysisResponse.data.confidence);
      console.log('   Total Sources:', analysisResponse.data.totalSources);
      console.log('   Processing Time:', analysisResponse.data.processingTime + 'ms');
      
      if (analysisResponse.data.intelligence.executiveSummary) {
        console.log('   Executive Summary:', analysisResponse.data.intelligence.executiveSummary.substring(0, 100) + '...');
      }

      // Test 5: Get Session Details
      if (analysisResponse.data.sessionId) {
        console.log('\n5. Testing Session Details...');
        try {
          const sessionResponse = await axios.get(`${BASE_URL}/api/esg-intelligence/session/${analysisResponse.data.sessionId}`);
          console.log('✅ Session Details Retrieved');
          console.log('   Session Status:', sessionResponse.data.session.session_status);
          console.log('   Articles Count:', sessionResponse.data.articles.length);
        } catch (error) {
          console.log('❌ Session Details Failed:', error.message);
        }
      }

    } catch (error) {
      console.log('❌ ESG Analysis Failed:', error.response?.data?.error || error.message);
      if (error.response?.data?.suggestions) {
        console.log('   Suggestions:', error.response.data.suggestions);
      }
    }

    console.log('\n================================================');
    console.log('🏁 Backend API Testing Complete');

  } catch (error) {
    console.error('❌ Test Suite Failed:', error.message);
  }
}

// Run tests
if (require.main === module) {
  testBackend();
}

module.exports = testBackend;
