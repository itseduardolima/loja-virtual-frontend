// Validações puras das telas de auth (login, cadastro, esqueci-senha, reset-password).
// O regex de senha espelha o do backend (CreateClientDto / ResetPasswordDto).

export interface PasswordRule {
  label: string
  valid: boolean
}

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

export function isValidPassword(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}

export function passwordRules(password: string): PasswordRule[] {
  return [
    { label: 'Mínimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Pelo menos uma letra maiúscula', valid: /[A-Z]/.test(password) },
    { label: 'Pelo menos um número', valid: /\d/.test(password) },
  ]
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}
