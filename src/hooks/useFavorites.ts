import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';

export const useFavorites = (userId: string | null) => {
    const navigate = useNavigate();
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

    const getFavoritesFromStorage = useCallback(() => {
        if (!userId) return [];
        const savedFavorites = localStorage.getItem('favorites');
        if (!savedFavorites) return [];

        const allFavorites = JSON.parse(savedFavorites);
        return allFavorites.filter((fav: { userId: string }) => fav.userId === userId);
    }, [userId]);

    useEffect(() => {
        const userFavorites = getFavoritesFromStorage();
        const ids = userFavorites.map((fav: { recipe: Recipe }) => fav.recipe.id);
        setFavoriteIds(new Set(ids));
    }, [userId, getFavoritesFromStorage]);

    const toggleFavorite = (recipe: Recipe) => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const allFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isCurrentlyFavorite = allFavorites.some(
            (fav: { userId: string, recipe: Recipe }) =>
                fav.userId === userId && fav.recipe.id === recipe.id
        );

        let updatedFavorites;
        if (isCurrentlyFavorite) {
            updatedFavorites = allFavorites.filter(
                (fav: { userId: string, recipe: Recipe }) =>
                    !(fav.userId === userId && fav.recipe.id === recipe.id)
            );
        } else {
            updatedFavorites = [...allFavorites, { userId, recipe }];
        }

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

        // Update the state
        const newFavoriteIds = new Set(favoriteIds);
        if (isCurrentlyFavorite) {
            newFavoriteIds.delete(recipe.id);
        } else {
            newFavoriteIds.add(recipe.id);
        }
        setFavoriteIds(newFavoriteIds);
    };

    const isFavorite = (recipeId: number) => {
        return favoriteIds.has(recipeId);
    };

    return { toggleFavorite, isFavorite, favoriteIds };
}; 