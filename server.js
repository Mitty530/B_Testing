// Local Development Server for Borouge ESG Intelligence Platform
require('dotenv').config();
const app = require('./api/index.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Borouge ESG Intelligence Backend Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   ESG Intelligence: http://localhost:${PORT}/api/esg-intelligence`);
  console.log(`   Status: http://localhost:${PORT}/api/esg-intelligence/status`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Ready for testing!`);
});
