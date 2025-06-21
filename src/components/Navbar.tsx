import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const linkStyles = "px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-orange-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300";
  const desktopLinkStyles = `${linkStyles} text-center`;
  const mobileLinkStyles = `${linkStyles} block text-left`;

  const desktopMenuLinks = (
    <>
      <Link to="/" className={desktopLinkStyles}>Ana Sayfa</Link>
      <Link to="/submitted-recipes" className={desktopLinkStyles}>Sizden Gelenler</Link>
      {user ? (
        <>
          <Link to="/my-recipes" className={desktopLinkStyles}>Tariflerim</Link>
          <Link to="/favorites" className={desktopLinkStyles}>Favorilerim</Link>
          <Link to="/submit-recipe" className={desktopLinkStyles}>Tarif Gönder</Link>
        </>
      ) : (
        <>
          <Link to="/login" className={desktopLinkStyles}>Giriş Yap</Link>
          <Link to="/register" className={desktopLinkStyles}>Kayıt Ol</Link>
        </>
      )}
    </>
  );

  const mobileNavLinks = (
    <>
      <Link to="/" className={mobileLinkStyles}>Ana Sayfa</Link>
      <Link to="/submitted-recipes" className={mobileLinkStyles}>Sizden Gelenler</Link>
      {user ? (
        <>
          <Link to="/my-recipes" className={mobileLinkStyles}>Tariflerim</Link>
          <Link to="/favorites" className={mobileLinkStyles}>Favorilerim</Link>
          <Link to="/submit-recipe" className={mobileLinkStyles}>Tarif Gönder</Link>
          <Link to="/change-password" className={mobileLinkStyles}>Şifre Değiştir</Link>
          <button onClick={handleLogout} className={`${mobileLinkStyles} w-full`}>Çıkış Yap</button>
        </>
      ) : (
        <>
          <Link to="/login" className={mobileLinkStyles}>Giriş Yap</Link>
          <Link to="/register" className={mobileLinkStyles}>Kayıt Ol</Link>
        </>
      )}
    </>
  );


  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-extrabold text-orange-500 tracking-tight">Tarif Defteri</span>
            </Link>
          </div>
          {/* Masaüstü Menü */}
          <div className="hidden md:flex items-center space-x-2">
            {desktopMenuLinks}
            <ThemeToggleButton />
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-4 py-2 bg-orange-50 dark:bg-gray-700 text-orange-600 dark:text-orange-300 rounded-lg font-medium shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer"
                >
                  <span>Hoş geldiniz, {user.username}!</span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5">
                    <Link to="/change-password" onClick={() => setUserMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600 hover:text-orange-600">Şifre Değiştir</Link>
                    <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 hover:text-red-700">Çıkış Yap</button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Mobil Hamburger */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-orange-50 focus:outline-none"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menüyü Aç"
          >
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Drawer ve Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 md:hidden"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b dark:border-gray-700">
          <span className="text-2xl font-bold text-orange-500">Menü</span>
          <ThemeToggleButton />
          <button
            className="p-2 rounded hover:bg-orange-50 dark:hover:bg-gray-700"
            onClick={() => setDrawerOpen(false)}
            aria-label="Menüyü Kapat"
          >
            <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col py-4 px-2 space-y-2">
          {mobileNavLinks}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
