import { z } from "zod";

// Schema untuk validasi password
export const passwordSchema = z
  .string()
  .min(8, "Minimal 8 karakter")
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Gunakan kombinasi huruf dan angka");

// Schema untuk validasi register form
export const registerSchema = z
  .object({
    name: z.string().min(1, "Nama lengkap harus diisi"),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username hanya boleh huruf, angka, dan underscore"
      ),
    email: z.string().email("Format email tidak valid"),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(["PARTNER", "ADMINISTRATOR"]).default("PARTNER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

// Schema untuk validasi login form
export const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

// Type exports
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
