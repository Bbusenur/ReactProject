import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { sampleRecipes } from "../data/sampleRecipes";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from '../components/RecipeDetailModal';
import { useFavorites } from "../hooks/useFavorites";

interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  cookingTime: string;
  difficulty: string;
  image: string;
  userId: string;
  username: string;
  category: string;
}

const categories = [
  {
    id: "ana-yemekler",
    name: "Ana Yemekler",
    icon: "🍖"
  },
  {
    id: "corbalar",
    name: "Çorbalar",
    icon: "🥣"
  },
  {
    id: "tatlilar",
    name: "Tatlılar",
    icon: "🍰"
  },
  {
    id: "salatalar",
    name: "Salatalar",
    icon: "🥗"
  },
  {
    id: "kahvaltilik",
    name: "Kahvaltılıklar",
    icon: "🍳"
  },
  {
    id: "icecekler",
    name: "İçecekler",
    icon: "🥤"
  }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites(user?.id || null);
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryRecipes = (categoryId: string) => {
    return recipes.filter(recipe => recipe.category === categoryId);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleSubmitRecipe = () => {
    if (!isAuthenticated) {
      toast.warning('Tarif göndermek için giriş yapmalısınız!');
      navigate('/login');
      return;
    }
    navigate('/submit-recipe');
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Tarif ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === 'all'
            ? 'bg-orange-500 text-white shadow-lg'
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600'
            }`}
        >
          Tümü
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${selectedCategory === category.id
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-600'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onCardClick={openRecipeModal}
            showFavoriteButton={true}
            isFavorite={isFavorite(recipe.id)}
            onToggleFavorite={(r, e) => {
              e.stopPropagation();
              toggleFavorite(r);
            }}
          />
        ))}
      </div>

      <RecipeDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipe={selectedRecipe}
      />

      {/* Submit Recipe Button */}
      <div className="mt-12 text-center">
        <button
          onClick={handleSubmitRecipe}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Tarif Gönder
        </button>
      </div>
    </div>
  );
};

export default Home;