# Borouge ESG Intelligence Platform

Strategic research intelligence platform for the petrochemical industry, powered by advanced AI and real-time data analysis.

## 🚀 Features

- **ESG Intelligence Analysis**: Comprehensive ESG insights using Google Gemini AI
- **Real-time News Monitoring**: Integration with NewsAPI.ai for industry updates
- **Strategic Recommendations**: Actionable business intelligence and strategic guidance
- **Financial Impact Assessment**: Quantified business impact analysis
- **Competitive Intelligence**: Market positioning and competitor analysis
- **Professional Dashboard**: Clean, horizontal-oriented design for executive use

## 🏗️ Architecture

### Backend
- **Node.js + Express**: Serverless API functions
- **Google Gemini AI**: Advanced language model for ESG analysis
- **NewsAPI.ai**: Real-time news data integration
- **Supabase**: PostgreSQL database with Row Level Security

### Frontend
- **React 18**: Modern frontend framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Professional icon library
- **Vercel Analytics**: User behavior tracking

### Infrastructure
- **Vercel**: Serverless deployment platform
- **Supabase**: Backend-as-a-Service
- **CDN**: Global content delivery

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# News APIs
NEWSAPI_AI_KEY=your_newsapi_ai_key

# Server Configuration
NODE_ENV=development
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mitty530/borouge-esg-intelligence.git
   cd borouge-esg-intelligence
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Set up database**
   - Create a Supabase project
   - Run the SQL schema from `database-schema.sql`
   - Update environment variables

## 🚀 Development

1. **Start the backend server**
   ```bash
   npm run dev
   # or
   node server.js
   ```

2. **Start the frontend (in another terminal)**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel**
   - Upload the `.env.production` file to Vercel
   - Or set variables manually in Vercel dashboard

### Environment Variables for Production

Set these in your Vercel project settings:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEWSAPI_AI_KEY`
- `NODE_ENV=production`

## 🔍 API Endpoints

### Health Check
- `GET /api/health` - System health status
- `GET /api/health/system` - Detailed system information

### ESG Intelligence
- `POST /api/esg-intelligence/analyze` - Analyze ESG query
- `GET /api/esg-intelligence/status` - API usage status
- `GET /api/esg-intelligence/history/:userId` - Research history
- `GET /api/esg-intelligence/session/:sessionId` - Session details
- `POST /api/esg-intelligence/feedback` - Submit feedback

## 📊 Usage

1. **Enter ESG Query**: Input your research question in the search interface
2. **AI Analysis**: The system searches industry sources and generates insights
3. **Review Results**: Examine executive summary, critical findings, and recommendations
4. **Export/Share**: Use the professional dashboard for presentations

### Example Queries
- "carbon emissions regulations petrochemical industry"
- "ESG compliance requirements chemical companies"
- "sustainability initiatives polymer manufacturing"
- "circular economy plastic recycling policies"

## 🛡️ Security

- **Row Level Security**: Database access controlled by user authentication
- **API Rate Limiting**: Prevents abuse and manages costs
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Controlled cross-origin access

## 🔧 Configuration

### API Limits (Free Tier)
- **Gemini AI**: 50 requests/day
- **NewsAPI.ai**: 100 requests/day

### Performance
- **Response Time**: 5-30 seconds for analysis
- **Concurrent Users**: Scales with Vercel limits
- **Data Storage**: Unlimited with Supabase

## 📈 Monitoring

- **Vercel Analytics**: User behavior and performance
- **API Usage Tracking**: Monitor daily limits
- **Error Logging**: Comprehensive error tracking
- **Health Checks**: System status monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For technical support or questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core ESG intelligence features
- **v1.1.0**: Enhanced UI and additional analysis capabilities (planned)
- **v2.0.0**: Multi-language support and advanced analytics (planned)

---

Built with ❤️ for strategic ESG intelligence in the petrochemical industry.
