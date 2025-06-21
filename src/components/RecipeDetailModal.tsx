import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import { cookingTimes } from '../data/cookingTimes';
import { categories } from '../data/categories';

interface RecipeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
    showEditButton?: boolean;
    onRecipeUpdate?: (recipe: Recipe) => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ isOpen, onClose, recipe, showEditButton = false, onRecipeUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState<Partial<Recipe>>(recipe || {});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (recipe) {
            setEditedRecipe(recipe);
            setIsEditing(false); // Modal her açıldığında düzenleme modunu kapat
        }
    }, [recipe]);

    if (!isOpen || !recipe) return null;

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRecipe(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmUpdate = () => {
        if (onRecipeUpdate) {
            onRecipeUpdate(editedRecipe as Recipe);
        }
        setShowConfirmDialog(false);
        setIsEditing(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setEditedRecipe(prev => ({ ...prev, image: reader.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.title}</h2>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <img src={isEditing ? editedRecipe.image : recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
                                {isEditing && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fotoğraf URL'si</label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={editedRecipe.image || ''}
                                            onChange={handleEditChange}
                                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">Detaylar</h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                        <p><strong>Pişirme Süresi:</strong> {isEditing ? (
                                            <select name="cookingTime" value={editedRecipe.cookingTime || ''} onChange={handleEditChange} className="form-input-sm">
                                                {cookingTimes.map(time => <option key={time} value={time}>{time}</option>)}
                                            </select>
                                        ) : recipe.cookingTime}</p>
                                        <p><strong>Zorluk:</strong> {isEditing ? (
                                            <select name="difficulty" value={editedRecipe.difficulty || ''} onChange={handleEditChange} className="form-input-sm">
                                                <option value="Kolay">Kolay</option>
                                                <option value="Orta">Orta</option>
                                                <option value="Zor">Zor</option>
                                            </select>
                                        ) : recipe.difficulty}</p>
                                        <p><strong>Kategori:</strong> {isEditing ? (
                                            <select name="category" value={editedRecipe.category || ''} onChange={handleEditChange} className="form-input-sm">
                                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                            </select>
                                        ) : categories.find(c => c.id === recipe.category)?.name || recipe.category}</p>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">Malzemeler</h3>
                            {isEditing ? (
                                <textarea name="ingredients" value={editedRecipe.ingredients || ''} onChange={handleEditChange} rows={6} className="form-input"></textarea>
                            ) : (
                                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                                    {recipe.ingredients.split('\n').map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            )}
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-2">Hazırlanışı</h3>
                            {isEditing ? (
                                <textarea name="instructions" value={editedRecipe.instructions || ''} onChange={handleEditChange} rows={10} className="form-input"></textarea>
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{recipe.instructions}</p>
                            )}
                        </div>
                    </div>
                    <div className="p-6 border-t dark:border-gray-700 flex justify-end items-center space-x-4">
                        {showEditButton && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="btn-primary">Düzenle</button>
                        )}
                        {isEditing && (
                            <>
                                <button onClick={() => setIsEditing(false)} className="btn-secondary">İptal</button>
                                <button onClick={handleSaveClick} className="btn-primary">Kaydet</button>
                            </>
                        )}
                        <button onClick={onClose} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Kapat</button>
                    </div>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Değişiklikleri Onayla</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Yaptığınız değişiklikleri kaydetmek istediğinize emin misiniz?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="btn-secondary"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                className="btn-primary"
                            >
                                Evet, Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RecipeDetailModal; 