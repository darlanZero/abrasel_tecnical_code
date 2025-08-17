"use client";

import { useState, useEffect } from "react";
import { Associate, Supervisor } from "@/types";

export default function DashboardPage() {
  const [user, setUser] = useState<Associate | Supervisor | null>(null);
  const [currentSection, setCurrentSection] = useState('welcome');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const sections = [
    { id: 'welcome', title: '🎉 Parabéns!', icon: '🎊' },
    { id: 'project', title: '📁 Sobre o Projeto', icon: '🚀' },
    { id: 'structure', title: '🏗️ Estrutura Técnica', icon: '⚙️' },
    { id: 'api', title: '🔌 Sistema de API', icon: '🌐' },
    { id: 'features', title: '✨ Funcionalidades', icon: '🎯' },
    { id: 'final', title: '📝 Considerações Finais', icon: '💭' }
  ];

  const renderSection = () => {
    switch(currentSection) {
      case 'welcome':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Parabéns, {user?.name?.split(' ')[0] || 'Usuário'}!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Você explorou com sucesso o sistema de gestão de usuários da Abrasel! 
                Este projeto foi desenvolvido especialmente para demonstrar competências 
                técnicas em um processo seletivo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🎯 Objetivo do Projeto
                </h3>
                <p className="text-blue-700">
                  Demonstrar habilidades em desenvolvimento Full-Stack com Next.js, 
                  autenticação, banco de dados e interface de usuário moderna.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🚀 Status do Sistema
                </h3>
                <p className="text-green-700">
                  Sistema funcional com autenticação, validações, banco SQLite 
                  e interface responsiva implementados com sucesso!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200 mt-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">👤</span>
                <h3 className="text-xl font-semibold text-gray-900">Seu Perfil no Sistema</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Nome:</strong> {user?.name || 'N/A'}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || 'N/A'}
                </div>
                <div>
                  <strong>Tipo de Usuário:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user?.role === 'SUPERVISOR' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user?.role === 'SUPERVISOR' ? 'Administrador' : 'Associado'}
                  </span>
                </div>
                <div>
                  <strong>ID:</strong> {user?.id || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'project':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📁 Sobre o Projeto</h2>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-3">🎯 Contexto</h3>
              <p className="text-gray-700 mb-4">
                Este é um sistema de gestão de usuários desenvolvido como parte de um processo 
                seletivo para a <strong>Abrasel</strong> (Associação Brasileira de Bares e Restaurantes). 
                O projeto simula um sistema real de gestão de associados e administradores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🛠️ Tecnologias Utilizadas</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Next.js 14</strong> - Framework React</li>
                  <li>• <strong>TypeScript</strong> - Tipagem estática</li>
                  <li>• <strong>Tailwind CSS</strong> - Estilização</li>
                  <li>• <strong>SQLite</strong> - Banco de dados</li>
                  <li>• <strong>bcryptjs</strong> - Hash de senhas</li>
                  <li>• <strong>App Router</strong> - Roteamento moderno</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">🎨 Características do Design</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Interface moderna e responsiva</li>
                  <li>• Sidebar expansível e intuitiva</li>
                  <li>• Feedback visual em tempo real</li>
                  <li>• Avatars personalizados por usuário</li>
                  <li>• Estados de loading e erro</li>
                  <li>• Validações em tempo real</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'structure':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏗️ Estrutura Técnica</h2>

            <div className="bg-gray-50 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-3">📂 Organização do Código</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>{`src/
├── app/
│   ├── (auth)/          # Páginas de autenticação
│   │   ├── login/       # Login de associados
│   │   ├── register/    # Cadastro de associados
│   │   └── admin-login/ # Login administrativo
│   ├── (internal)/      # Área interna autenticada
│   │   ├── layout.tsx   # Sidebar e estrutura
│   │   └── dashboard/   # Esta página
│   ├── (landing)/       # Página inicial
│   └── api/auth/        # Endpoints da API
├── lib/
│   ├── sqlite/          # Configuração do banco
│   └── validation/      # Validações e formatadores
├── types/               # Interfaces TypeScript
└── components/          # Componentes reutilizáveis`}</pre>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">🔒 Segurança Implementada</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Senhas hasheadas com bcrypt</li>
                  <li>• Validação de entrada rigorosa</li>
                  <li>• Separação de roles (Associate/Supervisor)</li>
                  <li>• Proteção de rotas por autenticação</li>
                  <li>• Sanitização de dados de entrada</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">📊 Banco de Dados</h3>
                <ul className="space-y-2 text-purple-800">
                  <li>• SQLite para simplicidade e portabilidade</li>
                  <li>• Tabelas: users, associates, supervisors</li>
                  <li>• Relacionamentos bem definidos</li>
                  <li>• Transações para consistência</li>
                  <li>• Índices para performance</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔌 Sistema de API</h2>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">🌐 Endpoints Implementados</h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-900">POST /api/auth/register</h4>
                  <p className="text-gray-600">Cadastro de novos associados</p>
                  <div className="bg-gray-100 p-2 rounded text-xs mt-2">
                    <strong>Body:</strong> email, name, password, address, cnpj, businessTypes...
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-900">POST /api/auth/login</h4>
                  <p className="text-gray-600">Autenticação de usuários (associados e supervisores)</p>
                  <div className="bg-gray-100 p-2 rounded text-xs mt-2">
                    <strong>Body:</strong> email, password
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">⚡ Fluxo da API</h3>
                <ol className="space-y-2 text-indigo-800">
                  <li>1. <strong>Validação:</strong> Dados de entrada</li>
                  <li>2. <strong>Processamento:</strong> Lógica de negócio</li>
                  <li>3. <strong>Banco:</strong> Operações SQLite</li>
                  <li>4. <strong>Resposta:</strong> JSON estruturado</li>
                  <li>5. <strong>Frontend:</strong> Atualização da UI</li>
                </ol>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3">🛡️ Tratamento de Erros</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• Validação de entrada rigorosa</li>
                  <li>• Mensagens de erro específicas</li>
                  <li>• Status HTTP apropriados</li>
                  <li>• Rollback de transações</li>
                  <li>• Logs para debugging</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Funcionalidades Implementadas</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">👤 Para Associados</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>✅ Cadastro completo com validações</li>
                  <li>✅ Login seguro</li>
                  <li>✅ Consulta automática de CEP (ViaCEP)</li>
                  <li>✅ Formatação de CNPJ, telefone e CEP</li>
                  <li>✅ Validação de CNPJ com dígitos verificadores</li>
                  <li>✅ Interface personalizada por usuário</li>
                  <li>✅ Modal de atualização de perfil</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3">👨‍💼 Para Administradores</h3>
                <ul className="space-y-2 text-red-800">
                  <li>✅ Login administrativo separado</li>
                  <li>✅ Verificação de permissões</li>
                  <li>✅ Interface diferenciada</li>
                  <li>✅ Acesso a funcionalidades exclusivas</li>
                  <li>✅ Sistema de roles bem definido</li>
                  <li>🔄 Gerenciamento de usuários (planejado)</li>
                  <li>🔄 Relatórios e analytics (planejado)</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎨 Experiência do Usuário</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Visual:</strong>
                  <ul className="mt-1 text-gray-700">
                    <li>• Design responsivo</li>
                    <li>• Avatars coloridos</li>
                    <li>• Feedback visual</li>
                    <li>• Estados de loading</li>
                  </ul>
                </div>
                <div>
                  <strong>Interação:</strong>
                  <ul className="mt-1 text-gray-700">
                    <li>• Sidebar expansível</li>
                    <li>• Tooltips informativos</li>
                    <li>• Validação em tempo real</li>
                    <li>• Transições suaves</li>
                  </ul>
                </div>
                <div>
                  <strong>Acessibilidade:</strong>
                  <ul className="mt-1 text-gray-700">
                    <li>• Labels descritivos</li>
                    <li>• Contraste adequado</li>
                    <li>• Navegação por teclado</li>
                    <li>• Mensagens claras</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Considerações Finais</h2>

            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 text-center border border-green-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Projeto Concluído com Sucesso!</h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Este sistema demonstra competências em desenvolvimento Full-Stack, 
                desde a arquitetura até a experiência do usuário final.
              </p>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">🎯 Objetivos Alcançados</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>✅ Sistema de autenticação robusto</li>
                  <li>✅ Interface moderna e intuitiva</li>
                  <li>✅ Validações completas e seguras</li>
                  <li>✅ Arquitetura escalável</li>
                  <li>✅ Código limpo e documentado</li>
                  <li>✅ Experiência do usuário fluida</li>
                </ul>
              </div>

              
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">💡 Reflexões Técnicas</h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <strong>Escolhas Arquiteturais:</strong> Next.js foi escolhido pela facilidade de setup, 
                  App Router para roteamento moderno e SQLite para simplicidade de deploy.
                </p>
                <p>
                  <strong>Segurança:</strong> Implementei hash de senhas, validação rigorosa e separação 
                  de roles para garantir a integridade do sistema.
                </p>
                <p>
                  <strong>UX/UI:</strong> Focado em feedback visual, estados de loading e interface 
                  intuitiva para melhor experiência do usuário.
                </p>
                <p>
                  <strong>Escalabilidade:</strong> Código modular e tipado permite fácil manutenção 
                  e adição de novas funcionalidades.
                </p>
              </div>
            </div>

            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                Obrigado por explorar este projeto! 
              </p>
              <p className="text-sm text-gray-500">
                Desenvolvido com ❤️ para o processo seletivo da Abrasel
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Gestão - Abrasel
        </h1>
        <p className="text-gray-600">
          Projeto desenvolvido para processo seletivo - Demonstração técnica completa
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  currentSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderSection()}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          🏆 Parabéns por chegar até aqui! Você explorou todas as funcionalidades implementadas neste sistema.
        </p>
      </div>
    </div>
  );
}