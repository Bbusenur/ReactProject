import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { categories } from "../data/categories";
import { cookingTimes } from "../data/cookingTimes";
import { recipeFormikSchema } from "../data/recipeFormikSchema";
import RecipeCard from "../components/RecipeCard";
import RecipeDetailModal from "../components/RecipeDetailModal";
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from '../context/AuthContext';

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

const recipeSchema = Yup.object().shape({
    title: Yup.string().required("Tarif başlığı zorunludur"),
    ingredients: Yup.string().required("Malzemeler zorunludur"),
    instructions: Yup.string().required("Hazırlanışı zorunludur"),
    cookingTime: Yup.string().required("Pişirme süresi zorunludur"),
    difficulty: Yup.string().required("Zorluk seviyesi zorunludur"),
    image: Yup.string().required("Tarif fotoğrafı zorunludur"),
    category: Yup.string().required("Kategori seçimi zorunludur"),
});

const defaultImage = "/src/yemek/default.jpg";

function Recipes() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isAddingRecipe, setIsAddingRecipe] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const userId = user?.id || '';
    const { toggleFavorite, isFavorite } = useFavorites(user?.id || null);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const savedRecipes = localStorage.getItem('recipes');
        if (savedRecipes) {
            const allRecipes = JSON.parse(savedRecipes);
            // Eğer my-recipes sayfasındaysak sadece kullanıcının kendi tariflerini göster
            if (location.pathname === '/my-recipes') {
                const userRecipes = allRecipes.filter((recipe: Recipe) => recipe.userId === userId);
                setRecipes(userRecipes);
            } else {
                // Değilse tüm tarifleri göster
                setRecipes(allRecipes);
            }
        }
    }, [userId, location.pathname]);

    const deleteRecipe = (id: number) => {
        const savedRecipes = localStorage.getItem('recipes');
        let allRecipes = savedRecipes ? JSON.parse(savedRecipes) : [];
        const updatedAllRecipes = allRecipes.filter((recipe: Recipe) => recipe.id !== id);
        localStorage.setItem('recipes', JSON.stringify(updatedAllRecipes));

        if (location.pathname === '/my-recipes') {
            const userRecipes = updatedAllRecipes.filter((recipe: Recipe) => recipe.userId === userId);
            setRecipes(userRecipes);
        } else {
            setRecipes(updatedAllRecipes);
        }
    };

    const openImageModal = (image: string) => {
        setCurrentImage(image);
        setIsImageModalOpen(true);
    };

    const openRecipeModal = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setShowModal(true);
    };

    const handleRecipeUpdate = (updatedRecipe: Recipe) => {
        if (!updatedRecipe) return;

        const updatedRecipes = recipes.map(recipe =>
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        );

        const savedRecipes = localStorage.getItem('recipes') || '[]';
        const allRecipes = JSON.parse(savedRecipes);
        const updatedAllRecipes = allRecipes.map((recipe: Recipe) =>
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        );
        localStorage.setItem('recipes', JSON.stringify(updatedAllRecipes));

        setRecipes(updatedRecipes);
        setSelectedRecipe(updatedRecipe);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRecipe(null);
    };

    const filteredRecipes = recipes.filter(recipe => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        // Tarif başlığı, malzemeler veya talimatlar içinde arama yap
        return (
            recipe.title.toLowerCase().includes(lowercasedSearchTerm) ||
            recipe.ingredients.toLowerCase().includes(lowercasedSearchTerm) ||
            recipe.instructions.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    return (
        <div className="container mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {location.pathname === '/my-recipes' ? 'Tariflerim' : 'Sizden Gelenler'}
                </h1>
                {location.pathname === '/my-recipes' && !isAddingRecipe && (
                    <button
                        onClick={() => setIsAddingRecipe(true)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-md"
                    >
                        Yeni Tarif Ekle
                    </button>
                )}
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Tariflerde ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
            </div>

            {isAddingRecipe && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Yeni Tarif Ekle</h2>
                    <Formik
                        initialValues={{
                            title: "",
                            ingredients: "",
                            instructions: "",
                            cookingTime: "",
                            difficulty: "Kolay",
                            image: "",
                            category: "",
                        }}
                        validationSchema={recipeFormikSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const newRecipe = {
                                id: Date.now(),
                                ...values,
                                image: values.image || defaultImage,
                                userId: userId,
                                username: user?.username || 'Bilinmeyen Kullanıcı',
                            };
                            const savedRecipes = localStorage.getItem('recipes');
                            let allRecipes = savedRecipes ? JSON.parse(savedRecipes) : [];
                            allRecipes.push(newRecipe);
                            localStorage.setItem('recipes', JSON.stringify(allRecipes));

                            if (location.pathname === '/my-recipes') {
                                const userRecipes = allRecipes.filter((recipe: Recipe) => recipe.userId === userId);
                                setRecipes(userRecipes);
                            } else {
                                setRecipes(allRecipes);
                            }

                            setSubmitting(false);
                            resetForm();
                            setIsAddingRecipe(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tarif Adı</label>
                                    <Field name="title" type="text" className="form-input" />
                                    <ErrorMessage name="title" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Malzemeler</label>
                                    <Field as="textarea" name="ingredients" rows={4} className="form-input" />
                                    <ErrorMessage name="ingredients" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Yapılışı</label>
                                    <Field as="textarea" name="instructions" rows={6} className="form-input" />
                                    <ErrorMessage name="instructions" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <Field as="select" name="category" className="form-input">
                                        <option value="">Kategori Seçiniz</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pişirme Süresi</label>
                                    <Field as="select" name="cookingTime" className="form-input">
                                        <option value="">Süre Seçiniz</option>
                                        {cookingTimes.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="cookingTime" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zorluk</label>
                                    <Field as="select" name="difficulty" className="form-input">
                                        <option value="Kolay">Kolay</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Zor">Zor</option>
                                    </Field>
                                    <ErrorMessage name="difficulty" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fotoğraf</label>
                                    <Field name="image">
                                        {({ form }: any) => (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (e.currentTarget.files && e.currentTarget.files[0]) {
                                                        const file = e.currentTarget.files[0];
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            form.setFieldValue("image", reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        form.setFieldValue("image", "");
                                                    }
                                                }}
                                                className="form-input"
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingRecipe(false)}
                                        className="btn-secondary"
                                    >
                                        Çıkış
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {location.pathname === '/my-recipes' && recipes.length === 0 && !isAddingRecipe ? (
                <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Henüz tarif eklemediniz</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hadi, ilk lezzetli tarifini bizimle paylaş!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            onCardClick={openRecipeModal}
                            showFavoriteButton={location.pathname !== '/my-recipes'}
                            isFavorite={isFavorite(recipe.id)}
                            onToggleFavorite={(r, e) => {
                                e.stopPropagation();
                                toggleFavorite(r);
                            }}
                            showDeleteButton={location.pathname === '/my-recipes'}
                            onDelete={(id, e) => {
                                e.stopPropagation();
                                deleteRecipe(id);
                            }}
                        />
                    ))}
                </div>
            )}

            <RecipeDetailModal
                isOpen={showModal}
                onClose={handleCloseModal}
                recipe={selectedRecipe}
                showEditButton={selectedRecipe?.userId === userId}
                onRecipeUpdate={handleRecipeUpdate}
            />

            {/* Image Modal */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div
                        className="relative max-w-4xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <img
                            src={currentImage}
                            alt="Tarif fotoğrafı"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Recipes; 