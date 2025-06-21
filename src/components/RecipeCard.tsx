import React from 'react';
import type { Recipe } from '../types';
import { toast } from 'react-toastify';

interface RecipeCardProps {
    recipe: Recipe;
    onCardClick: (recipe: Recipe) => void;
    showFavoriteButton?: boolean;
    isFavorite?: boolean;
    onToggleFavorite?: (recipe: Recipe, e: React.MouseEvent) => void;
    showDeleteButton?: boolean;
    onDelete?: (id: number, e: React.MouseEvent) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
    recipe,
    onCardClick,
    showFavoriteButton = true,
    isFavorite = false,
    onToggleFavorite,
    showDeleteButton = false,
    onDelete,
}) => {
    const { id, title, image, cookingTime, difficulty, username } = recipe;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const recipeText = `Tarif: ${recipe.title}\n\nMalzemeler:\n${recipe.ingredients}\n\nHazırlanışı:\n${recipe.instructions}`;
        navigator.clipboard.writeText(recipeText).then(() => {
            toast.success('Tarif panoya kopyalandı!');
        }, () => {
            toast.error('Kopyalama başarısız oldu.');
        });
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const shareData = {
            title: recipe.title,
            text: `Lezzetli bir tarif buldum: ${recipe.title}`,
            url: window.location.href, // Bu URL'i tarifin detay sayfasına yönlendirecek şekilde değiştirebilirsiniz.
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback için kopyalama yapabilir veya bir uyarı gösterebilirsiniz.
                handleCopy(e);
                toast.info('Tarayıcınız paylaşım özelliğini desteklemiyor. Tarif panoya kopyalandı.');
            }
        } catch (error) {
            // Paylaşım iptal edildiğinde hata vermemesi için kontrol
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Share was aborted by the user.');
            } else {
                console.error("Share failed:", error);
                toast.error('Paylaşım sırasında bir hata oluştu.');
            }
        }
    };

    return (
        <div
            className="card bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
            onClick={() => onCardClick(recipe)}
        >
            <div className="relative">
                <img className="w-full h-56 object-cover" src={image} alt={title} />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xl font-bold">Detay Gör</span>
                </div>
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                    {showFavoriteButton && onToggleFavorite && (
                        <button onClick={(e) => onToggleFavorite(recipe, e)} className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 shadow-md">
                            <svg className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                            </svg>
                        </button>
                    )}
                    {showDeleteButton && onDelete && (
                        <button onClick={(e) => onDelete(id, e)} className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                <div className="mt-2 flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold">{cookingTime}</span>
                        <span className="text-xs">{difficulty} Zorluk</span>
                    </div>
                    {username && (
                        <div className="flex items-center text-xs">
                            <span className="mr-1">{username}</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                        </div>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end space-x-3">
                    <button onClick={handleShare} title="Paylaş" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path></svg>
                    </button>
                    <button onClick={handleCopy} title="Kopyala" className="text-gray-400 hover:text-green-500 transition-colors duration-200">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard; 