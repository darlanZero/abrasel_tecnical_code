import { RegisterFormData, LoginFormData, ValidationResult, PasswordValidation } from "@/types";

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Mínimo de 8 caracteres");
  if (!/[A-Za-z]/.test(password)) errors.push("Pelo menos 1 letra");
  if (!/\d/.test(password)) errors.push("Pelo menos 1 número");
  return {
    isValid: errors.length === 0,
    errors
  };
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validateCEP = (cep: string): boolean => {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep.replace(/\D/g, ""));
}

export const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/\D/g, "");

    if (cleanCNPJ.length !== 14) return false;

    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
        sum += parseInt(cleanCNPJ.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }

    let digit = sum % 11 < 2 ? 0: 11 - (sum % 11);
    if (parseInt(cleanCNPJ.charAt(12)) !== digit) return false;

    sum = 0;
    weight = 6;
  
    for (let i = 0; i < 13; i++) {
        sum += parseInt(cleanCNPJ.charAt(i)) * weight;
        weight = weight === 2 ? 9 : weight - 1;
    }
    
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return parseInt(cleanCNPJ.charAt(13)) === digit;
}

export const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

export const validateRegisterForm = (data: RegisterFormData): ValidationResult => {
    const errors: string[] = [];

    if (!data.email) {
        errors.push("Email é obrigatório");
    } else if (!validateEmail(data.email)) {
        errors.push("Email inválido");
    }

    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
    }

    if (data.password !== data.confirmPassword) {
        errors.push("As senhas não coincidem");
    }

    if (!data.cnpj) {
        errors.push("CNPJ é obrigatório");
    } else if (!validateCNPJ(data.cnpj)) {
        errors.push("CNPJ inválido");
    }

    if (!data.cep) {
        errors.push("CEP é obrigatório");
    } else if (!validateCEP(data.cep)) {
        errors.push("CEP inválido");
    }

    if (!data.phone) {
        errors.push("Telefone é obrigatório");
    } else if (!validatePhone(data.phone)) {
        errors.push("Telefone inválido");
    }

    if (data.businessTypes.length === 0) {
        errors.push("Selecione pelo menos um tipo de negócio");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export const validateLoginForm = (data: LoginFormData): ValidationResult => {
    const errors: string[] = [];

    if (!data.email) {
        errors.push("E-mail é obrigatório");
    } else if (!validateEmail(data.email)) {
        errors.push("E-mail inválido");
    }
    
    if (!data.password) {
        errors.push("Senha é obrigatória");
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

//formatadores

export const formatCEP = (cep: string): string => {
  const clean = cep.replace(/\D/g, '');
  return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};

export const formatCNPJ = (cnpj: string): string => {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return clean.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (clean.length === 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
};
