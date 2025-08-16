import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Abrasel - Associação Brasileira de Bares e Restaurantes",
    description: "Conectando e fortalecendo a alimentação fora do lar no Brasil."
}

export default function LandingPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Abrasel
                                </h1>
                            </div>

                            <nav className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="#sobre" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Sobre
                                    </a>

                                    <a href="#servicos" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Serviços
                                    </a>

                                    <a href="#contato" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Contato
                                    </a>

                                    <a href="#login" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Entrar
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Abrasel. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}