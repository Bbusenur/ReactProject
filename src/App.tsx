// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import SubmitRecipe from './pages/SubmitRecipe';
import SubmittedRecipes from './pages/SubmittedRecipes';
import Favorites from './pages/Favorites';
import { AuthProvider } from './context/AuthContext';
import ChangePassword from './pages/ChangePassword';
import ScrollToTopButton from './components/ScrollToTopButton';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              aria-label="Bildirimler"
              theme="colored"
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/my-recipes" element={<Recipes />} />
              <Route path="/submit-recipe" element={<SubmitRecipe />} />
              <Route path="/submitted-recipes" element={<SubmittedRecipes />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
            <ScrollToTopButton />
            <ThemeToggleButton />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;





