import React, { useState, useEffect } from "react";
import type { Recipe } from "../types";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

function SubmittedRecipes() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites(user?.id || null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedRecipes = localStorage.getItem('recipes');
        if (savedRecipes) {
            const allRecipes = JSON.parse(savedRecipes);
            // Sadece 'sizden-gelenler' kategorisindeki tarifleri göster
            setRecipes(allRecipes.filter((recipe: Recipe) => recipe.category === 'sizden-gelenler'));
        }
    }, []);

    const openRecipeModal = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setShowModal(true);
    };

    const handleToggleFavorite = (recipe: Recipe, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(recipe);
    };

    const filteredRecipes = recipes.filter(recipe => {
        return recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        Sizden Gelenler
                    </h1>
                    <p className="text-xl text-gray-600">
                        Topluluğumuzun paylaştığı özel tarifler
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Tarif ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onCardClick={openRecipeModal}
                            showFavoriteButton={true}
                            isFavorite={isFavorite(recipe.id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>

                <RecipeDetailModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    recipe={selectedRecipe}
                />
            </div>
        </div>
    );
}

export default SubmittedRecipes; 