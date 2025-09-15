# 🚀 Xenoxify Production Deployment Guide

## 📋 Pre-deployment Checklist

### ✅ Shopify App Configuration
Your Shopify app is configured with:
- **App URL**: `https://xenoxify.com`
- **Allowed redirection URL**: `https://xenoxify.com/api/auth/callback`
- **API Key**: `5013237d82a781ddc5a203f3927be7c3`
- **API Secret**: `bd48db258164438da0a52614ad22e20d`
- **Service Account**: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`

### ✅ Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/xenoxify"

# Shopify App Configuration
SHOPIFY_API_KEY="5013237d82a781ddc5a203f3927be7c3"
SHOPIFY_API_SECRET="bd48db258164438da0a52614ad22e20d"
SHOPIFY_SCOPES="read_products,write_products,read_customers,write_customers,read_orders,write_orders"
SHOPIFY_SERVICE_ACCOUNT="delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com"

# App Configuration
APP_URL="https://xenoxify.com"
FRONTEND_URL="https://xenoxify.com"
JWT_SECRET="xenoxify_jwt_secret_2024_production_key_change_this"
NODE_ENV="production"
```

## 🏗️ Deployment Options

### Option 1: Docker Deployment

```bash
# 1. Build and start services
docker-compose up -d

# 2. Run database migrations
docker-compose exec backend npx prisma migrate deploy

# 3. Seed initial data (optional)
docker-compose exec backend npm run db:seed
```

### Option 2: Manual Deployment

#### Backend Deployment (Node.js)

```bash
# 1. Install dependencies
cd server
npm ci --production

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations
npx prisma migrate deploy

# 4. Start the application
npm start
```

#### Frontend Deployment (React)

```bash
# 1. Install dependencies
cd client
npm ci

# 2. Build for production
npm run build

# 3. Deploy build folder to your CDN/hosting
```

## 🌐 Hosting Platforms

### Backend Hosting
- **Render**: Easy deployment with automatic SSL
- **Heroku**: Simple git-based deployment
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS EC2**: Full control over server

### Frontend Hosting
- **Vercel**: Optimized for React apps
- **Netlify**: Great for static sites
- **Cloudflare Pages**: Fast global CDN
- **AWS S3 + CloudFront**: Scalable static hosting

### Database Hosting
- **Render Postgres**: Managed PostgreSQL
- **Heroku Postgres**: Easy setup
- **AWS RDS**: Enterprise-grade database
- **DigitalOcean Managed Databases**: Simple setup

## 🔧 Production Configuration

### SSL/HTTPS Setup
Ensure your domain has SSL certificate:
```bash
# Using Let's Encrypt (if self-hosting)
sudo certbot --nginx -d xenoxify.com
```

### Environment Variables Setup
Set these in your hosting platform:

```env
DATABASE_URL=postgresql://user:pass@host:5432/xenoxify
SHOPIFY_API_KEY=5013237d82a781ddc5a203f3927be7c3
SHOPIFY_API_SECRET=bd48db258164438da0a52614ad22e20d
APP_URL=https://xenoxify.com
FRONTEND_URL=https://xenoxify.com
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Database Setup
```bash
# Create production database
createdb xenoxify

# Run migrations
npx prisma migrate deploy

# Optional: Seed with sample data
npm run db:seed
```

## 📊 Monitoring & Logs

### Health Check Endpoint
Monitor your app health:
```
GET https://xenoxify.com/health
```

### Log Monitoring
Set up logging for:
- Application errors
- Webhook failures
- Database connection issues
- API rate limiting

### Performance Monitoring
Monitor:
- Response times
- Database query performance
- Memory usage
- CPU utilization

## 🔒 Security Checklist

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] JWT secret is strong and unique
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Webhook HMAC verification working
- [ ] Database backups scheduled

## 🚨 Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Check webhook URLs in Shopify admin
   - Verify HTTPS is working
   - Check server logs for errors

2. **OAuth flow failing**
   - Verify redirect URL matches exactly
   - Check API key and secret
   - Ensure HTTPS is enabled

3. **Database connection errors**
   - Verify DATABASE_URL format
   - Check database server is running
   - Verify network connectivity

### Debug Commands

```bash
# Check application health
curl https://xenoxify.com/health

# Test webhook endpoint
curl -X POST https://xenoxify.com/api/webhooks/products/create \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Check database connection
npx prisma db pull
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer for multiple backend instances
- Implement Redis for session storage
- Use database connection pooling

### Performance Optimization
- Enable database indexing
- Implement caching layer
- Use CDN for static assets
- Optimize database queries

### Monitoring
- Set up application monitoring (New Relic, DataDog)
- Monitor database performance
- Track webhook success rates
- Monitor API rate limits

## 🔄 Maintenance

### Regular Tasks
- [ ] Database backups
- [ ] Security updates
- [ ] Performance monitoring
- [ ] Log rotation
- [ ] SSL certificate renewal

### Updates
- [ ] Node.js version updates
- [ ] Dependency updates
- [ ] Database migrations
- [ ] Feature deployments

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test webhook endpoints
4. Check database connectivity
5. Review Shopify app configuration

---

**Ready to deploy! 🚀**

