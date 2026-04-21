import { z } from "zod";

export const PASSWORD_RULES = [
  { label: "Minimal 8 karakter", test: (pw: string) => pw.length >= 8 },
  {
    label: "Mengandung huruf kapital",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  { label: "Mengandung angka", test: (pw: string) => /[0-9]/.test(pw) },
  {
    label: "Mengandung simbol (contoh: !@#$)",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
] as const;

export const mitraPasswordSchema = z.string().superRefine((pw, ctx) => {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(pw)) {
      ctx.addIssue({ code: "custom", message: rule.label });
    }
  }
});

export const mitraAccountSchema = z
  .object({
    username: z.string().min(1, "Username wajib diisi"),
    password: mitraPasswordSchema,
    confirmPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export const mitraIdentitySchema = z.object({
  picName: z.string().min(1, "Nama PIC wajib diisi"),
  picEmail: z.email("Format email tidak valid").min(1, "Email PIC wajib diisi"),
  companyName: z.string().min(1, "Nama organisasi wajib diisi"),
});
