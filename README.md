# Xenoxify - Multi-tenant Shopify Analytics Platform

A comprehensive multi-tenant data ingestion and analytics platform for Shopify stores, built with Node.js, React, and PostgreSQL.

---

## 🚀 Features
- **Multi-tenant Architecture**: Isolated data per Shopify store  
- **Real-time Data Sync**: Webhook-based real-time updates  
- **Scheduled Backfill**: Automated periodic data synchronization  
- **Analytics Dashboard**: Interactive charts and insights  
- **OAuth Integration**: Secure Shopify app installation  
- **Responsive UI**: Modern React frontend with Tailwind CSS  

---

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

---

## 🛠️ Tech Stack
### Backend
- **Node.js** + **Express.js** - Server framework  
- **Prisma** - ORM with PostgreSQL  
- **JWT** - Authentication  
- **Axios** - Shopify API client  
- **Node-cron** - Scheduled tasks  

### Frontend
- **React 18** - UI framework  
- **React Router** - Routing  
- **Recharts** - Data visualization  
- **Tailwind CSS** - Styling  
- **React Hot Toast** - Notifications  

### Database
- **PostgreSQL** - Primary database  
- **Multi-tenant schema** with tenant isolation  

---

## 📋 Prerequisites
- Node.js 18+  
- PostgreSQL 13+  
- Shopify Partner Account  
- ngrok (for local testing)  

---

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
createdb xenoxify
cp server/env.example server/.env
# Edit server/.env with DB URL & Shopify credentials
```

### 3. Database Migration
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
npm run db:seed
```

### 4. Shopify App Setup
- **App URL**: `https://xenoxify.com`  
- **Redirect URL**: `https://xenoxify.com/api/auth/callback`  
- **API Key**: `YOUR_API_KEY`  
- **API Secret**: `YOUR_API_SECRET`  

Add these to `.env`.  

### 5. Start Servers
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start

# Terminal 3: Worker (optional)
cd server && npm run worker
```

### 6. Access
- Frontend → http://localhost:3000  
- Backend → http://localhost:3001  
- Health Check → http://localhost:3001/health  

---

## 🔧 Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/xenoxify"
SHOPIFY_API_KEY="your_api_key"
SHOPIFY_API_SECRET="your_api_secret"
SHOPIFY_SCOPES="read_products,write_products,read_customers,read_orders"

APP_URL="https://xenoxify.com"
FRONTEND_URL="https://xenoxify.com"
JWT_SECRET="your_jwt_secret"
NODE_ENV="production"
```

---

## 📊 Database Schema
- **tenants** → Shopify store info & tokens  
- **users** → App users  
- **products** → Products (per tenant)  
- **customers** → Customers (per tenant)  
- **orders** → Orders (per tenant)  
- **snapshots** → Aggregated analytics  

_All tables include `tenant_id` for isolation._  

---

## 🔌 API Endpoints
### Auth
- `GET /auth/install?shop=store.myshopify.com`  
- `GET /auth/callback`  
- `POST /auth/login`  

### Webhooks
- `POST /webhooks/products/create`  
- `POST /webhooks/customers/create`  
- `POST /webhooks/orders/create`  

### Insights
- `GET /api/insights/summary`  
- `GET /api/insights/orders`  
- `GET /api/insights/top-customers`  

### Data
- `GET /api/products`  
- `GET /api/customers`  
- `GET /api/orders`  

---

## 🔄 Data Synchronization
### Real-time (Webhooks)
- Automatic registration  
- HMAC verification  
- Immediate updates  

### Scheduled (Worker)
- Daily full sync (2 AM)  
- Hourly incremental sync  
- Rate-limited API calls  
- Retry logic  

---

## 🧪 Testing
### Local with ngrok
```bash
npm install -g ngrok
ngrok http 3001
```

Update Shopify app URLs with ngrok URL.  

---

## 🚀 Deployment
### Backend
```bash
git push heroku main
```

### Frontend
```bash
cd client
npm run build
```

Deploy `/build` to Vercel/Netlify.  

### Database
Use managed PostgreSQL (Render, Heroku, AWS RDS, ElephantSQL).  

---

## 📈 Monitoring & Analytics
- Total customers per tenant  
- Order volume & revenue  
- Product performance  
- CLV (Customer Lifetime Value)  

Visualizations:
- Line chart (orders)  
- Bar chart (revenue)  
- Top customers table  

---

## 🔒 Security
- **HMAC Verification** for webhooks  
- **JWT Authentication**  
- **Tenant Isolation**  
- **Rate Limiting**  
- **CORS Configuration**  

---

## 🐛 Troubleshooting
**1. Webhook not working** → Check ngrok + HMAC  
**2. DB errors** → Check `DATABASE_URL` + run migrations  
**3. OAuth issues** → Verify app URLs + keys  

Logs:
```bash
cd server && npm run dev
cd server && npm run worker
```

---

## 🚧 Known Limitations
- Shopify API rate limits (2 req/sec)  
- No auto data cleanup  
- Single worker instance  
- Basic email auth  

---

## 🔮 Next Steps
- [ ] Redis queue system  
- [ ] Load balancer support  
- [ ] OAuth providers  
- [ ] Advanced analytics & reporting  
- [ ] Mobile app support  
- [ ] Automated backups  

---

