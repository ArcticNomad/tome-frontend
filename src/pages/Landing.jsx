import React, { useState } from 'react';
import { Play, Phone, Menu, X, ArrowRight, BookOpen, Star, Users, Truck, ShieldCheck, Coffee, Heart, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/HomePage/Footer';
import SplitText from '../components/SplitText'; // Import the SplitText component

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
                <span className="whitespace-nowrap opacity-0 md:opacity-100 transition-opacity">{book.title}</span>
              </div>
            ))}
          </div>

          {/* E */}
          <span className="text-[8rem] md:text-[16rem] font-black text-white/90 leading-none select-none">E</span>
        </div>

        <div className="mt-12 text-center max-w-lg px-6">
          <SplitText
            text="Est. 2024 • Global Library"
            className="text-chill-sage font-bold tracking-[0.2em] text-xs uppercase mb-4"
            tag="p"
            delay={50}
            duration={0.8}
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          />
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

          {/* HERO GRID */}
          <main className="flex-grow flex flex-col lg:flex-row w-full relative">

            {/* CENTERED HEADLINE */}
            <div className="hidden lg:block absolute top-[15%] left-1/2 -translate-x-1/2 z-30 w-full text-center">
              <SplitText
                text="EVERY BOOK A"
                className="text-[6rem] xl:text-[7rem] font-black text-white/95 leading-[0.9] tracking-tight drop-shadow-xl block"
                tag="h1"
                delay={20}
                duration={0.6}
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
              />
              <SplitText
                text="NEW BEGINNING"
                className="text-[6rem] xl:text-[7rem] font-black text-white/95 leading-[0.9] tracking-tight drop-shadow-xl block"
                tag="span"
                delay={40}
                duration={0.7}
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.2}
              />
            </div>

            {/* LEFT COLUMN */}
            <div className="lg:w-1/2 px-6 lg:px-16 flex flex-col justify-center relative ">
              {/* Timeline Line & Text */}
              <div className="hidden lg:flex flex-col items-center absolute left-16 top-[80%] bottom-3 border px-12 rounded-3xl bg-chill-sand w-60">
                {/* Text below the icon */}
                <div className="mt-6 text-center">
                  <SplitText
                    text="MORE THAN"
                    tag="h3"
                    className="text-black font-bold text-lg leading-tight tracking-wide"
                    splitType="words"
                    delay={30}
                  />
                  <SplitText
                    text="1,000"
                    tag="span"
                    className="text-3xl text-black font-bold"
                    delay={60}
                    duration={0.8}
                  />
                  <SplitText
                    text="BOOKS TO"
                    tag="h3"
                    className="text-black font-bold text-lg leading-tight tracking-wide"
                    splitType="words"
                    delay={90}
                  />
                  <SplitText
                    text="EXPLORE"
                    tag="h3"
                    className="text-black font-bold text-lg leading-tight tracking-wide"
                    delay={120}
                    duration={1}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="borderlg:w-1/2 px-6 lg:px-12 relative flex flex-col justify-center pt-2 lg:pt-10">
              <div className="relative z-20 flex flex-col items-center ">
                <div className="lg:hidden mb-8 tracking-tight text-center ">
                  <SplitText
                    text="EVERY BOOK A"
                    className="text-5xl font-black text-white leading-[0.9]"
                    tag="h1"
                    delay={20}
                    duration={0.6}
                  />
                  <SplitText
                    text="NEW BEGINNING"
                    className="text-5xl font-black text-chill-sage leading-[0.9]"
                    tag="span"
                    delay={40}
                    duration={0.7}
                  />
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-16 relative lg:mt-[18rem] xl:mt-[20rem]">
                  <SplitText
                    text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    className="text-gray-400 text-sm leading-relaxed max-w-sm"
                    tag="p"
                    splitType="words"
                    delay={10}
                    duration={0.5}
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                  />
                  <Link 
                    to="/books" 
                    className="group relative w-28 h-28 flex-shrink-0 bg-chill-sage rounded-full flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-glow-sage z-20"
                  >
                    <SplitText
                      text="EXPLORE"
                      className="font-bold text-black text-[10px] tracking-wider"
                      tag="span"
                      splitType="chars"
                      delay={5}
                      duration={0.3}
                    />
                    <SplitText
                      text="BOOKS"
                      className="font-bold text-black text-[10px] tracking-wider"
                      tag="span"
                      splitType="chars"
                      delay={5}
                      duration={0.3}
                    />
                    <ArrowRight size={16} className="mt-1 text-black group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* BOOKS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-12 sm-w-90 lg:w-[90%] lg:-ml-[0%] z-10">
                <div className=" bg-chill-terra rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border border-white/5">
                  <div className="h-full w-full border-2 border-white/20 rounded flex flex-col justify-between p-2">
                    <SplitText
                      text="Almost Everything"
                      className="text-white font-extrabold text-xl leading-[0.85] mb-2 uppercase italic"
                      tag="p"
                      splitType="words"
                      delay={20}
                    />
                    <div className="flex items-end justify-between">
                      <div className="w-full h-8 rounded-full bg-white/20"></div>
                      <SplitText
                        text="Scott Adams"
                        className="text-white text-[12px] font-bold"
                        tag="p"
                        splitType="words"
                        delay={40}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="aspect-[3/4.5] bg-chill-lavender rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg border border-white/5">
                  <div className="h-full w-full flex flex-col items-center pt-2">
                    <SplitText
                      text="The Undomestic Goddess"
                      className="text-white text-center font-serif italic leading-tight text-sm mb-2"
                      tag="div"
                      splitType="words"
                      delay={30}
                    />
                    <div className="w-10 h-14 bg-chill-blue rounded-t-full relative mt-auto mx-auto mb-1">
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-white rounded-full"></div>
                    </div>
                    <SplitText
                      text="Sophie Kinsella"
                      className="text-white text-[7px] uppercase tracking-widest"
                      tag="p"
                      splitType="chars"
                      delay={20}
                    />
                  </div>
                </div>
                
                <div className="aspect-[3/4.5] bg-[#F2F2F2] rounded-lg p-3 relative group hover:-translate-y-2 transition-transform cursor-pointer shadow-lg">
                  <div className="h-full w-full flex flex-col items-center justify-center text-center">
                    <div className="w-6 h-20 bg-gradient-to-b from-chill-terra to-chill-rose rounded-full mb-2 clip-pencil mx-auto transform -rotate-12"></div>
                    <SplitText
                      text="Educated"
                      className="text-chill-blue font-serif font-bold text-lg leading-none mb-1"
                      tag="h4"
                      delay={40}
                    />
                    <SplitText
                      text="TARA WESTOVER"
                      className="text-gray-900 text-[8px] font-bold mt-auto"
                      tag="p"
                      splitType="chars"
                      delay={10}
                    />
                  </div>
                </div>
                
                <div className="aspect-[3/4.5] bg-white rounded-lg relative group hover:-translate-y-2 transition-transform cursor-pointer overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/2 flex items-center justify-center">
                      <SplitText
                        text="FACT"
                        className="font-sans font-black text-chill-terra text-3xl tracking-tighter"
                        tag="span"
                        splitType="chars"
                        delay={5}
                      />
                    </div>
                    <div className="h-1/2 bg-chill-terra flex items-center justify-center">
                      <SplitText
                        text="NESS"
                        className="font-sans font-black text-white text-3xl tracking-tighter"
                        tag="span"
                        splitType="chars"
                        delay={10}
                      />
                    </div>
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
  {/* Parent H2 holds the main typography styles and keeps children inline */}
  <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-tight mb-4 flex flex-wrap items-baseline gap-x-[0.3em]">
    
    {/* Part 1: Leading text */}
    <SplitText
      text="I have always imagined that"
      tag="span" // Important: Use span so it stays inline
      splitType="words"
      delay={15}
      duration={0.7}
      threshold={0.1}
    />

    {/* Part 2: The highlighted word "Paradise" */}
    {/* - bg-chill-sage: Sets the background color.
       - px-2 py-1 rounded-md: Adds padding and rounding for a neat highlight look.
       - underline decoration-wavy: Adds the wavy underline.
       - underline-offset-4: Pushes the underline down slightly for better visual separation.
       - mx-1: Adds a tiny bit of horizontal margin so the background doesn't touch surrounding words.
    */}
    <span className="text-chill-sage px-2 py-1 rounded-md mx-1 underline decoration-wavy underline-offset-4 decoration-chill-bg inline-block">
      Paradise
    </span>

    {/* Part 3: Trailing text */}
    <SplitText
      text="will be a kind of library."
      tag="span" // Important: Use span
      splitType="words"
      // Added slightly more delay so it animates after the first part
      delay={20} 
      duration={0.7}
      threshold={0.1}
    />
  </h2>

  {/* Quote Author */}
  <SplitText
    text="— Jorge Luis Borges, The Library of Babel"
    className="text-gray-400 text-sm font-sans italic"
    tag="p"
    splitType="words"
    // Increased delay slightly to follow the main text block
    delay={35} 
  />
