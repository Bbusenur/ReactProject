import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";

const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Mevcut şifre zorunlu'),
    newPassword: Yup.string()
        .min(6, 'Yeni şifre en az 6 karakter olmalı')
        .required('Yeni şifre zorunlu'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
        .required('Yeni şifre tekrarı zorunlu'),
});

function ChangePassword() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Auth context'i kullan

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                        Şifre Değiştir
                    </h2>
                    <p className="text-xl text-gray-600">
                        Hesabınızın güvenliği için yeni bir şifre belirleyin
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Formik
                        initialValues={{
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '', // Changed from confirmNewPassword to confirmPassword
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            if (!user) {
                                toast.error("Şifre değiştirmek için giriş yapmalısınız.");
                                setSubmitting(false);
                                navigate('/login');
                                return;
                            }

                            const users = JSON.parse(localStorage.getItem('users') || '[]');
                            const currentUserIndex = users.findIndex((u: any) => u.id === user.id);

                            if (currentUserIndex === -1) {
                                toast.error("Kullanıcı bulunamadı.");
                                setSubmitting(false);
                                return;
                            }

                            if (users[currentUserIndex].password !== values.currentPassword) {
                                setFieldError("currentPassword", "Mevcut şifre hatalı");
                                setSubmitting(false);
                                return;
                            }

                            // Şifreyi güncelle
                            users[currentUserIndex].password = values.newPassword;
                            localStorage.setItem('users', JSON.stringify(users));

                            toast.success("Şifreniz başarıyla değiştirildi!");
                            navigate('/'); // Ana sayfaya yönlendir
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mevcut Şifre</label>
                                        <Field
                                            name="currentPassword"
                                            type="password"
                                            className="form-input"
                                        />
                                        <ErrorMessage name="currentPassword" component="div" className="text-red-600 mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Şifre</label>
                                        <Field
                                            name="newPassword"
                                            type="password"
                                            className="form-input"
                                        />
                                        <ErrorMessage name="newPassword" component="div" className="text-red-600 mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Şifre Tekrar</label>
                                        <Field
                                            name="confirmPassword"
                                            type="password"
                                            className="form-input"
                                        />
                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-600 mt-1" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-primary"
                                    >
                                        Şifreyi Değiştir
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

export default ChangePassword; 