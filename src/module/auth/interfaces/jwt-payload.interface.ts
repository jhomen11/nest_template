/**
 * Define la estructura del payload que se incluirá dentro de cada JWT.
 * Esta interfaz se usará tanto al crear el token como al validarlo.
 */
export interface JwtPayload {
  sub: string | null; // 'sub' (subject) es el estándar para el ID de usuario en JWT.
  username: string;
  roles: string[];
  email: string;
  fullName: string;
}