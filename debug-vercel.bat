@echo off
echo 🔍 Debugging Vercel deployment...

echo 📂 Checking project structure...
dir

echo 📂 Checking API folder...
dir api

echo 📂 Checking frontend folder...
dir frontend

echo 📂 Checking frontend/public folder...
dir frontend\public

echo 📂 Checking frontend/src folder...
dir frontend\src

echo 📄 Checking vercel.json...
type vercel.json

echo 📄 Checking package.json...
type package.json

echo 📄 Checking frontend/package.json...
type frontend\package.json

echo ✅ Debug information collected!