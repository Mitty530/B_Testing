#!/bin/bash

# Borouge ESG Intelligence Platform - Environment Variables Setup
# This script sets up environment variables in Vercel

echo "🔧 Setting up environment variables in Vercel..."

# Get the correct Supabase keys first
echo "📋 Please provide your Supabase credentials:"

read -p "Supabase URL (https://dqvhivaguuyzlmxfvgrm.supabase.co): " SUPABASE_URL
SUPABASE_URL=${SUPABASE_URL:-"https://dqvhivaguuyzlmxfvgrm.supabase.co"}

read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Supabase Service Role Key: " SUPABASE_SERVICE_ROLE_KEY

# Set environment variables in Vercel
echo "🚀 Setting environment variables in Vercel..."

vercel env add SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY"
vercel env add GEMINI_API_KEY production <<< "AIzaSyD0wqgnyyHSgz0joVRQOhNZFjfctcdVpWg"
vercel env add NEWSAPI_AI_KEY production <<< "8ce2612e-3e1f-44a5-9350-4f22ea4be225"
vercel env add NODE_ENV production <<< "production"

echo "✅ Environment variables set successfully!"
echo "🔄 Redeploying to apply environment variables..."

vercel --prod

echo "🎉 Deployment complete with environment variables!"
echo "🌐 Your application is live at: https://borouge-f2220a3h5-mitty530s-projects.vercel.app"
