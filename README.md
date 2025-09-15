# Xenoxify - Multi-tenant Shopify Analytics Platform

A comprehensive multi-tenant data ingestion and analytics platform for Shopify stores, built with Node.js, React, and PostgreSQL.

## 🚀 Features

- **Multi-tenant Architecture**: Isolated data per Shopify store
- **Real-time Data Sync**: Webhook-based real-time updates
- **Scheduled Backfill**: Automated periodic data synchronization
- **Analytics Dashboard**: Interactive charts and insights
- **OAuth Integration**: Secure Shopify app installation
- **Responsive UI**: Modern React frontend with Tailwind CSS

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Express Backend│    │   PostgreSQL    │
│   (Port 3000)   │◄──►│   (Port 3001)   │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Data Sync      │
                       │  Worker         │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Shopify API    │
                       │  + Webhooks     │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **Prisma** - Database ORM with PostgreSQL
- **JWT** - Authentication
- **Axios** - HTTP client for Shopify API
- **Node-cron** - Scheduled tasks

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

### Database
- **PostgreSQL** - Primary database
- **Multi-tenant schema** with tenant isolation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Shopify Partner Account (for app development)
- ngrok (for local webhook testing)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd xenoxify
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb xenoxify

# Set up environment variables
cp server/env.example server/.env
# Edit server/.env with your database URL and Shopify credentials
```

### 3. Database Migration

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

### 4. Shopify App Setup

Your Shopify app is already configured with the following credentials:

**App Configuration:**
- **App URL**: `https://xenoxify.com`
- **Allowed redirection URL**: `https://xenoxify.com/api/auth/callback`
- **API Key**: `5013237d82a781ddc5a203f3927be7c3`
- **API Secret**: `bd48db258164438da0a52614ad22e20d`
- **Service Account**: `delivery@shopify-pubsub-webhooks.iam.gserviceaccount.com`

Copy these credentials to your environment file.

### 5. Start Development Servers

```bash
# Terminal 1: Backend + Worker
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm start

# Terminal 3: Worker (optional, runs automatically with dev)
cd server
npm run worker
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/xenoxify"

# Shopify App Configuration
SHOPIFY_API_KEY="5013237d82a781ddc5a203f3927be7c3"
SHOPIFY_API_SECRET="bd48db258164438da0a52614ad22e20d"
SHOPIFY_SCOPES="read_products,write_products,read_customers,write_customers,read_orders,write_orders"

# App Configuration
APP_URL="https://xenoxify.com"
FRONTEND_URL="https://xenoxify.com"
JWT_SECRET="xenoxify_jwt_secret_2024_production_key_change_this"
NODE_ENV="production"
```

## 📊 Database Schema

### Core Tables

- **tenants** - Shopify store information and access tokens
- **users** - Application users with tenant association
- **products** - Shopify products with tenant isolation
- **customers** - Shopify customers with tenant isolation
- **orders** - Shopify orders with tenant isolation
- **snapshots** - Aggregated analytics data

### Multi-tenant Design

All business data tables include a `tenant_id` foreign key to ensure complete data isolation between stores.

## 🔌 API Endpoints

### Authentication
- `GET /auth/install?shop=store.myshopify.com` - Initiate OAuth
- `GET /auth/callback` - OAuth callback
- `POST /auth/login` - User login

### Webhooks
- `POST /webhooks/products/create` - Product creation
- `POST /webhooks/products/update` - Product updates
- `POST /webhooks/customers/create` - Customer creation
- `POST /webhooks/orders/create` - Order creation

### API
- `GET /api/insights/summary` - Dashboard summary
- `GET /api/insights/orders` - Orders analytics
- `GET /api/insights/top-customers` - Top customers
- `GET /api/products` - Products list
- `GET /api/customers` - Customers list
- `GET /api/orders` - Orders list

## 🔄 Data Synchronization

### Real-time Sync (Webhooks)
- Automatic webhook registration on app install
- HMAC verification for security
- Immediate data updates for products, customers, and orders

### Scheduled Sync (Worker)
- Daily full synchronization at 2 AM
- Hourly incremental sync for recent data
- Rate-limited API calls to respect Shopify limits
- Automatic retry logic for failed requests

## 🧪 Testing

### Local Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3001

# Update Shopify app URLs to use ngrok URL
# Example: https://abc123.ngrok.io
```

### Sample Data

The seed script creates sample data for testing:
- Email: `admin@xenoxify.com`
- Tenant ID: Generated UUID (check console output)

## 🚀 Deployment

### Backend (Render/Heroku)

```bash
# Set environment variables
DATABASE_URL=postgresql://...
SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)

```bash
# Build
cd client
npm run build

# Deploy build folder
```

### Database

Use managed PostgreSQL services:
- **Render Postgres**
- **Heroku Postgres**
- **AWS RDS**
- **ElephantSQL**

## 📈 Monitoring & Analytics

### Key Metrics
- Total customers per tenant
- Order volume and revenue
- Product performance
- Customer lifetime value

### Charts & Visualizations
- Orders over time (line chart)
- Revenue trends (bar chart)
- Top customers table
- Real-time dashboard updates

## 🔒 Security Features

- **HMAC Verification** - All webhooks verified
- **JWT Authentication** - Secure API access
- **Tenant Isolation** - Complete data separation
- **Rate Limiting** - API protection
- **CORS Configuration** - Cross-origin security

## 🐛 Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Check ngrok tunnel is active
   - Verify webhook URLs in Shopify admin
   - Check HMAC verification

2. **Database connection errors**
   - Verify DATABASE_URL format
   - Check PostgreSQL is running
   - Run migrations: `npx prisma migrate dev`

3. **OAuth flow issues**
   - Verify app URLs in Shopify Partner Dashboard
   - Check API key and secret
   - Ensure HTTPS for production

### Logs

```bash
# Backend logs
cd server && npm run dev

# Worker logs
cd server && npm run worker
```

## 🚧 Known Limitations

- **Rate Limits**: Shopify API has rate limits (2 requests/second)
- **Data Retention**: No automatic data cleanup (implement as needed)
- **Scaling**: Single-instance worker (consider queue system for scale)
- **Authentication**: Basic email-based auth (enhance with OAuth providers)

## 🔮 Next Steps

### Production Enhancements
- [ ] Redis queue system for background jobs
- [ ] Horizontal scaling with load balancers
- [ ] Advanced authentication (OAuth providers)
- [ ] Data export/import features
- [ ] Advanced analytics and reporting
- [ ] Mobile app support
- [ ] API rate limiting and monitoring
- [ ] Automated backups and disaster recovery

### Performance Optimizations
- [ ] Database indexing optimization
- [ ] GraphQL API for efficient data fetching
- [ ] Caching layer (Redis)
- [ ] CDN for static assets
- [ ] Database connection pooling

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Shopify API documentation
- Open an issue in the repository

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for the Shopify ecosystem**
