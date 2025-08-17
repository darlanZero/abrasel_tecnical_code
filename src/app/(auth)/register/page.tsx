"use client";

import { useState } from "react";
import { validateRegisterForm, validatePassword, formatCEP, formatCNPJ, formatPhone } from "@/lib/validation";

const businessTypes = [
  "Restaurante",
  "Bar", 
  "Lanchonete",
  "Pizzaria",
  "Sorveteria",
  "Café",
  "Padaria",
  "Food Truck",
  "Delivery",
  "Outro"
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    cep: "",
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    phone: "",
    cnpj: "",
    businessTypes: [] as string[],
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handlePasswordChange = (password: string) => {
    setFormData({...formData, password});
    const validation = validatePassword(password);
    setPasswordErrors(validation.errors);
  };

  const handleCepChange = async (cep: string) => {
    const formattedCep = formatCEP(cep);
    setFormData(prev => ({ ...prev, cep: formattedCep }));
    
    if (cep.replace(/\D/g, "").length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleBusinessTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validação local primeiro
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Registro bem-sucedido
        console.log('Cadastro realizado com sucesso:', result.user);
        alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
        // Redirecionar para login
        window.location.href = '/login';
      } else {
        // Erro no registro
        if (Array.isArray(result.error)) {
          setErrors(result.error);
        } else {
          setErrors([result.error || 'Erro no cadastro']);
        }
      }
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      setErrors(['Erro de conexão. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cadastro de Associado
        </h2>
        <p className="text-gray-600">
          Preencha os dados para se tornar um associado
        </p>
      </div>

      {/* Exibir erros */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            {errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={isLoading}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="seu@email.com"
          />
        </div>

        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isLoading}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Seu nome"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha *
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={isLoading}
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {passwordErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              {passwordErrors.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Senha *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              disabled={isLoading}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </div>

        {/* CEP */}
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
            CEP *
          </label>
          <input
            id="cep"
            name="cep"
            type="text"
            required
            disabled={isLoading}
            value={formData.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="00000-000"
            maxLength={9}
          />
        </div>

        {/* Address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              id="address"
              name="address"
              type="text"
              disabled={isLoading}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
              Número
            </label>
            <input
              id="number"
              name="number"
              type="text"
              disabled={isLoading}
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
              Bairro
            </label>
            <input
              id="neighborhood"
              name="neighborhood"
              type="text"
              disabled={isLoading}
              value={formData.neighborhood}
              onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Cidade
            </label>
            <input
              id="city"
              name="city"
              type="text"
              disabled={isLoading}
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <input
              id="state"
              name="state"
              type="text"
              disabled={isLoading}
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              maxLength={2}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Celular *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            disabled={isLoading}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* CNPJ */}
        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
            CNPJ *
          </label>
          <input
            id="cnpj"
            name="cnpj"
            type="text"
            required
            disabled={isLoading}
            value={formData.cnpj}
            onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="00.000.000/0001-00"
          />
        </div>

        {/* Business Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Negócio * (selecione um ou mais)
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {businessTypes.map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  checked={formData.businessTypes.includes(type)}
                  onChange={() => handleBusinessTypeChange(type)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Já tem conta?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}