-- Borouge ESG Intelligence Platform Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase auth handles most user data)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(50) DEFAULT 'researcher',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research sessions table
CREATE TABLE research_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    original_query TEXT NOT NULL,
    enhanced_query TEXT,
    session_status VARCHAR(50) DEFAULT 'processing',
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    total_sources INTEGER DEFAULT 0,
    confidence_score FLOAT DEFAULT 0,
    query_type VARCHAR(100),
    processing_time_ms INTEGER DEFAULT 0
);

-- News sources table
CREATE TABLE news_sources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES research_sessions(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    url TEXT,
    title TEXT,
    description TEXT,
    content TEXT,
    published_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT NOW(),
    relevance_score FLOAT DEFAULT 0,
    source_credibility FLOAT DEFAULT 0,
    borouge_impact FLOAT DEFAULT 0,
    image_url TEXT
);

-- LLM Analysis results table
CREATE TABLE llm_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES research_sessions(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50),
    llm_response TEXT,
    structured_analysis JSONB,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    borouge_context JSONB,
    financial_impact JSONB,
    strategic_recommendations JSONB,
    critical_findings JSONB
);

-- Enhanced queries table for learning
CREATE TABLE query_enhancements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_query TEXT,
    enhanced_query TEXT,
    success_score FLOAT,
    user_feedback VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    enhancement_context JSONB
);

-- API usage tracking
CREATE TABLE api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_name VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 1,
    date DATE DEFAULT CURRENT_DATE,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES research_sessions(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_enhancements ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can only see their own data" ON users FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can only see their own sessions" ON research_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their session sources" ON news_sources FOR ALL USING (
    session_id IN (SELECT id FROM research_sessions WHERE user_id = auth.uid())
);

CREATE POLICY "Users can only see their session analysis" ON llm_analysis FOR ALL USING (
    session_id IN (SELECT id FROM research_sessions WHERE user_id = auth.uid())
);

CREATE POLICY "Users can see all query enhancements" ON query_enhancements FOR SELECT USING (true);
CREATE POLICY "Users can insert query enhancements" ON query_enhancements FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can see their own API usage" ON api_usage FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_research_sessions_user_id ON research_sessions(user_id);
CREATE INDEX idx_research_sessions_status ON research_sessions(session_status);
CREATE INDEX idx_research_sessions_created ON research_sessions(started_at DESC);

CREATE INDEX idx_news_sources_session_id ON news_sources(session_id);
CREATE INDEX idx_news_sources_relevance ON news_sources(relevance_score DESC);
CREATE INDEX idx_news_sources_published ON news_sources(published_at DESC);

CREATE INDEX idx_llm_analysis_session_id ON llm_analysis(session_id);
CREATE INDEX idx_llm_analysis_type ON llm_analysis(analysis_type);
CREATE INDEX idx_llm_analysis_created ON llm_analysis(created_at DESC);

CREATE INDEX idx_api_usage_date ON api_usage(date);
CREATE INDEX idx_api_usage_api_name ON api_usage(api_name);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default user for development
INSERT INTO auth.users (id, email, created_at, updated_at) 
VALUES ('00000000-0000-0000-0000-000000000000', 'default@borouge.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, name, department, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'default@borouge.com', 'Default User', 'ESG Intelligence', 'researcher')
ON CONFLICT (id) DO NOTHING;
