import * as Yup from "yup";

export const recipeFormikSchema = Yup.object({
    title: Yup.string().required("Tarif adı zorunlu"),
    ingredients: Yup.string().required("Malzemeler zorunlu"),
    instructions: Yup.string().required("Yapılışı zorunlu"),
    cookingTime: Yup.string().required("Pişirme süresi zorunlu"),
    difficulty: Yup.string().required("Zorluk zorunlu"),
    image: Yup.mixed(),
}); 