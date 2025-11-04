/**
 * Modelo de Dominio.
 * El objeto 'User' que usa la lógica de negocio (AuthService, etc.)
 */
export class User {
  userId: string | null; // Permitimos null para nuevos usuarios antes de guardarlos
  username: string;
  email: string;
  password: string; 
  fullName: string;
  isActive: boolean;
  roles: string[];
}
