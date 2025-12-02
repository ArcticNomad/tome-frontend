import React, { useState } from 'react';
import { Play, Phone, Menu, X, ArrowRight, BookOpen, Star, Users, Truck, ShieldCheck, Coffee, Heart, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/HomePage/Footer';

// --- Internal Footer Component ---


// --- Data from Tome Design (Adapted & Chill-ified) ---

const heroBooks = [
  { color: 'bg-chill-rose', title: 'Fantasy', height: 'h-48 md:h-64', rotate: '-rotate-3', top: 'top-10' }, 
  { color: 'bg-chill-sand', title: 'History', height: 'h-56 md:h-72', rotate: 'rotate-2', top: 'top-0' }, 
  { color: 'bg-chill-terra', title: 'Fiction', height: 'h-44 md:h-60', rotate: '-rotate-1', top: 'top-12' }, 
  { color: 'bg-chill-blue', title: 'Science', height: 'h-40 md:h-56', rotate: 'rotate-0', top: 'top-16' }, 
  { color: 'bg-chill-lavender', title: 'Culture', height: 'h-52 md:h-68', rotate: 'rotate-6', top: 'top-5' }, 
];

const values = [
  { 
    title: "Empowerment", 
    description: "Restoring self-worth is foundational for independence. We believe in the power of stories to rebuild confidence.", 
    icon: Star, 
    color: "bg-chill-sand/10 text-chill-sand", 
    border: "border-chill-sand/20"
  },
  { 
    title: "Community", 
    description: "A safe space for everyone to explore ideas. We curate content that fosters connection and understanding.", 
    icon: Heart, 
    color: "bg-chill-rose/10 text-chill-rose", 
    border: "border-chill-rose/20"
  },
  { 
    title: "Accessibility", 
    description: "Knowledge should be free. We are committed to making literature accessible to readers everywhere.", 
    icon: Globe, 
    color: "bg-chill-blue/10 text-chill-blue", 
    border: "border-chill-blue/20"
  }
];

const authors = [
  { name: 'Alfredo Schleifer', role: 'Contemporary Fiction', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Jaydon Bergson', role: 'Historical Analysis', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full font-sans bg-chill-bg overflow-x-hidden selection:bg-chill-sage selection:text-black text-white">
      
      {/* ===========================================================================
          TOME HERO SECTION (Adapted to Chill Theme)
      =========================================================================== */}
      <section className="relative bg-chill-bg min-h-[80vh] flex flex-col items-center justify-center overflow-hidden pb-12 pt-20 border-b border-white/5">
        <div className="flex items-end justify-center space-x-2 md:space-x-6 scale-75 md:scale-100 transition-transform duration-700">
          {/* T */}
          <span className="text-[8rem] md:text-[16rem] font-black text-white/90 leading-none select-none">T</span>
          
          {/* O (Abstract representation) */}
          <div className="flex flex-col items-center justify-end h-full pb-6 md:pb-12 gap-4">
            <div className="flex gap-4 md:gap-6 mb-2">
               <div className="w-3 h-3 md:w-6 md:h-6 bg-chill-sage rounded-full animate-pulse"></div>
               <div className="w-3 h-3 md:w-6 md:h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>
            <div className="w-[80px] md:w-[160px] h-[80px] md:h-[160px] border-[12px] md:border-[24px] border-white/90 rounded-full"></div>
          </div>

          {/* M (Books as pillars) */}
          <div className="flex items-end space-x-1 mx-2 md:mx-4 h-[200px] md:h-[350px] pb-2">
             {heroBooks.map((book, i) => (
                 <div 
                   key={i} 
                   className={`${book.color} ${book.height} w-6 md:w-12 rounded-sm shadow-xl flex flex-col items-center justify-center text-[10px] font-bold text-black/60 writing-vertical border-l border-white/20 transform ${book.rotate} origin-bottom transition-transform duration-500 hover:-translate-y-2`}
                 >
                     <span className="rotate-90 whitespace-nowrap opacity-0 md:opacity-100 transition-opacity">{book.title}</span>
                 </div>
             ))}
          </div>

          {/* E */}
          <span className="text-[8rem] md:text-[16rem] font-black text-white/90 leading-none select-none">E</span>
        </div>
        
        <div className="mt-12 text-center max-w-lg px-6">
          <p className="text-chill-sage font-bold tracking-[0.2em] text-xs uppercase mb-4">Est. 2024 • Global Library</p>
          <div className="w-px h-16 bg-white/10 mx-auto mb-4"></div>
        </div>
      </section>

      {/* ===========================================================================
          HERO SECTION (Easy Book Split Style - Chill Version)
      =========================================================================== */}
      <section className="relative min-h-screen w-full flex flex-col">
        
        {/* BACKGROUND SPLIT LAYER */}
        <div className="absolute inset-0 flex flex-col lg:flex-row z-0">
          <div className="w-full lg:w-1/2 bg-[#4E6C50] h-[40vh] lg:h-full relative border-r border-white/5">
             <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          </div>
          <div className="w-full lg:w-1/2 bg-chill-surface h-[60vh] lg:h-full relative">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full h-full flex flex-col flex-grow">
          
          {/* NAVBAR */}
        
          {/* HERO GRID */}
          <main className="flex-grow flex flex-col lg:flex-row w-full relative">
             
             {/* CENTERED HEADLINE */}
             <div className="hidden lg:block absolute top-[15%] left-1/2 -translate-x-1/2 z-30 w-full text-center">
                <h1 className="text-[6rem] xl:text-[7rem] font-black text-white/95 leading-[0.9] tracking-tight drop-shadow-xl">
                   EVERY BOOK A<br/>
                   <span className="text-white/95">NEW BEGINNING</span>
                </h1>
             </div>

             {/* LEFT COLUMN */}
             <div className="lg:w-1/2 px-6 lg:px-16 flex flex-col justify-center relative ">
                {/* Timeline Line & Text */}
                <div className="hidden lg:flex flex-col items-center absolute left-16 top-[80%] bottom-3 border px-12 rounded-3xl bg-chill-sand">
                    {/* Text below the icon */}
                    <div className="mt-6 text-center">
                        <h3 className="text-black font-bold text-lg leading-tight tracking-wide">
                            MORE THAN<br/><span className="text-3xl">1,000</span><br/>BOOKS TO<br/>EXPLORE
                        </h3>
                    </div>
                </div>

                {/* Floating Card with Minimalist Illustration */}
               
             </div>

             {/* RIGHT COLUMN */}
             <div className="borderlg:w-1/2 px-6 lg:px-12 relative flex flex-col justify-center pt-8 lg:pt-0">
                <div className="relative z-20 flex flex-col items-center lg:items-start">
                  <h1 className="lg:hidden text-5xl font-black text-white leading-[0.9] mb-8 tracking-tight text-center">
                     EVERY <span className='text-chill-sage' >BOOK</span> A<br/>NEW BEGINNING
                  </h1>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-16 relative lg:mt-[18rem] xl:mt-[20rem]">
                     <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                     </p>
                     <button className="group relative w-28 h-28 flex-shrink-0 bg-chill-sage rounded-full flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-glow-sage z-20">
                        
                           <Link to="/books" className="group relative w-28 h-28 flex-shrink-0 bg-chill-sage rounded-full flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-glow-sage z-20">
                        <span className="font-bold text-black text-[10px] tracking-wider">EXPLORE</span>
                        <span className="font-bold text-black text-[10px] tracking-wider">BOOKS</span>
                        <ArrowRight size={16} className="mt-1 text-black group-hover:translate-x-1 transition-transform" />
                     </Link>
                     </button>
                  </div>
                </div>

                {/* BOOKS ROW */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-12 w-full lg:w-[120%] lg:-ml-[20%] z-10">
                   <div className="aspect-[3/4.5] bg-chill-terra rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border border-white/5">
                      <div className="h-full w-full border-2 border-white/20 rounded flex flex-col justify-between p-2">
                         <p className="text-white font-extrabold text-xl leading-[0.85] mb-2 uppercase italic">Almost<br/>Every-<br/>thing</p>
                         <div className="flex items-end justify-between"><div className="w-8 h-8 rounded-full bg-white/20"></div><p className="text-white text-[8px] font-bold">Scott<br/>Adams</p></div>
                      </div>
                   </div>
                   <div className="aspect-[3/4.5] bg-chill-lavender rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border border-white/5">
                       <div className="h-full w-full flex flex-col items-center pt-2">
                          <div className="text-white text-center font-serif italic leading-tight text-sm mb-2">The<br/>Undomestic<br/>Goddess</div>
                          <div className="w-10 h-14 bg-chill-blue rounded-t-full relative mt-auto mx-auto mb-1"><div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-white rounded-full"></div></div>
                          <p className="text-white text-[7px] uppercase tracking-widest">Sophie Kinsella</p>
                       </div>
                   </div>
                   <div className="aspect-[3/4.5] bg-[#F2F2F2] rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg">
                       <div className="h-full w-full flex flex-col items-center justify-center text-center">
                          <div className="w-6 h-20 bg-gradient-to-b from-chill-terra to-chill-rose rounded-full mb-2 clip-pencil mx-auto transform -rotate-12"></div>
                          <h4 className="text-chill-blue font-serif font-bold text-lg leading-none mb-1">Educated</h4>
                          <p className="text-gray-900 text-[8px] font-bold mt-auto">TARA WESTOVER</p>
                       </div>
                   </div>
                   <div className="aspect-[3/4.5] bg-white rounded-lg relative group hover:-translate-y-2 transition-transform cursor-pointer overflow-hidden shadow-lg">
                       <div className="absolute inset-0 flex flex-col">
                          <div className="h-1/2 flex items-center justify-center"><span className="font-sans font-black text-chill-terra text-3xl tracking-tighter">FACT</span></div>
                          <div className="h-1/2 bg-chill-terra flex items-center justify-center"><span className="font-sans font-black text-white text-3xl tracking-tighter">NESS</span></div>
                       </div>
                   </div>
                </div>
             </div>
          </main>
        </div>
      </section>

      {/* ===========================================================================
          SECTION: MISSION STATEMENT (Adapted from Tome)
      =========================================================================== */}
      <section id="mission" className="bg-chill-surface py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
        <div className="mb-8 md:mb-12">
  <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4">
    I have always imagined that{" "}
    <span className="text-chill-sage underline decoration-wavy decoration-chill-blue/30">
      Paradise
    </span>{" "}
    will be a kind of library.
  </h2>
  <p className="text-gray-400 text-sm font-sans italic">
    — Jorge Luis Borges, <span className="text-chill-blue">The Library of Babel</span>
  </p>
</div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-12 text-left">
            <div className="max-w-sm">
              <div className="w-12 h-1 bg-chill-sage mb-6"></div>
              <p className="text-xl font-serif text-gray-300 leading-relaxed">
                Everything we do is designed to rebuild self worth and independence, in order to break free from the cycle of disadvantage.
              </p>
            </div>
            <div className="max-w-sm text-gray-500 leading-relaxed text-sm">
              <p>
               Tome is an initiative to digitize and democratize access to literature. We bridge the gap between classic literature and modern accessibility, providing a platform where stories are preserved and shared freely.
              </p>
              <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest cursor-pointer hover:text-chill-sage transition-colors">
                <span>Read our Manifesto</span>
                <div className="w-4 h-px bg-chill-sage"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================================
          SECTION: VALUES (Adapted from Tome)
      =========================================================================== */}
      <section className="bg-chill-bg py-32 px-8 md:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <h3 className="text-chill-sage text-xs font-bold uppercase tracking-widest mb-2">Our Core Values</h3>
              <h2 className="text-4xl font-bold text-white">Built on Principle</h2>
            </div>
            <div className="w-full md:w-1/3 h-px bg-white/10 mb-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => (
              <div key={index} className={`bg-chill-card p-10 rounded-xl border ${val.border} hover:-translate-y-2 transition-transform duration-300 group`}>
                <div className={`w-14 h-14 ${val.color} rounded-2xl flex items-center justify-center mb-8`}>
                  <val.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-chill-sage transition-colors">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================================================================
          SECTION: IMPACT STATS (Merged Tome & Easy Book)
      =========================================================================== */}
      <section className="bg-chill-surface text-white py-32 px-8 md:px-16 overflow-hidden relative border-y border-white/5">
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
                    Stories are the <span className="text-chill-sage">architecture</span> of our shared reality.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                    We've built a repository that spans genres, eras, and cultures. From ancient texts to contemporary essays, Easy Book is a living archive.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                <div className="bg-chill-card p-8 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-chill-sage/30 transition-colors">
                    <BookOpen className="w-8 h-8 text-chill-sage mb-4" />
                    <span className="block text-5xl font-black text-white mb-2">1k+</span>
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Books Archived</span>
                </div>
                <div className="bg-chill-card p-8 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-chill-sage/30 transition-colors">
                    <Users className="w-8 h-8 text-chill-sage mb-4" />
                    <span className="block text-5xl font-black text-white mb-2">2</span>
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Active Readers</span>
                </div>
            </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-chill-sage rounded-full mix-blend-overlay opacity-5 filter blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4E6C50] rounded-full mix-blend-overlay opacity-5 filter blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* ===========================================================================
          SECTION: AUTHOR SPOTLIGHT (Adapted from Tome)
      =========================================================================== */}
    

      {/* ===========================================================================
          SECTION: SERVICES (From Easy Book)
      =========================================================================== */}
      <section id="services" className="py-24 bg-chill-surface">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-chill-sage font-bold tracking-widest uppercase mb-4 text-sm">Our Services</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-16">More Than Just a Bookstore</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
                  <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
                     <Truck size={24} className="text-white group-hover:text-black" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Fast Delivery</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Get your favorite books delivered to your doorstep within 24 hours.</p>
               </div>
               <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
                  <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
                     <ShieldCheck size={24} className="text-white group-hover:text-black" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Secure Payment</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">100% secure payment gateways to ensure your transactions are safe.</p>
               </div>
               <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
                  <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
                     <Users size={24} className="text-white group-hover:text-black" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Book Clubs</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Join our exclusive monthly book clubs and discuss your favorite reads.</p>
               </div>
               <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
                  <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
                     <Coffee size={24} className="text-white group-hover:text-black" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Reading Cafe</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Visit our physical locations to enjoy premium coffee while you read.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-chill-surface z-50 flex flex-col items-center justify-center gap-8">
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white"><X size={32}/></button>
           <a href="#" onClick={() => setIsMenuOpen(false)} className="text-chill-sage text-2xl font-bold">Home</a>
           <a href="#mission" onClick={() => setIsMenuOpen(false)} className="text-white text-2xl font-bold">Mission</a>
           <a href="#authors" onClick={() => setIsMenuOpen(false)} className="text-white text-2xl font-bold">Authors</a>
           <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white text-2xl font-bold">Services</a>
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .font-handwriting { font-family: 'Brush Script MT', cursive; }
        .clip-pencil { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;