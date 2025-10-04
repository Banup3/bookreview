# 🚀 Deployment Guide

Complete guide to deploy the Book Review Platform to production.

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas cluster created (production)
- [ ] Environment variables documented
- [ ] Tested locally
- [ ] .gitignore configured (no .env files)

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

Ensure your `backend/package.json` has these scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 2: Sign Up for Render

1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub account
3. Authorize Render to access your repository

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `bookreview`
3. Configure the service:

**Basic Settings:**
```
Name: bookreview-api (or your choice)
Region: Choose closest to your users
Branch: main
Root Directory: backend
Runtime: Node
```

**Build Settings:**
```
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Free (for testing/development)
Starter ($7/month for production)
```

### Step 4: Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreview?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_for_production
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
```

**Important:**
- Use your MongoDB Atlas connection string
- Generate a strong JWT_SECRET (minimum 32 characters)
- Don't use development credentials

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start the server
3. Wait for deployment (2-5 minutes)
4. Get your backend URL: `https://your-app-name.onrender.com`

### Step 6: Test Backend

Test the health endpoint:
```bash
curl https://your-app-name.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 🔥 Important Notes for Render:

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- For production, use paid tier ($7/month)

**Automatic Deploys:**
- Every push to `main` branch triggers auto-deploy
- Can disable in Render settings if needed

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

Update `frontend/vite.config.js` to use production backend:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || '')
  }
})
```

Update API calls in `frontend/src/context/AuthContext.jsx`:

```javascript
import axios from 'axios';

// Set base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;
```

### Step 2: Sign Up for Vercel

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with GitHub account
3. Authorize Vercel to access your repository

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `bookreview`
3. Configure project:

**Framework Preset:**
```
Vite
```

**Root Directory:**
```
frontend
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Set Environment Variables

Add in Vercel project settings:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build the project
   - Deploy to CDN
3. Wait for deployment (1-2 minutes)
4. Get your frontend URL: `https://your-app.vercel.app`

### Step 6: Update Backend CORS

Update `backend/server.js` to allow your frontend domain:

```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app.vercel.app' // Add your Vercel URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and push changes. Render will auto-deploy.

### 🔥 Important Notes for Vercel:

**Automatic Deploys:**
- Every push to `main` triggers production deploy
- Pull requests get preview deployments
- Free tier includes unlimited bandwidth

---

## 🎨 Alternative: Frontend on Netlify

### Step 1: Sign Up

1. Go to [Netlify.com](https://www.netlify.com/)
2. Sign up with GitHub

### Step 2: Deploy

1. Click **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub and select repository
3. Configure:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

### Step 3: Environment Variables

Go to **Site settings** → **Environment variables**:

```
VITE_API_URL=https://your-backend-app.onrender.com
```

### Step 4: Deploy

Click **"Deploy site"**

---

## 🔐 MongoDB Atlas Production Setup

### Step 1: Create Production Cluster

1. In MongoDB Atlas, create new cluster or use existing
2. Name it: `production-cluster`
3. Choose same region as your Render deployment

### Step 2: Security

**Database Access:**
1. Create production user with strong password
2. Grant read/write access
3. Save credentials securely

**Network Access:**
1. Add IP: `0.0.0.0/0` (allow from anywhere)
2. Or add Render's IP addresses specifically

### Step 3: Get Connection String

1. Click **"Connect"** → **"Connect your application"**
2. Copy connection string
3. Replace `<password>` and `<dbname>`
4. Add to Render environment variables

---

## 🧪 Post-Deployment Testing

### Test Backend

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Signup
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Test Frontend

1. Visit your Vercel URL
2. Sign up with test account
3. Add a book
4. Write a review
5. Test all features:
   - Search
   - Filter
   - Sort
   - Dark mode
   - Profile page

---

## 📊 Monitoring & Logs

### Render Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time server logs
4. Filter by level (info, error, warn)

### Vercel Logs

1. Go to your project in Vercel dashboard
2. Click **"Deployments"** → Select deployment
3. View build logs and function logs

---

## 🔄 Continuous Deployment

### Automatic Deploys Enabled

**On Push to Main:**
1. Git push triggers webhook
2. Render rebuilds backend (2-5 min)
3. Vercel rebuilds frontend (1-2 min)
4. Both deploy automatically

### Manual Deploys

**Render:**
- Click **"Manual Deploy"** → **"Deploy latest commit"**

**Vercel:**
- Click **"Redeploy"** from Deployments tab

---

## ⚙️ Production Configuration

### Backend Production Settings

Update `backend/server.js`:

```javascript
// Production settings
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Add security headers
  app.use(compression()); // Enable compression
  app.set('trust proxy', 1); // Trust Render proxy
}
```

Install additional packages:
```bash
npm install helmet compression
```

### Frontend Production Settings

Update `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // Remove console.logs in production
      }
    }
  }
})
```

---

## 🚨 Troubleshooting

### Backend Not Starting

**Check Render Logs:**
```
Error: Cannot find module 'express'
→ Solution: Ensure package.json is in root directory
```

```
MongoServerError: bad auth
→ Solution: Check MongoDB credentials in environment variables
```

### Frontend Build Failed

**Check Vercel Logs:**
```
Error: Failed to resolve import
→ Solution: Check all imports in your components
```

```
Module not found: Can't resolve 'axios'
→ Solution: Ensure all dependencies in package.json
```

### CORS Errors

```
Access to fetch blocked by CORS policy
→ Solution: Add Vercel URL to backend CORS configuration
```

### API Not Connecting

**Check:**
1. Backend URL in frontend environment variable
2. Backend is running (visit health endpoint)
3. Network tab in browser dev tools
4. CORS configuration

---

## 💰 Cost Breakdown

### Free Tier (Development/Testing)

| Service | Cost | Limits |
|---------|------|--------|
| Render Free | $0 | Sleeps after 15min, 750hrs/month |
| Vercel Hobby | $0 | Unlimited bandwidth |
| MongoDB Atlas Free | $0 | 512MB storage |
| **Total** | **$0/month** | Good for testing |

### Production Tier (Recommended)

| Service | Cost | Benefits |
|---------|------|----------|
| Render Starter | $7/month | Always on, no sleep |
| Vercel Pro | $20/month | Team features, analytics |
| MongoDB Atlas M2 | $9/month | 2GB storage, backups |
| **Total** | **$36/month** | Production ready |

---

## 📝 Deployment Checklist

### Before Deploy
- [ ] All tests passing locally
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Strong JWT_SECRET generated
- [ ] Environment variables documented

### Backend Deploy
- [ ] Render account created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Deployment successful
- [ ] Health endpoint tested

### Frontend Deploy
- [ ] Vercel/Netlify account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] App loads correctly

### Post-Deploy
- [ ] Backend CORS updated
- [ ] Full app tested
- [ ] All features working
- [ ] Performance checked
- [ ] Logs monitored

---

## 🎯 Quick Deploy Summary

### Render (Backend)
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment Variables: MONGODB_URI, JWT_SECRET, NODE_ENV, PORT
```

### Vercel (Frontend)
```
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Environment Variables: VITE_API_URL
```

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Deployment Best Practices](https://12factor.net/)

---

**Your app is now live! 🎉**

Share your URLs:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com/api`

---

*Last Updated: 2024*
