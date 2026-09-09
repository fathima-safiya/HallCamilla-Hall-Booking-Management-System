import { useState, useEffect, useCallback } from 'react';
import { favoriteService, type Favorite } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const unsubscribe = favoriteService.subscribeToFavorites(user.uid, (favs) => {
      setFavorites(favs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const isFavorite = useCallback(
    (hallId: string) => favorites.some(f => f.hallId === hallId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (hallId: string): Promise<'added' | 'removed' | 'unauthenticated'> => {
      if (!user?.uid) return 'unauthenticated';
      if (isFavorite(hallId)) {
        await favoriteService.removeFavorite(user.uid, hallId);
        return 'removed';
      } else {
        await favoriteService.addFavorite(user.uid, hallId);
        return 'added';
      }
    },
    [user?.uid, isFavorite]
  );

  return { favorites, loading, isFavorite, toggleFavorite };
}
