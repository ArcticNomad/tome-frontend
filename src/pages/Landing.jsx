import React, { useState } from 'react';
import { ShoppingCart, Search, ArrowRight, Instagram, Facebook, Linkedin, Youtube, MoveRight, Star } from 'lucide-react';

// --- Data ---

const heroBooks = [
  { color: 'bg-pink-400', title: 'Essays', height: 'h-64', rotate: '-rotate-3', top: 'top-10' },
  { color: 'bg-yellow-300', title: 'Lifting as we climb', height: 'h-72', rotate: 'rotate-2', top: 'top-0' },
  { color: 'bg-orange-400', title: 'Life Events', height: 'h-60', rotate: '-rotate-1', top: 'top-12' },
  { color: 'bg-blue-400', title: 'Look', height: 'h-56', rotate: 'rotate-0', top: 'top-16' },
  { color: 'bg-pink-300', title: 'Dream House', height: 'h-68', rotate: 'rotate-6', top: 'top-5' },
];

const featuredCategories = [
  { id: 1, title: 'Picture Books', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Fact Books', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Easy to Read', color: 'bg-red-400', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800' },
];

const products = [
  { id: 1, title: 'Majas Lilla Grona', price: 95, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Sa Sover Staden', price: 47, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'En Gomd Varld', price: 87, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Superhjalte Prinsessan', price: 127, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' },
];

const listCategories = [
  'Picture Books',
  'Fact Books',
  'Fantasy & Science Fiction',
  'Humor and Feelgood',
  'Easy To Read',
  'Reference Books',
  'Friendship and Relationships'
];

const authors = [
  { name: 'Alfredo Schleifer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Jaydon Bergson', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
];

// --- Components ---



const Hero = () => (
  <div className="relative bg-stone-50 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pb-20">
    <div className="flex items-end justify-center space-x-2 md:space-x-4">
      {/* B */}
      <span className="text-[10rem] md:text-[18rem] font-black text-stone-900 leading-none">T</span>
      
      {/* Ö (Represented by shapes and books) */}
      <div className="flex flex-col items-center justify-end h-full pb-8 md:pb-14 gap-4">
        <div className="flex gap-4 md:gap-8 mb-2">
           <div className="w-4 h-4 md:w-8 md:h-8 bg-blue-300 rounded-full"></div>
           <div className="w-4 h-4 md:w-8 md:h-8 bg-pink-400 rounded-full"></div>
        </div>
        <div className="w-[100px] md:w-[200px] h-[100px] md:h-[200px] border-[16px] md:border-[32px] border-stone-900 rounded-full"></div>
      </div>

      {/* Spines acting as letters */}
      <div className="flex items-end space-x-1 mx-2 md:mx-4 h-[250px] md:h-[400px] items-end pb-4">
         {heroBooks.map((book, i) => (
             <div key={i} className={`${book.color} ${book.height} w-8 md:w-14 rounded-sm shadow-lg flex flex-col items-center justify-center text-[10px] md:text-xs font-bold text-white writing-vertical border-l border-white/20 transform ${book.rotate} origin-bottom hover:-translate-y-4 transition-transform duration-300 cursor-pointer`}>
                 <span className="rotate-90 whitespace-nowrap">{book.title}</span>
             </div>
         ))}
      </div>

      {/* K */}
      <span className="text-[10rem] md:text-[18rem] font-black text-stone-900 leading-none">E</span>
    </div>
    
    <div className="w-full max-w-4xl h-px bg-stone-200 mt-12"></div>
  </div>
);

const CategoryCards = () => (
  <div className="bg-[#f4f1ea] py-16 px-8 md:px-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {featuredCategories.map((cat) => (
        <div key={cat.id} className="relative group cursor-pointer">
            <div className="bg-white p-8 h-[400px] flex items-center justify-center relative overflow-hidden rounded-sm transition-all hover:shadow-xl border border-stone-100">
                <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-48 h-64 object-cover shadow-2xl transform rotate-[-6deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 ease-out" 
                />
            </div>
            <div className="flex items-center gap-3 mt-4">
                <span className={`w-2 h-2 rounded-full ${cat.color}`}></span>
                <h3 className="text-stone-800 font-bold text-lg uppercase tracking-wider">{cat.title}</h3>
            </div>
        </div>
      ))}
    </div>
  </div>
);

const Mission = () => (
  <div className="bg-stone-50 py-20 px-8 md:px-16 border-t border-stone-200">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
      <h2 className="text-4xl md:text-6xl font-black text-stone-800 uppercase leading-tight max-w-3xl">
        We believe in people until they believe in themselves again.
      </h2>
      <div className="max-w-xs text-stone-500 text-sm leading-relaxed">
        <p className="mb-6">
          Everything we do is designed to rebuild self worth and independence, in order to break free from the cycle of disadvantage.
          With every purchase you make with us, you're helping to change the course of someone's life.
        </p>
        <a href="#" className="text-stone-900 underline text-xs uppercase tracking-widest hover:text-stone-600">See Our Products</a>
      </div>
    </div>
  </div>
);

const ProductGrid = () => (
  <div className="bg-white py-20 px-8 md:px-16">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {products.map((product) => (
        <div key={product.id} className="group cursor-pointer">
          <div className="bg-stone-50 p-8 h-[350px] flex items-center justify-center mb-6 relative rounded-sm group-hover:bg-stone-100 transition-colors border border-stone-100">
             <img 
                src={product.image} 
                alt={product.title} 
                className="w-40 h-56 object-cover shadow-xl transform rotate-6 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-500" 
             />
          </div>
          <div className="text-center">
             <h3 className="text-stone-500 text-sm mb-2">{product.title}</h3>
             <p className="text-stone-900 font-black text-xl">${product.price}</p>
          </div>
        </div>
      ))}
    </div>
    
    {/* Pagination */}
    <div className="flex justify-center items-center gap-8 text-stone-400 font-bold text-2xl uppercase font-mono">
       <MoveRight className="rotate-180 w-8 h-8 cursor-pointer hover:text-stone-800" />
       <span className="text-stone-800">1</span>
       <span className="hover:text-stone-800 cursor-pointer transition">2</span>
       <span className="hover:text-stone-800 cursor-pointer transition">3</span>
       <span className="hover:text-stone-800 cursor-pointer transition">4</span>
       <span className="hover:text-stone-800 cursor-pointer transition">5</span>
       <span>...</span>
       <span className="hover:text-stone-800 cursor-pointer transition">120</span>
       <MoveRight className="w-8 h-8 cursor-pointer hover:text-stone-800" />
    </div>
  </div>
);

const CategoryList = () => {
    const [hoveredIndex, setHoveredIndex] = useState(4); // Default to 'Easy To Read'
  
    return (
      <div className="bg-[#f4f1ea] py-24 px-8 md:px-16 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-4">
           {listCategories.map((cat, index) => (
               <div 
                 key={index}
                 onMouseEnter={() => setHoveredIndex(index)}
                 className="relative w-full max-w-4xl group cursor-pointer"
               >
                   <div className={`text-center transition-all duration-300 ${hoveredIndex === index ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-60'}`}>
                       <h2 className="text-3xl md:text-5xl font-medium text-stone-800">{cat}</h2>
                       {hoveredIndex === index && (
                           <div className="hidden md:flex absolute top-1/2 -left-20 transform -translate-y-1/2 items-center text-stone-400">
                               <MoveRight className="w-12 h-12" />
                           </div>
                       )}
                   </div>
               </div>
           ))}
        </div>
  
        {/* Floating Card Preview */}
        <div className="hidden lg:block absolute top-1/2 right-[15%] transform -translate-y-1/2 rotate-6 pointer-events-none transition-all duration-700 ease-in-out">
            <div className="bg-white p-4 pb-8 w-64 shadow-2xl rotate-[-4deg] border border-stone-100">
                <div className="w-full h-64 bg-blue-50 mb-4 overflow-hidden relative">
                     <img src="https://images.unsplash.com/photo-1621351183012-e2f99720b133?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Preview"/>
                     <div className="absolute top-2 right-2 bg-yellow-300 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">NEW</div>
                </div>
                <h3 className="text-center font-serif text-xl leading-tight mb-2 text-stone-900">Har Kommer Ambulansen</h3>
                <div className="flex justify-center items-center gap-2">
                    <span className="font-bold text-lg text-stone-900">$87</span>
                    <span className="text-stone-400 text-sm line-through">$98</span>
                </div>
            </div>
        </div>
      </div>
    );
  };

const Authors = () => (
  <div className="bg-stone-50 py-20 px-8 md:px-16 border-t border-stone-200">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-black text-stone-800 uppercase leading-tight mb-8">
                Our Authors: <br/> We don't save anyone.
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-md">
                What we do is provide a safe space for women to change the course of their own lives. We believe that through experiences that promote...
                <br/><br/>
                After many years of living in crisis, abuse and complex trauma restoring self-worth is foundational for independence.
            </p>
            <a href="#" className="text-stone-900 underline text-xs uppercase tracking-widest hover:text-stone-600">Here is the How We Do It</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {authors.map((author, i) => (
                <div key={i} className="relative group cursor-pointer overflow-hidden bg-stone-200">
                    <img src={author.image} alt={author.name} className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100 mix-blend-multiply" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-white font-bold tracking-wide drop-shadow-md">{author.name}</span>
                    </div>
                </div>
            ))}
        </div>
     </div>
  </div>
);

const Footer = () => (
    <footer className="bg-[#2c2a26] text-white pt-20 pb-8 px-8 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-20">
            <div>
                <h4 className="font-black uppercase tracking-widest mb-6 text-stone-200">Follow</h4>
                <ul className="space-y-3 text-xs text-stone-400">
                    <li className="hover:text-white cursor-pointer">Facebook</li>
                    <li className="hover:text-white cursor-pointer">Instagram</li>
                    <li className="hover:text-white cursor-pointer">LinkedIn</li>
                    <li className="hover:text-white cursor-pointer">YouTube</li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-black uppercase tracking-widest mb-6 text-stone-200">Customers</h4>
                <ul className="space-y-3 text-xs text-stone-400">
                    <li className="hover:text-white cursor-pointer">Contact Us</li>
                    <li className="hover:text-white cursor-pointer">Customer Service</li>
                    <li className="hover:text-white cursor-pointer">Terms of Service</li>
                    <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                </ul>
            </div>

            <div className="col-span-2 md:col-span-4 lg:col-span-1 flex items-center justify-center lg:justify-start">
                <div className="grid grid-cols-2 gap-1 w-24 h-24">
                     <div className="bg-stone-200 rounded-full w-full h-full"></div>
                     <div className="bg-stone-200 rounded-full w-full h-full"></div>
                     <div className="bg-stone-200 rounded-full w-full h-full"></div>
                     <div className="bg-stone-200 rounded-full w-full h-full"></div>
                </div>
            </div>

            <div>
                <h4 className="font-black uppercase tracking-widest mb-6 text-stone-200">Publisher</h4>
                <ul className="space-y-3 text-xs text-stone-400">
                    <li className="hover:text-white cursor-pointer">About Us</li>
                    <li className="hover:text-white cursor-pointer">Work With Us</li>
                    <li className="hover:text-white cursor-pointer">Manus</li>
                    <li className="hover:text-white cursor-pointer">Coworker</li>
                </ul>
            </div>

            <div>
                <h4 className="font-black uppercase tracking-widest mb-6 text-stone-200">Follow</h4>
                <ul className="space-y-3 text-xs text-stone-400">
                    <li className="hover:text-white cursor-pointer">Good Places</li>
                    <li className="hover:text-white cursor-pointer">Pathways</li>
                    <li className="hover:text-white cursor-pointer">Careers</li>
                    <li className="hover:text-white cursor-pointer">Wholesale</li>
                </ul>
            </div>
        </div>

        <div className="border-t border-stone-700 pt-8 flex flex-col md:flex-row justify-center items-center text-xs text-stone-500">
            <p>© BOOK | 2024. COPYRIGHT</p>
        </div>
    </footer>
);

function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 overflow-x-hidden">
      <Hero />
      <CategoryCards />
      <Mission />
      <ProductGrid />
      <CategoryList />
      <Authors />
      <Footer />
    </div>
  );
}

export default Landing;