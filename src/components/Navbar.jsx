import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Home, LogOut, User, Library as LibraryIcon, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';


const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [breadcrumbStack, setBreadcrumbStack] = useState([{ name: 'Home', path: '/' }]);
  
  const { currentUser, logout } = useAuth();
  const { profile } = useUserProfile();
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    // Handle Book Details route
    if (pathname.startsWith('/book/')) return 'Book Details';
    
    if (pathname === '/tags') return 'Tags';
    if (pathname === '/reader') return 'Reader';
    if (pathname === '/library') return 'Library';
    if (pathname === '/login') return 'Login';
    if (pathname === '/signup') return 'Sign Up';
    if (pathname === '/profile') return 'Profile';
    
    // Fallback: capitalize the last part of the url
    const name = pathname.split('/').pop().replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Manage breadcrumb stack
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const displayName = getDisplayName(location.pathname, location.search);

    // 1. Reset if at Home
    if (location.pathname === '/') {
      setBreadcrumbStack([{ name: 'Home', path: '/' }]);
      return;
    }

    // 2. Identify "Top Level" pages that should reset the branch
    // These pages start a new history chain from Home
    const topLevelPaths = ['/books', '/booklists', '/reader', '/tags', '/library', '/profile', '/login', '/signup'];
    // Check if current path is exactly one of the top levels (ignoring query params for the check)
    const isTopLevel = topLevelPaths.includes(location.pathname);

    if (isTopLevel) {
      setBreadcrumbStack([
        { name: 'Home', path: '/' },
        { name: displayName, path: currentPath }
      ]);
      return;
    }

    // 3. Handle Deep Navigation (History Stack)
    const existingIndex = breadcrumbStack.findIndex(crumb => crumb.path === currentPath);

    if (existingIndex !== -1) {
      // User clicked "Back" or a Breadcrumb: Truncate stack to that point
      setBreadcrumbStack(prev => prev.slice(0, existingIndex + 1));
    } else {
      // User went deeper: Push to stack
      setBreadcrumbStack(prev => {
        // Prevent duplicate push if logic fires twice
        if (prev.length > 0 && prev[prev.length - 1].path === currentPath) return prev;
        return [...prev, { name: displayName, path: currentPath }];
      });
    }
  }, [location]); // Depend on location changes

  const handleBreadcrumbClick = (crumb, index) => {
    navigate(crumb.path);
    // State update happens in useEffect
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

  const avatarUrl = profile?.personalDetails?.profilePicture ||
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || 'guest'}`;

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="relative py-3 px-8 md:px-16 text-stone-800 bg-chill-surface sticky top-0 z-50 overflow-visible">
        

        <div className={`flex justify-between items-center w-full transition-all duration-300 ease-out ${searchOpen ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}`}>
          {/* LOGO */}
          <button onClick={handleHomeClick} className="text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition">
            <div className="h-12">
              <img src="./booklogo.png" alt="" className='w-full h-full'/>
            </div>
            <span className='text-white'>TOME</span>
          </button>

          {/* LINKS - CENTERED */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold tracking-tighter uppercase text-stone-500 absolute left-1/2 transform -translate-x-1/2 h-full">
            
            {/* HOME (Standard Link) */}
            <button onClick={() => navigate('/')} className="hover:text-chill-sage transition cursor-pointer">
              Home
            </button>

            {/* BOOKS DROPDOWN */}
            <div className="relative group h-full flex items-center">
              <button
                onClick={() => navigate('/books')}
                className="flex items-center gap-1 hover:text-chill-sage transition cursor-pointer py-4"
              >
                Books
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Hover Dropdown Content */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                {/* Triangle Tip */}
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

            <button onClick={() => navigate('/reader')} className="hover:text-chill-sage transition cursor-pointer">Reader</button>
            <button onClick={() => navigate('/')} className="hover:text-chill-sage transition cursor-pointer">About Us</button>
          </div>

          {/* SEARCH + LOGIN/PROFILE */}
          <div className="flex items-center space-x-4 md:space-x-6 text-xs font-medium">
            
          

           

            {currentUser ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="relative group cursor-pointer focus:outline-none flex items-center"
                >
                  <div className={`w-9 h-9 rounded-full p-0.5 border transition ${profileMenuOpen ? 'border-stone-900' : 'border-stone-300 hover:border-stone-900'}`}>
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover bg-stone-100"
                    />
                  </div>
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-stone-50"></div>
                </button>
                
                {/* PROFILE DROPDOWN MENU */}
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
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/login')} className="text-stone-600 hover:text-stone-900 transition whitespace-nowrap">Log In</button>
                <button onClick={() => navigate('/signup')} className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-full hover:bg-stone-700 transition shadow-md whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- STACK-BASED BREADCRUMB --- */}
      {breadcrumbStack.length > 1 && (
        <div className="bg-chill-surface py-2 text-xs text-stone-500 border-b border-stone-200">
          <nav className="flex justify-center">
            <div className="inline-flex items-center gap-1 max-w-4xl overflow-x-auto px-4">
              {breadcrumbStack.map((crumb, idx) => {
                const isLast = idx === breadcrumbStack.length - 1;
                return (
                  <div key={`${crumb.path}-${idx}`} className="flex items-center gap-1">
                    {idx === 0 ? (
                      <button
                        onClick={handleHomeClick}
                        className="flex items-center gap-1 hover:text-stone-800 transition p-1.5 rounded-full hover:bg-stone-200"
                        title="Go Home"
                      >
                        <Home size={12} />
                      </button>
                    ) : (
                      <ChevronRight size={12} className="flex-shrink-0 text-stone-400" />
                    )}
                    {isLast ? (
                      <span className="text-stone-800 capitalize font-medium px-3 py-0.5 bg-stone-200 rounded-full border border-stone-200 shadow-sm">
                        {crumb.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBreadcrumbClick(crumb, idx)}
                        className="hover:text-stone-800 transition capitalize px-3 py-0.5 rounded-full hover:bg-stone-200 border border-transparent hover:border-stone-200 whitespace-nowrap"
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