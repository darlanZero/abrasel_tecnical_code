export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: UserRole
    createdAt: Date;
    updatedAt: Date;
}

export interface Associate extends User {
    role: "ASSOCIATE";
    cep: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    phone: string;
    cnpj: string;
    businessTypes: string[];
    isActive: boolean;
}

export interface Supervisor extends User {
    role: "SUPERVISOR";
    permissions: string[];
}

export type UserRole = "ASSOCIATE" | "SUPERVISOR";

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  cep: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  cnpj: string;
  businessTypes: string[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}