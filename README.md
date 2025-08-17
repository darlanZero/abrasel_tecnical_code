# Sistema de Gestão de Usuários - Abrasel

> Sistema de gerenciamento de associados e administradores desenvolvido para processo seletivo da **Abrasel** (Associação Brasileira de Bares e Restaurantes).

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite)

## 📋 Sobre o Projeto

Este sistema foi desenvolvido como parte de um processo seletivo para a Abrasel, demonstrando competências em desenvolvimento Full-Stack, autenticação, gerenciamento de usuários e interface moderna.

### 🎯 Propósito

- **Objetivo**: Demonstrar habilidades técnicas em desenvolvimento web
- **Contexto**: Processo seletivo para vaga de desenvolvedor na Abrasel
- **Escopo**: Sistema completo de gestão de usuários com diferentes roles (Associados e Administradores)

## 🚀 Funcionalidades

### 👥 Para Associados

- ✅ **Cadastro completo** com validação de CNPJ, CEP e telefone
- ✅ **Login seguro** com autenticação por email/senha
- ✅ **Consulta automática de endereço** via API ViaCEP
- ✅ **Formatação automática** de CNPJ, telefone e CEP
- ✅ **Interface personalizada** com avatar colorido por usuário
- ✅ **Dashboard informativo** sobre o projeto

### 👨‍💼 Para Administradores

- ✅ **Login administrativo separado** com validação de permissões
- ✅ **Gerenciamento completo de usuários** em tabela responsiva
- ✅ **Edição inline** de informações (nome, email, role, status)
- ✅ **Exclusão de usuários** com confirmação e proteções
- ✅ **Filtros e busca** por nome, email ou CNPJ
- ✅ **Estatísticas em tempo real** do sistema

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior robustez
- **Tailwind CSS** - Estilização utilitária e responsiva
- **React Hooks** - Gerenciamento de estado moderno

### Backend

- **Next.js API Routes** - Endpoints RESTful
- **SQLite** - Banco de dados leve e portável
- **bcryptjs** - Hash seguro de senhas
- **Validações customizadas** - CNPJ, CEP, email, telefone

### Segurança

- **Autenticação baseada em roles** (Associate/Supervisor)
- **Hash de senhas** com salt
- **Validação rigorosa** de entrada de dados
- **Proteção contra auto-exclusão** de administradores
- **Sanitização** de dados de entrada

## 📁 Estrutura do Projeto

```ini
src/
├── app/
│   ├── (auth)/              # Páginas de autenticação
│   │   ├── login/           # Login de associados
│   │   ├── register/        # Cadastro de associados
│   │   └── admin-login/     # Login administrativo
│   ├── (internal)/          # Área interna autenticada
│   │   ├── layout.tsx       # Sidebar expansível
│   │   ├── dashboard/       # Dashboard principal
│   │   └── manage-users/    # Gerenciamento de usuários
│   ├── (landing)/           # Página inicial
│   └── api/                 # Endpoints da API
│       ├── auth/            # Autenticação
│       └── users/           # Operações CRUD
├── lib/
│   ├── sqlite/              # Configuração do banco
│   │   ├── config.ts        # Operações do banco
│   │   └── api.ts           # Handlers da API
│   └── validation/          # Validações e formatadores
├── types/                   # Interfaces TypeScript
└── components/              # Componentes reutilizáveis

```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

#### `users` (Tabela principal)

- `id` - UUID único
- `email` - Email único
- `name` - Nome completo
- `password` - Senha hasheada
- `role` - ASSOCIATE | SUPERVISOR
- `created_at`, `updated_at` - Timestamps

#### `associates` (Dados específicos de associados)

- `id` - UUID único
- `user_id` - FK para users
- `cep`, `address`, `number`, `neighborhood`, `city`, `state`
- `phone`, `cnpj` - Dados comerciais
- `business_types` - JSON array
- `is_active` - Status ativo/inativo

#### `supervisors` (Dados específicos de administradores)

- `id` - UUID único
- `user_id` - FK para users
- `permissions` - JSON array de permissões

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**

```bash
git clone [url-do-repositorio]
cd abra-management-users

```

2. **Instale as dependências**

```bash
npm install

```

3. **Configure o banco de dados**

