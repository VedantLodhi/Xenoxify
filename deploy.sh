#!/bin/bash

# Xenoxify Deployment Script
echo "🚀 Deploying Xenoxify to production..."

# Set environment variables for production
export DATABASE_URL="postgresql://username:password@localhost:5432/xenoxify"
export SHOPIFY_API_KEY="5013237d82a781ddc5a203f3927be7c3"
export SHOPIFY_API_SECRET="bd48db258164438da0a52614ad22e20d"
export SHOPIFY_SCOPES="read_products,write_products,read_customers,write_customers,read_orders,write_orders"
export SHOPIFY_SERVICE_ACCOUNT="delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com"
export APP_URL="https://xenoxify.com"
export FRONTEND_URL="https://xenoxify.com"
export JWT_SECRET="xenoxify_jwt_secret_2024_production_key_change_this"
export NODE_ENV="production"

echo "✅ Environment variables set"

# Build and deploy backend
echo "📦 Building backend..."
cd server
npm ci --production
npx prisma generate
npx prisma migrate deploy

echo "✅ Backend ready"

# Build frontend
echo "📦 Building frontend..."
cd ../client
npm ci
npm run build

echo "✅ Frontend built"

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your production database"
echo "2. Update DATABASE_URL in your hosting platform"
echo "3. Deploy the server to your hosting platform"
echo "4. Deploy the client build to your CDN/hosting"
echo "5. Update Shopify app URLs to use https://xenoxify.com"
echo ""
echo "🔗 Important URLs:"
echo "- App URL: https://xenoxify.com"
echo "- Auth Callback: https://xenoxify.com/api/auth/callback"
echo "- Webhooks: https://xenoxify.com/api/webhooks/*"