</div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-12 text-left">
            <div className="max-w-sm">
              <div className="w-12 h-1 bg-chill-sage mb-6"></div>
              <SplitText
                text="Everything we do is designed to rebuild self worth and independence, in order to break free from the cycle of disadvantage."
                className="text-xl font-serif text-gray-300 leading-relaxed"
                tag="p"
                splitType="words"
                delay={10}
                duration={0.5}
              />
            </div>
            <div className="max-w-sm">
              <SplitText
                text="Tome is an initiative to digitize and democratize access to literature. We bridge the gap between classic literature and modern accessibility, providing a platform where stories are preserved and shared freely."
                className="text-gray-500 leading-relaxed text-sm"
                tag="p"
                splitType="words"
                delay={10}
                duration={0.5}
              />
              <div className="mt-6 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest cursor-pointer hover:text-chill-sage transition-colors">
                <SplitText
                  text="Read our Manifesto"
                  tag="span"
                  splitType="words"
                  delay={5}
                  duration={0.4}
                />
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
        <div className="max-w-7xl mx-auto flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className='flex flex-col items-start'>
              <SplitText
                text="Our Core Values"
                className="text-chill-sage text-xs font-bold uppercase tracking-widest mb-2"
                tag="h3"
                splitType="words"
                delay={10}
              />
              <SplitText
                text="Built on Principle"
                className="text-4xl font-bold text-white"
                tag="h2"
                splitType="words"
                delay={20}
                duration={0.6}
              />
            </div>
            <div className="w-full md:w-1/3 h-px bg-white/10 mb-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, index) => (
              <div key={index} className={`bg-chill-card p-10 rounded-xl border ${val.border} hover:-translate-y-2 transition-transform duration-300 group`}>
                <div className={`w-14 h-14 ${val.color} rounded-2xl flex items-center justify-center mb-8`}>
                  <val.icon size={28} />
                </div>
                <SplitText
                  text={val.title}
                  className="text-xl font-bold text-white mb-4 group-hover:text-chill-sage transition-colors"
                  tag="h3"
                  delay={index * 20}
                  duration={0.6}
                />
                <SplitText
                  text={val.description}
                  className="text-gray-400 leading-relaxed"
                  tag="p"
                  splitType="words"
                  delay={index * 10 + 30}
                  duration={0.5}
                />
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
        <SplitText
          text="Stories are the "
          tag="span"
          splitType="words"
          delay={15}
          duration={0.7}
        />
        <span className="text-chill-sage">
          <SplitText
            text="architecture"
            tag="span"
            splitType="chars"
            delay={25}
            duration={0.8}
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
        </span>
        <SplitText
          text=" of our shared reality."
          tag="span"
          splitType="words"
          delay={35}
          duration={0.7}
        />
      </h2>
      <SplitText
        text="We've built a repository that spans genres, eras, and cultures. From ancient texts to contemporary essays, Tome is a living archive."
        className="text-gray-400 text-lg leading-relaxed max-w-md"
        tag="p"
        splitType="words"
        delay={30}
        duration={0.5}
      />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="bg-chill-card p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-chill-sage/30 transition-colors group hover:-translate-y-1">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-10 h-10 text-chill-sage" />
        </div>
        <SplitText
          text="1k+"
          className="block text-5xl md:text-6xl font-black text-white mb-2 text-center"
          tag="span"
          splitType="chars"
          delay={10}
          duration={0.8}
        />
        <SplitText
          text="Books Archived"
          className="text-gray-400 uppercase tracking-widest text-xs font-medium text-center block"
          tag="span"
          splitType="words"
          delay={20}
        />
      </div>
      <div className="bg-chill-card p-6 rounded-2xl border border-white/5 backdrop-blur-sm hover:border-chill-sage/30 transition-colors group hover:-translate-y-1">
        <div className="flex items-center justify-center mb-4">
          <Users className="w-10 h-10 text-chill-sage" />
        </div>
        <SplitText
          text="2"
          className="block text-5xl md:text-6xl font-black text-white mb-2 text-center"
          tag="span"
          delay={10}
          duration={0.8}
        />
        <SplitText
          text="Active Readers"
          className="text-gray-400 uppercase tracking-widest text-xs font-medium text-center block"
          tag="span"
          splitType="words"
          delay={20}
        />
      </div>
    </div>
  </div>

  {/* Decorative Background Elements */}
  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-chill-sage rounded-full mix-blend-overlay opacity-5 filter blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4E6C50] rounded-full mix-blend-overlay opacity-5 filter blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
