import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface FavoriteButtonProps {
  hallId: string;
  /** 'overlay' = white heart on dark background (for image overlays), 'card' = styled button (for cards) */
  variant?: 'overlay' | 'card';
  className?: string;
}

export default function FavoriteButton({ hallId, variant = 'overlay', className = '' }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const saved = isFavorite(hallId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please log in to save favourite halls.');
      navigate('/login');
      return;
    }

    const result = await toggleFavorite(hallId);
    if (result === 'added') {
      showToast('❤️ Added to your Wishlist.');
    } else if (result === 'removed') {
      showToast('Removed from your Wishlist.');
    }
  };

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 text-xs font-bold uppercase tracking-wider ${
          saved
            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
            : 'bg-white border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-400'
        } ${className}`}
      >
        <Heart
          size={14}
          className={`transition-all duration-300 ${saved ? 'fill-red-500 text-red-500 scale-110' : ''}`}
        />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  // overlay variant — for image/hero overlays
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`group flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${
        saved
          ? 'bg-red-500 border-red-400 hover:bg-red-600'
          : 'bg-white/20 border-white/30 hover:bg-white/40'
      } ${className}`}
    >
      <Heart
        size={18}
        className={`transition-all duration-300 ${
          saved
            ? 'fill-white text-white scale-110'
            : 'text-white group-hover:scale-110'
        }`}
      />
    </button>
  );
}
