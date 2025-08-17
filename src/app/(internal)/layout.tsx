"use client";

import { Associate, Supervisor } from "@/types";
import { useEffect, useState } from "react";

const generateAvatarColor = (name: string) => {
    if (!name) return "bg-gray-500";
    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 
        'bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

const generateInitials = (name: string) => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
};

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const [isExpanded, setIsExpanded] = useState(true);
    const [user, setUser] = useState<Associate | Supervisor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {

        const loadUserData = () => {

            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } else {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
                window.location.href = "/login";
            } finally {
                setIsLoading(false);
            }
        }
        loadUserData();
    }, [])

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    }

    const handleLogout = () => {
        if (confirm('Tem certeza de que deseja sair?')) {
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
    }

    const openProfileModal = () => {
        setShowProfileModal(true);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-600">Carregando área interna...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null;
    }
  return (
    <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${isExpanded ? "w-64" : "w-16"}`}>
            {/* Header da Sidebar */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {isExpanded && (
                        <div className="flex items-center space-x-2">
                            <h1 className="text-xl font-bold text-blue-600">
                                Abrasel
                            </h1>
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        title={isExpanded ? "Colapsar" : "Expandir"}
                    >
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isExpanded ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Profile Section */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${generateAvatarColor(user.name)} text-white font-semibold flex-shrink-0`}>
                        {generateInitials(user.name)}
                    </div>

                    {isExpanded && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={user.name || 'Usuário'}>
                                {user.name}
                            </p>

                            <p className="text-xs text-gray-500">
                                {user.role === "ASSOCIATE" ? "Associado" : "Supervisor"}
                            </p>

                            {user.role === "ASSOCIATE" && (
                                <p className="text-xs text-green-600">
                                    {(user as Associate).isActive ? "Ativo" : "Inativo"}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {/* Início - para todos usuários */}
                <a href="/dashboard"
                    className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group relative"
                >
                    <svg 
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    {isExpanded && <span>Início</span>}
                    {!isExpanded && (
                        <div className='absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50'>
                            Início
                        </div>
                    )}
                </a>

                {/* Atualizar Perfil - Para todos os usuários */}
                <button
                    onClick={openProfileModal}
                    className="w-full flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group relative"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    {isExpanded && <span>Atualizar Perfil</span>}
                    {!isExpanded && (
                        <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                            Atualizar Perfil
                        </div>
                    )}
                </button>
                
                {/* Gerenciar Usuários - Apenas para Supervisores */}
                    {user.role === 'SUPERVISOR' && (
                        <a
                            href="/manage-users"
                            className="flex items-center space-x-3 p-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group relative"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                            {isExpanded && <span>Gerenciar Usuários</span>}
                            {!isExpanded && (
                                <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                                    Gerenciar Usuários
                                </div>
                            )}
                        </a>
                    )
                }
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors group relative"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {isExpanded && <span>Sair</span>}
                    {!isExpanded && (
                        <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Sair
                        </div>
                    )}
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Área do {user.role === 'ASSOCIATE' ? 'Associado' : 'Administrador'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Bem-vindo(a), {user.name.split(' ')[0]}!
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Info do usuário */}
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                                {user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date().toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        {/* Avatar no header */}
                        <div 
                            className={`w-8 h-8 rounded-full ${generateAvatarColor(user.name)} flex items-center justify-center text-white text-sm font-semibold`}
                        >
                            {generateInitials(user.name)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>

        {/* Modal de Perfil (placeholder) */}
        {showProfileModal && 
            (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Atualizar Perfil</h3>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                            <p><strong>Nome:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Tipo:</strong> {user.role === 'ASSOCIATE' ? 'Associado' : 'Administrador'}</p>
                            {user.role === 'ASSOCIATE' && (
                                <>
                                    <p><strong>CNPJ:</strong> {(user as Associate).cnpj}</p>
                                    <p><strong>Telefone:</strong> {(user as Associate).phone}</p>
                                    <p><strong>Status:</strong> {(user as Associate).isActive ? 'Ativo' : 'Inativo'}</p>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 italic">
                            Funcionalidade de edição será implementada em breve.
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  );
}