</section>
      {/* ===========================================================================
          SECTION: SERVICES (From Easy Book)
      =========================================================================== */}
     <section id="services" className="py-24 bg-chill-surface">
  <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
    {/* Headings Section - Centered */}
    <div className="text-center mb-16 flex flex-col items-center">

      <SplitText
        text="More Than Just a Bookstore"
        className="text-4xl lg:text-5xl font-bold text-white mb-7"
        tag="h3"
        splitType="words"
        delay={20}
        duration={0.7}
      />
      <SplitText
        text="Our Services"
        className="text-chill-sage font-bold tracking-widest uppercase mb-4 text-sm"
        tag="h2"
        splitType="words"
        delay={10}
      />
  
      {/* Optional decorative line */}
      <div className="w-24 h-1 bg-chill-sage mx-auto mt-6 rounded-full"></div>
    </div>

    {/* Services Grid - Normal layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
        <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
          <Truck size={24} className="text-white group-hover:text-black" />
        </div>
        <SplitText
          text="Fast Delivery"
          className="text-xl font-bold text-white mb-3 text-center"
          tag="h4"
          delay={10}
          duration={0.6}
        />
        <SplitText
          text="Get your favorite books delivered to your doorstep within 24 hours."
          className="text-gray-400 text-sm leading-relaxed text-center"
          tag="p"
          splitType="words"
          delay={20}
          duration={0.5}
        />
      </div>
      
      <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
        <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
          <ShieldCheck size={24} className="text-white group-hover:text-black" />
        </div>
        <SplitText
          text="Secure Payment"
          className="text-xl font-bold text-white mb-3 text-center"
          tag="h4"
          delay={20}
          duration={0.6}
        />
        <SplitText
          text="100% secure payment gateways to ensure your transactions are safe."
          className="text-gray-400 text-sm leading-relaxed text-center"
          tag="p"
          splitType="words"
          delay={30}
          duration={0.5}
        />
      </div>
      
      <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
        <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
          <Users size={24} className="text-white group-hover:text-black" />
        </div>
        <div>
          
        </div>
        <SplitText
          text="Book Clubs"
          className="text-xl font-bold text-white mb-3 text-center"
          tag="h4"
          delay={30}
          duration={0.6}
        />
        <SplitText
          text="Join our exclusive monthly book clubs and discuss your favorite reads."
          className="text-gray-400 text-sm leading-relaxed text-center"
          tag="p"
          splitType="words"
          delay={40}
          duration={0.5}
        />
      </div>
      
      <div className="bg-chill-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5 group hover:border-chill-sage/20">
        <div className="w-14 h-14 bg-chill-highlight rounded-full flex items-center justify-center mb-6 group-hover:bg-chill-sage transition-colors duration-300 mx-auto">
          <Coffee size={24} className="text-white group-hover:text-black" />
        </div>
        <SplitText
          text="Reading Cafe"
          className="text-xl font-bold text-white mb-3 text-center"
          tag="h4"
          delay={40}
          duration={0.6}
        />
        <SplitText
          text="Visit our physical locations to enjoy premium coffee while you read."
          className="text-gray-400 text-sm leading-relaxed text-center"
          tag="p"
          splitType="words"
          delay={50}
          duration={0.5}
        />
      </div>
    </div>

    {/* Optional CTA at bottom */}
    <div className="text-center mt-16 flex flex-col items-center">
      <SplitText
        text="Join our community of readers and discover more."
        className="text-gray-400 mb-6"
        tag="p"
        splitType="words"
        delay={60}
      />
      <Link 
        to="/signup" 
        className="inline-flex items-center gap-2 bg-chill-sage text-black px-8 py-3 rounded-full font-medium hover:bg-chill-sage/90 transition-colors"
      >
        <span>Get Started</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</section>
      {/* Footer */}
      <Footer />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-chill-surface z-50 flex flex-col items-center justify-center gap-8">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-white"><X size={32} /></button>
          <SplitText text="Home" className="text-chill-sage text-2xl font-bold" tag="a" href="#" onClick={() => setIsMenuOpen(false)} />
          <SplitText text="Mission" className="text-white text-2xl font-bold" tag="a" href="#mission" onClick={() => setIsMenuOpen(false)} />
          <SplitText text="Authors" className="text-white text-2xl font-bold" tag="a" href="#authors" onClick={() => setIsMenuOpen(false)} />
          <SplitText text="Services" className="text-white text-2xl font-bold" tag="a" href="#services" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        .font-handwriting { font-family: 'Brush Script MT', cursive; }
        .clip-pencil { clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); }
        html { scroll-behavior: smooth; }
        .shadow-glow-sage {
          box-shadow: 0 0 20px rgba(212, 224, 155, 0.3), 0 0 40px rgba(212, 224, 155, 0.2), 0 0 60px rgba(212, 224, 155, 0.1);
        }
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};

export default App;