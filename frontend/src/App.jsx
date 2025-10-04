import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <Routes>
              <Route path="/" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/add-book"
                element={
                  <PrivateRoute>
                    <AddBook />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-book/:id"
                element={
                  <PrivateRoute>
                    <EditBook />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
