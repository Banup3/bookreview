# 🚀 Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB Atlas account** (free tier) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for cloning) - [Download](https://git-scm.com/)

## Step-by-Step Setup

### 1. MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster (choose free tier M0)

2. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a user with a username and password
   - Set permissions to "Read and write to any database"
   - Save the credentials securely

3. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

4. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `bookreview` or your preferred database name

### 2. Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   
   Create a `.env` file in the `backend` directory:
   ```bash
   # Copy from example
   copy .env.example .env
   ```

4. **Configure Environment Variables**
   
   Edit `.env` file with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookreview?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

   **Important Notes:**
   - Replace MongoDB URI with your actual connection string
   - Use a strong, random JWT_SECRET (you can generate one using online tools)
   - Keep the `.env` file secure and never commit it to version control

5. **Start Backend Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # OR Production mode
   npm start
   ```

   You should see:
   ```
   MongoDB Connected: cluster0.xxxxx.mongodb.net
   Server running in development mode on port 5000
   ```

### 3. Frontend Setup

1. **Open New Terminal** (keep backend running)

2. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.0.8  ready in 500 ms
   
   ➜  Local:   http://localhost:3000/
   ➜  Network: use --host to expose
   ```

5. **Access the Application**
   
   Open your browser and go to: `http://localhost:3000`

## Testing the Application

### 1. Using the Web Interface

1. **Sign Up**
   - Click "Sign Up" in the navbar
   - Enter your name, email, and password
   - Submit the form

2. **Login**
   - Use the credentials you just created
   - You'll be redirected to the home page

3. **Add a Book**
   - Click "Add Book" in the navbar
   - Fill in the book details
   - Submit the form

4. **Add a Review**
   - Click on any book card
   - Scroll to the review section
   - Add a rating and review text
   - Submit the review

### 2. Using Postman

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select the `backend/Postman_Collection.json` file
   - Collection will be imported with all API endpoints

2. **Test Authentication**
   - Send POST request to `/api/auth/signup`
   - Copy the token from response
   - Set the `token` variable in Postman collection
   - Now you can test protected routes

3. **Test All Endpoints**
   - Follow the collection order: Auth → Books → Reviews
   - Update the `:id` parameters with actual IDs from responses

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error:** `MongoServerError: bad auth`
- **Solution:** Check your MongoDB username and password in `.env`
- Ensure you've added your IP to Network Access in MongoDB Atlas

### Issue 2: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`
- **Solution:** 
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Or change PORT in .env
  ```

### Issue 3: CORS Errors
**Error:** `Access to fetch has been blocked by CORS policy`
- **Solution:** Ensure backend is running on port 5000
- Check that frontend proxy is configured in `vite.config.js`

### Issue 4: JWT Token Invalid
**Error:** `Not authorized to access this route`
- **Solution:** 
  - Logout and login again to get a new token
  - Check if JWT_SECRET matches in .env
  - Ensure token is being sent in Authorization header

### Issue 5: Module Not Found
**Error:** `Cannot find module 'xyz'`
- **Solution:**
  ```bash
  # Delete node_modules and package-lock.json
  rm -rf node_modules package-lock.json
  
  # Reinstall dependencies
  npm install
  ```

## Project Structure Verification

After setup, verify your structure:

```
bookreview/
├── backend/
│   ├── node_modules/
│   ├── .env (created by you)
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── node_modules/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Running in Production

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables Reference

### Backend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | development |

## Next Steps

1. ✅ Setup complete - Application is running
2. 📝 Create test data (users, books, reviews)
3. 🎨 Customize the UI if needed
4. 🚀 Deploy to production (see README.md)
5. 📊 Monitor and maintain

## Need Help?

- Check console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure MongoDB cluster is running
- Check if all ports are available
- Review the API documentation in README.md

---

**Happy Coding! 🎉**
