import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Home, LogOut, User, Library as LibraryIcon } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [breadcrumbStack, setBreadcrumbStack] = useState([{ name: 'Home', path: '/' }]);
  
  const { currentUser, logout } = useAuth();
  const { profile } = useUserProfile(); // Fetch profile data for the avatar
  
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

    if (pathname === '/') return 'Home';
    if (pathname === '/books') return 'Books';
    if (pathname === '/booklists') return category || 'Books';
    if (pathname === '/tags') return 'Tags';
    if (pathname === '/reader') return 'Reader';
    if (pathname === '/library') return 'Library';
    if (pathname === '/login') return 'Login';
    if (pathname === '/signup') return 'Sign Up';
    
    return pathname.split('/').pop().replace(/-/g, ' ');
  };

  // Manage breadcrumb stack
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    const displayName = getDisplayName(location.pathname, location.search);

    // Check if we're going back in the stack
    const existingIndex = breadcrumbStack.findIndex(crumb => 
      crumb.path === currentPath
    );

    if (existingIndex !== -1) {
      // Going back - truncate the stack
      setBreadcrumbStack(prev => prev.slice(0, existingIndex + 1));
    } else {
      // Going forward - push to stack
      const newCrumb = {
        name: displayName,
        path: currentPath
      };

      setBreadcrumbStack(prev => {
        // Don't add if it's the same as the last item
        if (prev.length > 0 && prev[prev.length - 1].path === currentPath) {
          return prev;
        }
        return [...prev, newCrumb];
      });
    }
  }, [location]);

  const handleBreadcrumbClick = (crumb, index) => {
    // Navigate to the clicked breadcrumb
    navigate(crumb.path);
    
    // Truncate stack to this point
    setBreadcrumbStack(prev => prev.slice(0, index + 1));
  };

  const handleHomeClick = () => {
    navigate('/');
    setBreadcrumbStack([{ name: 'Home', path: '/' }]);
  };

  const handleLogout = async () => {
    try {
      setProfileMenuOpen(false);
      await logout();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Determine the avatar URL: Database Profile -> Firebase Auth -> Dicebear Fallback
  const avatarUrl = profile?.personalDetails?.profilePicture || 
                    currentUser?.photoURL || 
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid || 'guest'}`;

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="relative py-5 px-8 md:px-16 text-stone-800 bg-stone-50 border-b border-stone-200 sticky top-0 z-50 overflow-visible">
        <SearchBar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

        <div className={`flex justify-between items-center w-full transition-all duration-300 ease-out ${searchOpen ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}`}>
          {/* LOGO */}
          <button onClick={handleHomeClick} className="text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition">
            <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
              <div className="bg-stone-900 rounded-full w-full h-full"></div>
              <div className="bg-stone-900 rounded-full w-full h-full"></div>
              <div className="bg-stone-900 rounded-full w-full h-full"></div>
              <div className="bg-stone-900 rounded-full w-full h-full"></div>
            </div>
            <span>TOME</span>
          </button>

          {/* LINKS */}
          <div className="hidden md:flex space-x-6 text-xs tracking-widest uppercase font-medium text-stone-500 absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => navigate('/books')} className="hover:text-stone-900 transition">Books</button>
            <button onClick={() => navigate('/tags')} className="hover:text-stone-900 transition">Tags</button>
            <button onClick={() => navigate('/reader')} className="hover:text-stone-900 transition">Reader</button>
          </div>

          {/* SEARCH + LOGIN/PROFILE */}
          <div className="flex items-center space-x-4 md:space-x-6 text-xs font-medium">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1 hover:text-stone-500 cursor-pointer"
            >
              <Search size={18} />
              <span className="hidden lg:inline">Search</span>
            </button>

            <div className="h-4 w-px bg-stone-300 hidden md:block"></div>

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

                {/* DROPDOWN MENU */}
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
        <div className="bg-stone-50 py-2 text-sm text-stone-500 border-b border-stone-200">
          <nav className="flex justify-center">
            <div className="inline-flex items-center gap-1 max-w-4xl overflow-x-auto px-4">
              {breadcrumbStack.map((crumb, idx) => {
                const isLast = idx === breadcrumbStack.length - 1;
                
                return (
                  <div key={`${crumb.path}-${idx}`} className="flex items-center gap-1">
                    {idx === 0 ? (
                      <button
                        onClick={handleHomeClick}
                        className="flex items-center gap-1 hover:text-stone-800 transition p-1 rounded"
                        title="Go Home"
                      >
                        <Home size={14} />
                      </button>
                    ) : (
                      <ChevronRight size={14} className="flex-shrink-0" />
                    )}
                    
                    {isLast ? (
                      <span className="text-stone-800 capitalize font-medium px-2 py-1 bg-stone-100 rounded">
                        {crumb.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBreadcrumbClick(crumb, idx)}
                        className="hover:text-stone-800 transition capitalize px-2 py-1 rounded hover:bg-stone-100 whitespace-nowrap"
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