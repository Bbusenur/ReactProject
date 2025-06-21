// src/pages/Register.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  username: Yup.string().required("Kullanıcı adı zorunlu"),
  email: Yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
  password: Yup.string().min(6, "En az 6 karakter").required("Şifre zorunlu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Şifre tekrarı zorunlu"),
});

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Kayıt Ol
          </h2>
          <p className="text-xl text-gray-600">
            Yeni bir hesap oluşturun
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              const users = JSON.parse(localStorage.getItem('users') || '[]');

              if (users.some((user: any) => user.username === values.username)) {
                setFieldError("username", "Bu kullanıcı adı zaten kullanılıyor");
                setSubmitting(false);
                return;
              }

              if (users.some((user: any) => user.email === values.email)) {
                setFieldError("email", "Bu e-posta adresi zaten kullanılıyor");
                setSubmitting(false);
                return;
              }

              const newUser = {
                id: Date.now().toString(),
                username: values.username,
                email: values.email,
                password: values.password
              };

              users.push(newUser);
              localStorage.setItem('users', JSON.stringify(users));
              toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
              navigate('/login');
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-2">
                    Kullanıcı Adı
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className="form-input"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-600 mt-1" />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-2">
                    E-posta
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="form-input"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 mt-1" />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-2">
                    Şifre
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-input"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 mt-1" />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-2">
                    Şifre Tekrar
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="form-input"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 mt-1" />
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                  >
                    Kayıt Ol
                  </button>
                  <div className="text-center text-gray-600">
                    Zaten hesabınız var mı?{" "}
                    <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                      Giriş Yapın
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Register;




