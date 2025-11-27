// src/data.js

export const currentUser = {
  name: "Alex Johnson",
  avatar: "https://i.pravatar.cc/150?img=12",
  booksRead: 142,
  currentlyReading: "The Pragmatic Programmer",
};

export const tags = ["All", "Fiction", "Sci-Fi", "Thriller", "Romance", "History", "Design"];

// Helper to get random images for demo purposes
const getCover = (id) => `https://picsum.photos/seed/${id}/300/450`;

export const bentoBooks = [
  { id: 101, title: "Dune", author: "Frank Herbert", cover: getCover('dune'), featured: true },
  { id: 102, title: "Project Hail Mary", author: "Andy Weir", cover: getCover('phm') },
  { id: 103, title: "Atomic Habits", author: "James Clear", cover: getCover('atomic') },
  { id: 104, title: "The Midnight Library", author: "Matt Haig", cover: getCover('midnight') },
  { id: 105, title: "Sapiens", author: "Yuval Noah Harari", cover: getCover('sapiens') },
];

export const standardBooks = [
  { id: 1, title: "Carrie's War", author: "Nina Bawden", cover: "https://media.istockphoto.com/id/636379014/photo/hands-forming-a-heart-shape-with-sunset-silhouette.jpg?s=612x612&w=0&k=20&c=CgjWWGEasjgwia2VT7ufXa10azba2HXmUDe96wZG8F0=" },
  { id: 2, title: "Gone with the Wind", author: "Margaret Mitchell", cover: "https://m.media-amazon.com/images/I/71q02cQc31L._AC_UF1000,1000_QL80_.jpg" },
  { id: 3, title: "Futurama", author: "Matt Groening", cover: "https://m.media-amazon.com/images/I/81F+-jLwVZL._AC_UF1000,1000_QL80_.jpg" },
  { id: 4, title: "Embodied Hope", author: "Kelly M. Kapic", cover: "https://m.media-amazon.com/images/I/61T9yS2P+AL._AC_UF1000,1000_QL80_.jpg" },
  { id: 5, title: "Slay Bells", author: "Jo Nesbo", cover: "https://m.media-amazon.com/images/I/81aY1+2C0-L._AC_UF1000,1000_QL80_.jpg" },
  { id: 6, title: "Dark Tomorrow", author: "Jeremiah Franklin", cover: "https://m.media-amazon.com/images/I/61P6G6J6+OL._AC_UF1000,1000_QL80_.jpg" },
  { id: 7, title: "The Old Orchard", author: "H.G. Wells", cover: "https://m.media-amazon.com/images/I/71W1Y9XW5EL._AC_UF1000,1000_QL80_.jpg" },
  { id: 8, title: "Pink House", author: "Rebecca Curtis", cover: "https://m.media-amazon.com/images/I/61X6+C9C+OL._AC_UF1000,1000_QL80_.jpg" },
];

// src/data.js (Add these new exports)

