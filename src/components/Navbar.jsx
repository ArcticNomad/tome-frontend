import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Home, LogOut, User, Library as LibraryIcon, ChevronDown, Menu, X, BookOpen, Sparkles, Globe } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import SplitText from './SplitText';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [breadcrumbStack, setBreadcrumbStack] = useState([{ name: 'Home', path: '/' }]);
  
  const { currentUser, logout } = useAuth();
  const { profile } = useUserProfile();
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  // Effect to handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Get display name for current location
  const getDisplayName = (pathname, search) => {
    const searchParams = new URLSearchParams(search);
    const category = searchParams.get('category');
    const filter = searchParams.get('filter');

    if (pathname === '/') return 'Home';
    if (pathname === '/books') return 'Books';
    if (pathname === '/booklists') {
      if (filter === 'free') return 'Free Books';
      if (filter === 'paid') return 'Paid Books';
      return category || 'Book List';
    }
    if (pathname.startsWith('/book/')) return 'Book Details';
    if (pathname === '/tags') return 'Tags';
    if (pathname === '/reader') return 'Reader';
    if (pathname === '/library') return 'Library';
    if (pathname === '/login') return 'Login';
    if (pathname === '/signup') return 'Sign Up';
    if (pathname === '/profile') return 'Profile';
    
    const name = pathname.split('/').pop().replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Manage breadcrumb stack
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const displayName = getDisplayName(location.pathname, location.search);

    if (location.pathname === '/') {
      setBreadcrumbStack([{ name: 'Home', path: '/' }]);
      return;
    }

    const topLevelPaths = ['/books', '/booklists', '/reader', '/tags', '/library', '/profile', '/login', '/signup'];
    const isTopLevel = topLevelPaths.includes(location.pathname);

    if (isTopLevel) {
      setBreadcrumbStack([
        { name: 'Home', path: '/' },
        { name: displayName, path: currentPath }
      ]);
      return;
    }

    const existingIndex = breadcrumbStack.findIndex(crumb => crumb.path === currentPath);
    if (existingIndex !== -1) {
      setBreadcrumbStack(prev => prev.slice(0, existingIndex + 1));
    } else {
      setBreadcrumbStack(prev => {
        if (prev.length > 0 && prev[prev.length - 1].path === currentPath) return prev;
        return [...prev, { name: displayName, path: currentPath }];
      });
    }
  }, [location]);

  const handleBreadcrumbClick = (crumb, index) => {
    navigate(crumb.path);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      setProfileMenuOpen(false);
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleMobileLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const avatarUrl = profile?.personalDetails?.profilePicture ||
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || 'guest'}`;

  return (
    <>
      {/* ENHANCED MOBILE MENU */}
      <div className={`mobile-menu-container fixed inset-0 z-[1000] transition-all duration-300 ease-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-40' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-chill-surface to-chill-card shadow-2xl transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <button onClick={handleHomeClick} className="flex items-center gap-2">
              <div className="h-8">
                <img src="/booklogo.png" alt="Tome Logo" className='w-full h-full'/>
              </div>
              <span className='text-white text-xl font-black'>TOME</span>
            </button>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          
          {/* Navigation Links */}
          <div className="p-6 space-y-1">
            <button 
              onClick={() => handleMobileLinkClick('/')}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-chill-sage/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home size={20} className="text-chill-sage" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-lg">Home</div>
                <div className="text-gray-400 text-sm">Discover new books</div>
              </div>
              <ChevronRight size={20} className="text-gray-500" />
            </button>
            
            <button 
              onClick={() => handleMobileLinkClick('/books')}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-chill-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen size={20} className="text-chill-blue" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-lg">Books</div>
                <div className="text-gray-400 text-sm">Browse all books</div>
              </div>
              <ChevronRight size={20} className="text-gray-500" />
            </button>
            
            <button 
              onClick={() => handleMobileLinkClick('/reader')}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-chill-rose/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles size={20} className="text-chill-rose" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-lg">Reader</div>
                <div className="text-gray-400 text-sm">Reading experience</div>
              </div>
              <ChevronRight size={20} className="text-gray-500" />
            </button>
            
            <button 
              onClick={() => handleMobileLinkClick('/about')}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-chill-lavender/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe size={20} className="text-chill-lavender" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-lg">About Us</div>
                <div className="text-gray-400 text-sm">Learn about Tome</div>
              </div>
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>
          
          {/* User Section */}
          <div className="p-6 border-t border-white/10">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  <div className="flex-1">
                    <div className="text-white font-semibold truncate">
                      {profile?.displayName || currentUser.displayName || 'Reader'}
                    </div>
                    <div className="text-gray-400 text-sm truncate">{currentUser.email}</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleMobileLinkClick('/profile')}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center"
                  >
                    <User size={18} className="mx-auto mb-1 text-chill-sage" />
                    <div className="text-white text-xs font-medium">Profile</div>
                  </button>
                  <button 
                    onClick={() => handleMobileLinkClick('/library')}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center"
                  >
                    <LibraryIcon size={18} className="mx-auto mb-1 text-chill-blue" />
                    <div className="text-white text-xs font-medium">Library</div>
                  </button>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => handleMobileLinkClick('/login')}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleMobileLinkClick('/signup')}
                  className="w-full p-4 rounded-xl bg-chill-sage hover:bg-chill-sand text-black font-bold transition-colors shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="text-gray-400 text-xs text-center">
              © {new Date().getFullYear()} Tome. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative py-2 px-4 md:py-3 md:px-8 lg:px-16 text-stone-800 bg-chill-surface sticky top-0 z-50 overflow-visible border-b border-white/10">
        <div className="flex justify-between items-center w-full">
          {/* LOGO */}
          <button onClick={handleHomeClick} className="flex items-center gap-2 hover:opacity-80 transition min-w-0">
            <div className="h-8 md:h-10 lg:h-12">
              <img src="/booklogo.png" alt="Tome Logo" className='w-auto h-full'/>
            </div>
            <span className='text-white text-lg md:text-xl lg:text-2xl font-black tracking-tighter hidden sm:block'>TOME</span>
          </button>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-semibold tracking-tighter uppercase text-stone-500 absolute left-1/2 transform -translate-x-1/2 h-full">
            <button onClick={() => navigate('/')} className="hover:text-chill-sage transition cursor-pointer text-white">
              Home
            </button>

            {/* BOOKS DROPDOWN */}
            <div className="relative group h-full flex items-center">
              <button
                onClick={() => navigate('/books')}
                className="flex items-center gap-1 hover:text-chill-sage transition cursor-pointer py-4 text-white"
              >
                Books
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-stone-100 rotate-45"></div>
                <div className="relative bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/booklists'); }}
                    className="w-full text-left px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition text-xs font-bold"
                  >
                    All Books
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/books'); }}
                    className="w-full text-left px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition text-xs font-bold"
                  >
                    Free Books
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/books'); }}
                    className="w-full text-left px-5 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition text-xs font-bold"
                  >
                    Paid Books
                  </button>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/reader')} className="hover:text-chill-sage transition cursor-pointer text-white">Reader</button>
            <button onClick={() => navigate('/')} className="hover:text-chill-sage transition cursor-pointer text-white">About Us</button>
          </div>

          {/* RIGHT-SIDE CONTROLS */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Auth Buttons */}
            {!currentUser && (
              <div className="flex md:hidden items-center gap-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-xs text-white bg-white/10 rounded-full border border-white/10 hover:bg-white/20 transition"
                >
                  Login
                </button>
              </div>
            )}
            
            {/* User Avatar (Desktop) */}
            {currentUser && (
              <div className="hidden md:block relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="relative group cursor-pointer focus:outline-none flex items-center"
                >
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full p-0.5 border transition ${profileMenuOpen ? 'border-stone-900' : 'border-stone-300 hover:border-stone-900'}`}>
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover bg-stone-100"
                    />
                  </div>
                  <div className="absolute top-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full border-2 border-stone-50"></div>
                </button>
                
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-stone-100 mb-1">
                      <p className="font-bold text-stone-800 truncate">
                        {profile?.displayName || currentUser.displayName || 'Reader'}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/profile'); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition flex items-center gap-2"
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => { navigate('/library'); setProfileMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition flex items-center gap-2"
                    >
                      <LibraryIcon size={16} />
                      <span>My Books</span>
                    </button>
                    <div className="h-px bg-stone-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Desktop Auth Buttons */}
            {!currentUser && (
              <div className="hidden md:flex items-center gap-3 lg:gap-4">
                <button onClick={() => navigate('/login')} className="text-white hover:text-stone-900 transition whitespace-nowrap text-sm">Log In</button>
                <button onClick={() => navigate('/signup')} className="bg-stone-900 text-stone-50 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full hover:bg-stone-700 transition shadow-md whitespace-nowrap text-sm">
                  Sign Up
                </button>
              </div>
            )}
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- STACK-BASED BREADCRUMB --- */}
      {breadcrumbStack.length > 1 && (
        <div className="bg-chill-surface py-1 md:py-2 text-xs text-stone-500 border-b border-stone-200">
          <nav className="flex justify-center">
            <div className="inline-flex items-center gap-1 max-w-full md:max-w-4xl overflow-x-auto px-2 md:px-4">
              {breadcrumbStack.map((crumb, idx) => {
                const isLast = idx === breadcrumbStack.length - 1;
                return (
                  <div key={`${crumb.path}-${idx}`} className="flex items-center gap-1">
                    {idx === 0 ? (
                      <button
                        onClick={handleHomeClick}
                        className="flex items-center gap-1 hover:text-stone-800 transition p-1 md:p-1.5 rounded-full hover:bg-stone-200"
                        title="Go Home"
                      >
                        <Home size={10} md:size={12} />
                      </button>
                    ) : (
                      <ChevronRight size={10} md:size={12} className="flex-shrink-0 text-stone-400" />
                    )}
                    {isLast ? (
                      <span className="text-stone-800 capitalize font-medium px-2 md:px-3 py-0.5 bg-stone-200 rounded-full border border-stone-200 shadow-sm whitespace-nowrap">
                        {crumb.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBreadcrumbClick(crumb, idx)}
                        className="hover:text-stone-800 transition capitalize px-2 md:px-3 py-0.5 rounded-full hover:bg-stone-200 border border-transparent hover:border-stone-200 whitespace-nowrap text-xs"
                      >
                        {crumb.name}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;