import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Abrasel - Área do Associado",
    description: "Faça login ou cadastre-se para acessar os benefícios exclusívos da Abrasel."
}

export default function AuthLayout({children,}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Section - Benefits */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-600 to-green-800 p-12 flex-col justify-center">
                <div className="max-w-md mx-auto text-white">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            Abrasel
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Associação Brasileira de Bares e Restaurantes
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">
                                Benefícios de ser nosso Associado
                            </h2>

                            <div className="space-y-4 overflow-y-auto max-h-96 pr-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-700">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Descontos exclusivos</strong> sobre taxas de vale refeição
                                    </p>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Gratuidades e condições especiais</strong> nos principais eventos do setor
                                    </p>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Conexão com outros empresários</strong> do setor de alimentação
                                    </p>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Esteja a frente</strong> das principais pautas e novidades do setor
                                    </p>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Condições especiais</strong> com fornecedores parceiros
                                    </p>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
                                    <p className="text-blue-50">
                                        <strong>Orientação jurídica, contábil e administrativa</strong>*
                                        <br/>
                                        <span>
                                            *Consulte disponibilidade com a Abrasel da sua região
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-blue-500 pt-6">
                        <p className="text-blue-100 text-sm">
                            Junte-se a milhares de estabelecimentos que já fazem parte da maior rede de restaurantes do Brasil.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Auth Forms */}
            <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header for benefits */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Abrasel
                        </h1>
                        <p className="text-gray-600">
                            Associação Brasileira de Bares e Restaurantes
                        </p>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        {children}
                    </div>

                    {/* Mobile Benefits summary */}
                    <div className="lg:hidden bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Benefícios de ser Associado
                        </h3>
                        <p className="text-blue-700 text-sm">
                            Descontos exclusivos, eventos especiais, networking e muito mais.
                        </p>
                    </div>

                    {/* Back To Home Link */}
                    <div className="text-center mt-6">
                        <Link
                            href='/'
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Voltar para o site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}