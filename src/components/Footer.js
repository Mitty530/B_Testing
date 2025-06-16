import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Shield, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white border-t border-gray-200 mt-16"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Borouge ESG Intelligence</h3>
            <p className="text-gray-600 text-sm mb-4">
              Strategic research intelligence platform for the petrochemical industry, 
              powered by advanced AI and real-time data analysis.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Real-time Analysis</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Platform Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• ESG Intelligence Analysis</li>
              <li>• Regulatory Compliance Monitoring</li>
              <li>• Competitive Intelligence</li>
              <li>• Financial Impact Assessment</li>
              <li>• Strategic Recommendations</li>
              <li>• Real-time News Monitoring</li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Technical Stack</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• Google Gemini AI</li>
              <li>• NewsAPI.ai Integration</li>
              <li>• Supabase Database</li>
              <li>• React Frontend</li>
              <li>• Vercel Deployment</li>
            </ul>
            
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Mitty530/borouge-esg-intelligence"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {currentYear} Borouge ESG Intelligence Platform. Built for strategic decision-making.
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Powered by AI</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