export const forYouBooks = [
  { id: 201, title: "The Design of Everyday Things", author: "Don Norman", cover: "https://m.media-amazon.com/images/I/611KpV79V1L._AC_UF1000,1000_QL80_.jpg", rating: 4.8 },
  { id: 202, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", cover: "https://m.media-amazon.com/images/I/61fdrEuPJwL._AC_UF1000,1000_QL80_.jpg", rating: 4.6 },
  { id: 203, title: "Deep Work", author: "Cal Newport", cover: "https://m.media-amazon.com/images/I/81q6T9rF-bL._AC_UF1000,1000_QL80_.jpg", rating: 4.7 },
  { id: 204, title: "Show Your Work!", author: "Austin Kleon", cover: "https://m.media-amazon.com/images/I/715drXQHwLL._AC_UF1000,1000_QL80_.jpg", rating: 4.5 },
  { id: 205, title: "Steal Like an Artist", author: "Austin Kleon", cover: "https://m.media-amazon.com/images/I/81C1p14t+EL._AC_UF1000,1000_QL80_.jpg", rating: 4.8 },
];

export const genreCollections = {
  "Fiction": [
    { id: 301, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" },
    { id: 302, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg" },
    { id: 303, title: "1984", author: "George Orwell", cover: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg" },
    { id: 304, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://m.media-amazon.com/images/I/71Q1tPupLFL._AC_UF1000,1000_QL80_.jpg" },
     { id: 301, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" },
    { id: 302, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg" },
 { id: 301, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" },
    { id: 302, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg" },
 { id: 301, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg" },
    { id: 302, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://m.media-amazon.com/images/I/81gepf1eMqL._AC_UF1000,1000_QL80_.jpg" },

  ],
  "Sci-Fi": [
    { id: 401, title: "Dune", author: "Frank Herbert", cover: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg" },
    { id: 402, title: "Neuromancer", author: "William Gibson", cover: "https://m.media-amazon.com/images/I/91Bx5ilP+EL._AC_UF1000,1000_QL80_.jpg" },
    { id: 403, title: "Foundation", author: "Isaac Asimov", cover: "https://m.media-amazon.com/images/I/81i7d+2dCLL._AC_UF1000,1000_QL80_.jpg" },
    { id: 404, title: "Snow Crash", author: "Neal Stephenson", cover: "https://m.media-amazon.com/images/I/81XSN3hA5gL._AC_UF1000,1000_QL80_.jpg" },
  ],
  "Thriller": [
    { id: 501, title: "The Silent Patient", author: "Alex Michaelides", cover: "https://m.media-amazon.com/images/I/81JJPDN854L._AC_UF1000,1000_QL80_.jpg" },
    { id: 502, title: "Gone Girl", author: "Gillian Flynn", cover: "https://m.media-amazon.com/images/I/81Q1+9-z+eL._AC_UF1000,1000_QL80_.jpg" },
    { id: 503, title: "The Da Vinci Code", author: "Dan Brown", cover: "https://m.media-amazon.com/images/I/815WkPKAxLL._AC_UF1000,1000_QL80_.jpg" },
  ]
};

// src/data.js

// ... existing exports ...

export const bestFiction = [
  { id: 601, title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", rating: 4.9 },
  { id: 602, title: "Life of Pi", author: "Yann Martel", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800", rating: 4.7 },
  { id: 603, title: "The Kite Runner", author: "Khaled Hosseini", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800", rating: 4.8 },
  { id: 604, title: "Beloved", author: "Toni Morrison", cover: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=800", rating: 4.6 },
  { id: 601, title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", rating: 4.9 },
  { id: 602, title: "Life of Pi", author: "Yann Martel", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800", rating: 4.7 },
  { id: 603, title: "The Kite Runner", author: "Khaled Hosseini", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800", rating: 4.8 },
  { id: 601, title: "The Alchemist", author: "Paulo Coelho", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800", rating: 4.9 },
  { id: 602, title: "Life of Pi", author: "Yann Martel", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800", rating: 4.7 },
  { id: 603, title: "The Kite Runner", author: "Khaled Hosseini", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800", rating: 4.8 },
];

export const bestHistory = [
  { id: 701, title: "The Silk Roads", author: "Peter Frankopan", cover: "https://images.unsplash.com/photo-1507842217121-9d20422d3387?auto=format&fit=crop&q=80&w=800", rating: 4.8 },
  { id: 702, title: "Guns, Germs, and Steel", author: "Jared Diamond", cover: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800", rating: 4.5 },
  { id: 703, title: "Sapiens", author: "Yuval Noah Harari", cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", rating: 4.9 },
  { id: 704, title: "1776", author: "David McCullough", cover: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800", rating: 4.7 },
  { id: 705, title: "The Guns of August", author: "Barbara Tuchman", cover: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800", rating: 4.6 },
];