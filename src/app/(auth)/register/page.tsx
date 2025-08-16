"use client";

import { useState } from "react";

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
    password: "",
    confirmPassword: "",
    cep: "",
    address: "",
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

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("Mínimo de 8 caracteres");
    if (!/[A-Za-z]/.test(password)) errors.push("Pelo menos 1 letra");
    if (!/\d/.test(password)) errors.push("Pelo menos 1 número");
    return errors;
  };

  const handleCepChange = async (cep: string) => {
    setFormData(prev => ({ ...prev, cep }));
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation.length > 0) {
      setPasswordErrors(passwordValidation);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    
    console.log("Register data:", formData);
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
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu@email.com"
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
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setPasswordErrors(validatePassword(e.target.value));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
            value={formData.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={formData.neighborhood}
              onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            value={formData.cnpj}
            onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  checked={formData.businessTypes.includes(type)}
                  onChange={() => handleBusinessTypeChange(type)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          Cadastrar
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