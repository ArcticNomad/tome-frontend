

// src/components/Footer.jsx
import React from 'react';
import { Facebook, Twitter, Instagram, Github, Mail } from 'lucide-react';

const Footer = () => {


  return (
    <footer className="mt-12 pt-8 border-t border-gray-100 bg-stone-100 px-4 md:px-8 lg:px-16 rounded-3xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Column 1: Brand & Bio */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Tome</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your personal library tracker. Discover new worlds, track your reading journey, and join a community of book lovers.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Discover</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-purple-600 transition-colors">Trending Now</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">New Releases</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Authors</a></li>
          </ul>
        </div>

        {/* Column 3: Community */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Community</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-purple-600 transition-colors">Discussions</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Book Clubs</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Gift Ideas</a></li>
            <li><a href="#" className="hover:text-purple-600 transition-colors">Student Discount</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 className="font-bold text-gray-800 mb-4">Stay Updated</h4>
          <p className="text-xs text-gray-500 mb-3">Join 50,000+ readers getting our weekly digest.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-gray-100 text-sm px-3 py-2 rounded-l-lg outline-none w-full focus:bg-gray-50 transition-colors"
            />
            <button className="bg-gray-800 text-white px-3 py-2 rounded-r-lg hover:bg-purple-600 transition-colors">
              <Mail size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-4 md:mb-0">
          © {new Date().getFullYear()} Tome Inc. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all">
            <Twitter size={18} />
          </a>
          <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-pink-600 hover:bg-pink-50 transition-all">
            <Instagram size={18} />
          </a>
          <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <Facebook size={18} />
          </a>
          <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
            <Github size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;