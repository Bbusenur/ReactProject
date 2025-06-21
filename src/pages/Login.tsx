import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Geçersiz e-posta").required("E-posta zorunlu"),
  password: Yup.string().required("Şifre zorunlu"),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hesabınıza giriş yapın
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setFieldError }) => {
              const users = JSON.parse(localStorage.getItem('users') || '[]');
              const user = users.find(
                (u: any) => u.email === values.email && u.password === values.password
              );
              if (user) {
                login(user);
                navigate("/");
              } else {
                setFieldError("email", "E-posta veya şifre hatalı");
                setFieldError("password", "E-posta veya şifre hatalı");
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 mt-1" />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Şifre
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 mt-1" />
                </div>
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                  >
                    Giriş Yap
                  </button>
                  <div className="text-center text-gray-600">
                    Hesabınız yok mu?{" "}
                    <Link to="/register" className="text-orange-500 hover:text-orange-600 font-medium">
                      Kayıt Olun
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

export default Login;



