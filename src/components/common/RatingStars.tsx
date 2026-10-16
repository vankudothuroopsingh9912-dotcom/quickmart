import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onSelectRating?: (rating: number) => void;
  showText?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onSelectRating,
  showText = false,
  reviewCount
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: max }, (_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onSelectRating && onSelectRating(i + 1)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
            >
              <Star
                style={{ width: size, height: size }}
                className={filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'}
              />
            </button>
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-slate-400 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
