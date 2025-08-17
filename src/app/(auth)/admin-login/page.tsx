"use client"

import { validateLoginForm } from "@/lib/validation";
import { useState } from "react";

export default function AdminLoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "", 
    })
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors([]);

        //validação local
        const validation = validateLoginForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            setIsLoading(false);
            return;
        }

        try{
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json();

            if(response.ok) {
                if(result.user.role !== 'SUPERVISOR') {
                    setErrors(["Denied Access. This area is restricted for your role"]);
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem("user", JSON.stringify(result.user));
                window.location.href = "/dashboard";
            } else {
                if (Array.isArray(result.error)) {
                    setErrors(result.error);
                } else {
                    setErrors([result.error || 'Invalid credentials']);
                }
            }
        } catch (error) {
            console.error("Error trying to login:", error);
            setErrors(["An unexpected error occurred. Please try again later."]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors.length > 0) {
            setErrors([]);
        }
    }

    return (
        <div>
            <div className="text-center mb-8">
                {/* Distinct Icon for administrative area*/}
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Acesso Administrativo
                </h2>
                <p className="text-gray-600">
                    Por favor, insira suas credenciais para acessar a área administrativa.
                </p>
            </div>

            {/*Security Alert */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                            Atenção: Área Restrita
                        </h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Esta área é restrita apenas para usuários com permissões administrativas.
                        </p>
                    </div>
                </div>
            </div>

            {/* Show errors */}
            {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>

                        <div className="ml-3">
                            <div className="text-sm text-red-700">
                                {errors.map((error, index) => (
                                    <p key={index}>• {error}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form 
                className="space-y-6"
                onSubmit={handleSubmit}
            >
                <div>
                    <label 
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        E-mail Administrativo
                    </label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                        focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="seu.email@abrasel.com.br"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Senha
                    </label>
                    <div className="relative">
                        <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Sua senha administrativa"
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                        >
                        {showPassword ? (
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        disabled={isLoading}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:cursor-not-allowed"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Manter-me conectado
                        </label>
                    </div>

                    <a
                        href="/forgot-password?admin=true"
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                    >
                        Esqueceu a senha?
                    </a>
                </div>

                 <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Entrando...
                        </div>
                    ) : (
                        "Acessar Sistema"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center space-y-4">
                <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
                </div>

                <div className="space-y-2">
                <p className="text-sm text-gray-600">
                    Precisa de acesso de associado?{" "}
                    <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                    Faça login aqui
                    </a>
                </p>
                <p className="text-sm text-gray-600">
                    Não é associado ainda?{" "}
                    <a
                    href="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                    Cadastre-se
                    </a>
                </p>
                </div>
            </div>
        </div>
    )
}