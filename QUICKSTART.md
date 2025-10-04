# ⚡ Quick Start Guide

Get the Book Review Platform running in 5 minutes!

## Prerequisites Check

Open PowerShell and verify installations:

```powershell
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Step 1: MongoDB Setup (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create free account → Create free cluster (M0)
3. **Database Access**: Add user with username & password
4. **Network Access**: Add IP `0.0.0.0/0` (allow from anywhere)
5. **Connect**: Copy connection string

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/bookreview?retryWrites=true&w=majority
```

## Step 2: Backend Setup (1 minute)

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

**Edit `.env` file** with your MongoDB URI:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=my_super_secret_jwt_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
```

**Start backend:**
```powershell
npm run dev
```

✅ Should see: `MongoDB Connected` and `Server running on port 5000`

## Step 3: Frontend Setup (1 minute)

**Open NEW terminal** (keep backend running):

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Should see: `Local: http://localhost:3000/`

## Step 4: Test It Out! (1 minute)

1. **Open browser**: `http://localhost:3000`
2. **Sign up**: Create an account
3. **Add a book**: Click "Add Book" button
4. **Add a review**: Click on the book, write a review
5. **Explore features**: Try search, filters, dark mode toggle!

## 🎯 Quick Test Data

### Sample Book 1:
- **Title**: The Great Gatsby
- **Author**: F. Scott Fitzgerald
- **Description**: A classic American novel set in the Jazz Age
- **Genre**: Fiction
- **Year**: 1925

### Sample Book 2:
- **Title**: 1984
- **Author**: George Orwell
- **Description**: A dystopian social science fiction novel
- **Genre**: Science Fiction
- **Year**: 1949

## 🔧 Troubleshooting

### Backend won't start?
```powershell
# Check if port 5000 is available
netstat -ano | findstr :5000

# If busy, kill the process or change PORT in .env to 5001
```

### Frontend won't start?
```powershell
# Clear cache and reinstall
rm -r node_modules
npm install
```

### MongoDB connection failed?
- Verify connection string in `.env`
- Check username/password are correct
- Ensure IP `0.0.0.0/0` is added in MongoDB Atlas Network Access

### Can't see books/reviews?
- Make sure both backend (port 5000) and frontend (port 3000) are running
- Check browser console for errors (F12)
- Try logging out and logging in again

## 📱 Using the Platform

### As a User:
1. **Browse Books** - Home page shows all books with pagination
2. **Search** - Type in search box to find books by title/author
3. **Filter** - Select genre from dropdown
4. **Sort** - Sort by latest, title, year, or rating

### As a Contributor:
1. **Add Books** - Click "Add Book" (must be logged in)
2. **Write Reviews** - Click any book, scroll down, add review
3. **Edit/Delete** - You can only edit/delete your own content
4. **Profile** - View all your books and reviews

## 🎨 Features to Try

- ✅ Dark/Light mode toggle (moon/sun icon)
- ✅ Star rating system (1-5 stars)
- ✅ Rating distribution chart (on book details)
- ✅ Pagination (5 books per page)
- ✅ Responsive design (try on mobile)
- ✅ Real-time average rating updates

## 🚀 Next Steps

1. Read full [README.md](./README.md) for detailed documentation
2. Check [SETUP.md](./SETUP.md) for advanced configuration
3. Import [Postman Collection](./backend/Postman_Collection.json) for API testing
4. Deploy to production (Render + Vercel)

## 📞 Need Help?

Check the detailed [SETUP.md](./SETUP.md) guide for common issues and solutions.

---

**Enjoy your Book Review Platform! 📚✨**
