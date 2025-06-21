import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Recipe } from "../types";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';
import { sampleRecipes } from "../data/sampleRecipes"; // Örnek tarifleri import et

function Favorites() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite, favoriteIds } = useFavorites(user?.id || null);

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Kullanıcının eklediği ve sistemdeki örnek tarifleri birleştir
        const savedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        const combinedRecipes = [...savedRecipes, ...sampleRecipes];
        setAllRecipes(combinedRecipes);
    }, []);

    useEffect(() => {
        // Favori ID'leri değiştiğinde, gösterilecek favori tarif listesini güncelle
        const userFavorites = allRecipes.filter(recipe => favoriteIds.has(recipe.id));
        setFavoriteRecipes(userFavorites);
    }, [favoriteIds, allRecipes]);


    const openRecipeModal = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setShowModal(true);
    };

    const handleToggleFavorite = (recipe: Recipe, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(recipe);
    };

    const filteredRecipes = favoriteRecipes.filter(recipe => {
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        Favorilerim
                    </h1>
                    <p className="text-xl text-gray-600">
                        Beğendiğiniz tarifler burada toplanır
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

                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'all'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Tümü
                    </button>
                    <button
                        onClick={() => setSelectedCategory('ana-yemekler')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'ana-yemekler'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Ana Yemekler
                    </button>
                    <button
                        onClick={() => setSelectedCategory('corbalar')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'corbalar'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Çorbalar
                    </button>
                    <button
                        onClick={() => setSelectedCategory('tatlilar')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'tatlilar'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Tatlılar
                    </button>
                    <button
                        onClick={() => setSelectedCategory('salatalar')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'salatalar'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Salatalar
                    </button>
                    <button
                        onClick={() => setSelectedCategory('kahvaltilik')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'kahvaltilik'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        Kahvaltılıklar
                    </button>
                    <button
                        onClick={() => setSelectedCategory('icecekler')}
                        className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'icecekler'
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-orange-50'
                            }`}
                    >
                        İçecekler
                    </button>
                </div>

                {/* Recipe Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onCardClick={openRecipeModal}
                            showFavoriteButton={true}
                            isFavorite={true} // Bu sayfadaki her kart favoridir
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

export default Favorites; 