```bash
# O banco SQLite será criado automaticamente na primeira execução

```

4. **Crie o usuário administrador**

```bash
npx tsx scripts/create-admin.ts

```

5. **Execute o projeto**

```bash
npm run dev

```

6. **Acesse o sistema**

   - Aplicação: http://localhost:3000
   - Área administrativa: http://localhost:3000/admin-login

## 🔐 Credenciais de Acesso

### Administrador

- **Email**: `adner.silva@abrasel.com.br`
- **Senha**: `abrasel2025!`
- **Acesso**: [http://localhost:3000/admin-login](http://localhost:3000/admin-login)

### Associado (Teste)

Você pode criar um novo associado através da página de cadastro ou usar as credenciais de algum usuário cadastrado.

## 🎨 Interface e Experiência do Usuário

### Design System

- **Cores**: Azul para associados, Vermelho para administradores
- **Tipografia**: Inter font para legibilidade
- **Iconografia**: Heroicons e emojis para feedback visual
- **Layout**: Design responsivo mobile-first

### Características UX

- **Feedback visual** em tempo real
- **Loading states** para melhor percepção de performance
- **Validação inline** com mensagens claras
- **Avatars personalizados** baseados no nome
- **Sidebar expansível** para otimização de espaço
- **Estados de erro** bem definidos

## 🧪 Validações Implementadas

### CNPJ

- Formato correto (XX.XXX.XXX/XXXX-XX)
- Algoritmo de dígitos verificadores
- Rejeição de CNPJs inválidos conhecidos

### CEP

- Formato XXXXX-XXX
- Integração com ViaCEP para preenchimento automático

### Email

- Regex para validação de formato
- Verificação de unicidade no banco

### Senha

- Mínimo 8 caracteres
- Pelo menos 1 letra e 1 número
- Hash com bcrypt (salt rounds: 10)

### Telefone

- Formato (XX) XXXXX-XXXX
- Validação de quantidade de dígitos

## 🔄 API Endpoints

### Autenticação

- `POST /api/auth/login` - Login de usuários
- `POST /api/auth/register` - Cadastro de associados

### Usuários (Admin apenas)

- `GET /api/users` - Listar todos os usuários
- `POST /api/users/update` - Atualizar usuário
- `POST /api/users/delete` - Excluir usuário

## 🎯 Decisões Técnicas

### Arquitetura

- **Next.js App Router**: Para roteamento moderno e performance
- **SQLite**: Simplicidade de setup e portabilidade
- **TypeScript**: Type safety e melhor DX
- **Tailwind CSS**: Rapidez no desenvolvimento e consistência

### Segurança

- **Hash de senhas**: bcrypt com salt para proteção
- **Validação dupla**: Frontend e backend para robustez
- **Roles bem definidos**: Separação clara de permissões
- **SQL Injection**: Uso de prepared statements

### Performance

- **Client-side caching**: localStorage para dados do usuário
- **Queries otimizadas**: JOINs eficientes e índices
- **Lazy loading**: Componentes carregados sob demanda
- **Minimal bundle**: Tree shaking e imports otimizados

## 👨‍💻 Sobre o Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de:

- **Clean Code**: Código legível e bem estruturado
- **SOLID Principles**: Arquitetura escalável
- **Git Flow**: Commits semânticos e organizados
- **Error Handling**: Tratamento robusto de erros
- **Documentation**: Código bem documentado

## 📞 Contato

Desenvolvido com ❤️ para o processo seletivo da Abrasel.

**Desenvolvedor**: [DarlanZeroDev]  
**Email**: [darliankeira229@gmail.com]  
**LinkedIn**: [[Darlan Oliveira](https://www.linkedin.com/in/darlanoliveiradev/)]  
**GitHub**: [DarlanZero](https://github.com/DarlanZero)

---

## 🏆 Demonstração

**Parabéns por explorar este projeto!** 🎉

Este sistema demonstra competências completas em desenvolvimento Full-Stack, desde a arquitetura até a experiência do usuário final. Cada funcionalidade foi pensada para mostrar diferentes aspectos técnicos e de UX.

**Obrigado pela oportunidade de participar do processo seletivo da Abrasel!**

---

*Projeto desenvolvido em 2025 - Versão 1.0.0*