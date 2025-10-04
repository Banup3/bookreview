# 📚 Book Review Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application where users can sign up, log in, add books, and review books with ratings and comments.

## ✨ Features

### Core Features
- **User Authentication**
  - Sign up with name, email, and password (hashed with bcrypt)
  - Login with JWT token authentication
  - Protected routes with authentication middleware
  
- **Book Management**
  - Add books with title, author, description, genre, and published year
  - Edit and delete own books (only creator can modify)
  - View all books with pagination (5 books per page)
  - Book details page with reviews and average ratings
  
- **Review System**
  - Add reviews with 1-5 star ratings and review text
  - Edit and delete own reviews
  - View all reviews for a book
  - Automatic average rating calculation
  - One review per user per book

### Bonus Features Implemented ⭐
- **Search & Filter**: Search books by title/author and filter by genre
- **Sorting**: Sort books by published year, average rating, or title
- **Charts**: Rating distribution chart using Recharts
- **Dark/Light Mode**: Toggle theme with persistent storage
- **User Profile**: View user's added books and reviews
- **Modern UI**: Beautiful interface with Tailwind CSS and Lucide icons

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express middleware for route protection

### Frontend
- React 18 with Vite
- React Router v6 for navigation
- Context API for state management
- Axios for API calls
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons

## 📁 Project Structure

```
bookreview/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── BookCard.jsx
    │   │   ├── StarRating.jsx
    │   │   ├── Pagination.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   ├── BookList.jsx
    │   │   ├── BookDetails.jsx
    │   │   ├── AddBook.jsx
    │   │   ├── EditBook.jsx
    │   │   └── Profile.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd c:\Users\banup\CascadeProjects\bookreview
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`

## 📊 Database Schema

### User Schema
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 6 chars),
  timestamps: true
}
```

### Book Schema
```javascript
{
  title: String (required, max 200 chars),
  author: String (required, max 100 chars),
  description: String (required, max 2000 chars),
  genre: String (enum: Fiction, Non-Fiction, etc.),
  publishedYear: Number (required, 1000-current year),
  addedBy: ObjectId (ref: User),
  averageRating: Number (0-5, default 0),
  reviewCount: Number (default 0),
  timestamps: true
}
```

### Review Schema
```javascript
{
  book: ObjectId (ref: Book, required),
  user: ObjectId (ref: User, required),
  rating: Number (required, 1-5),
  reviewText: String (required, max 1000 chars),
  timestamps: true,
  unique: [book, user] // One review per user per book
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Books
- `GET /api/books` - Get all books (with pagination, search, filter, sort)
- `GET /api/books/:id` - Get single book with reviews
- `POST /api/books` - Create book (Protected)
- `PUT /api/books/:id` - Update book (Protected, creator only)
- `DELETE /api/books/:id` - Delete book (Protected, creator only)
- `GET /api/books/user/my-books` - Get user's books (Protected)

### Reviews
- `GET /api/reviews/:bookId` - Get reviews for a book
- `POST /api/reviews/:bookId` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected, creator only)
- `DELETE /api/reviews/:id` - Delete review (Protected, creator only)
- `GET /api/reviews/user/my-reviews` - Get user's reviews (Protected)
- `GET /api/reviews/:bookId/distribution` - Get rating distribution

## 🎨 Frontend Pages

1. **Signup Page** - User registration form
2. **Login Page** - User login form
3. **Book List Page** - Home page with all books, search, filter, and sort
4. **Book Details Page** - Detailed book view with reviews and rating chart
5. **Add Book Page** - Form to add new book (Protected)
6. **Edit Book Page** - Form to edit book (Protected)
7. **Profile Page** - User's books and reviews (Protected)

## 🔐 Security Features

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT token authentication
- Protected routes with auth middleware
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## 🎯 Key Highlights

- **MVC Architecture**: Clean separation of concerns
- **Context API**: Global state management for auth and theme
- **Responsive Design**: Mobile-friendly UI
- **Dark Mode**: Persistent theme preference
- **Real-time Updates**: Auto-calculated average ratings
- **Error Handling**: Comprehensive error messages
- **Loading States**: User-friendly loading indicators
- **Form Validation**: Client and server-side validation

## 📝 Usage Guide

1. **Sign Up**: Create an account with your name, email, and password
2. **Browse Books**: View all books on the home page
3. **Search & Filter**: Find books by title/author or filter by genre
4. **Add Book**: Click "Add Book" to share a new book (requires login)
5. **Review Book**: Click on any book to view details and add a review
6. **Manage Content**: Edit or delete your own books and reviews
7. **View Profile**: Check your added books and reviews in your profile

## 🚢 Deployment (Optional)

### Backend Deployment
- **Render/Heroku/Railway**: Deploy backend with MongoDB Atlas
- Set environment variables in platform settings

### Frontend Deployment
- **Vercel/Netlify**: Deploy frontend React app
- Update API base URL in axios configuration

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Built with ❤️ using MERN Stack

---

**Happy Reading! 📚✨**
