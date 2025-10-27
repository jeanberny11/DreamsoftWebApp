import { z } from 'zod';

// Email validation (reusable)
const emailSchema = z.email({ message: 'Correo electronico invalido' })
.min(1, 'El correo electronico es obligatorio')
.toLowerCase()
.trim();

// Password validation (minimum 8 characters)
export const passwordSchema = z
  .string()
  .min(1, 'La contrasena es obligatoria')
  .min(8, 'La contrasena debe tener al menos 8 caracteres')
  .max(100, 'La contrasena no debe exceder los 100 caracteres');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  userName: z.string().min(1, 'El nombre de usuario es obligatorio'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
  rememberMe: z.boolean().optional(),
});

// Export types inferred from schemas (for React Hook Form)
export type LoginFormData = z.infer<typeof loginSchema>;