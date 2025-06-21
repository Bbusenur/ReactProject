import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { cookingTimes } from "../data/cookingTimes";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
    title: Yup.string().required("Tarif adı zorunlu"),
    ingredients: Yup.string().required("Malzemeler zorunlu"),
    instructions: Yup.string().required("Yapılışı zorunlu"),
    cookingTime: Yup.string().required("Pişirme süresi zorunlu"),
    difficulty: Yup.string().required("Zorluk zorunlu"),
    image: Yup.mixed(),
});

function SubmitRecipe() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.id || '';
    const defaultImage = "/src/yemek/default.jpg";

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                        Yeni Tarif Gönder
                    </h1>
                    <p className="text-xl text-gray-600">
                        Tarifinizi paylaşın, topluluğumuza katkıda bulunun
                    </p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Formik
                        initialValues={{
                            title: "",
                            ingredients: "",
                            instructions: "",
                            cookingTime: "",
                            difficulty: "Kolay",
                            image: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                            let imageData = values.image;
                            if (imageData && typeof imageData !== "string") {
                                const file = imageData;
                                imageData = await new Promise<string>((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onloadend = () => resolve(reader.result as string);
                                    reader.onerror = reject;
                                    reader.readAsDataURL(file);
                                });
                            }

                            const newRecipe = {
                                id: Date.now(),
                                ...values,
                                image: imageData || defaultImage,
                                userId,
                                username: user?.username || 'Bilinmiyor',
                                category: 'sizden-gelenler'
                            };
                            const savedRecipes = localStorage.getItem('recipes');
                            let allRecipes = savedRecipes ? JSON.parse(savedRecipes) : [];
                            allRecipes.push(newRecipe);
                            localStorage.setItem('recipes', JSON.stringify(allRecipes));
                            setSubmitting(false);
                            navigate('/submitted-recipes');
                        }}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form className="space-y-6">
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Tarif Adı</label>
                                    <Field name="title" type="text" className="form-input" />
                                    <ErrorMessage name="title" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Malzemeler</label>
                                    <Field as="textarea" name="ingredients" rows={4} className="form-input" />
                                    <ErrorMessage name="ingredients" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Yapılışı</label>
                                    <Field as="textarea" name="instructions" rows={6} className="form-input" />
                                    <ErrorMessage name="instructions" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Pişirme Süresi</label>
                                    <Field as="select" name="cookingTime" className="form-input">
                                        <option value="">Süre Seçiniz</option>
                                        {cookingTimes.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="cookingTime" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Zorluk</label>
                                    <Field as="select" name="difficulty" className="form-input">
                                        <option value="Kolay">Kolay</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Zor">Zor</option>
                                    </Field>
                                    <ErrorMessage name="difficulty" component="div" className="text-red-600 mt-1" />
                                </div>
                                <div>
                                    <label className="block text-lg font-medium text-gray-900 mb-2">Fotoğraf</label>
                                    <input
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            if (e.currentTarget.files && e.currentTarget.files[0]) {
                                                setFieldValue("image", e.currentTarget.files[0]);
                                            } else {
                                                setFieldValue("image", "");
                                            }
                                        }}
                                        className="form-input"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="btn-secondary"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                    >
                                        Tarifi Gönder
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default SubmitRecipe; 