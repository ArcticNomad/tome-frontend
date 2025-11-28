// src/components/HomePage/StarRating.jsx
import { Star } from 'lucide-react';

const StarRating = ({ rating, reviewCount = 42 }) => {
  return (
    <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          className={i < Math.floor(rating) ? "" : "text-gray-300"}
        />
      ))}
      <span className="text-[10px] text-gray-400 ml-1">({reviewCount})</span>
    </div>
  );
};

export default StarRating;