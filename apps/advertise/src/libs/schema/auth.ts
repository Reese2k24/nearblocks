import { z } from 'zod';

const register = z
  .object({
    username: z
      .string()
      .trim()
      .min(5)
      .max(30)
      .regex(/^[a-z0-9]+$/i, 'Invalid username'),
    email: z.string().email(),
    confirm_email: z.string().email(),
    password: z.string().trim().min(8).max(100),
    confirm_password: z.string().trim().min(8).max(100),
  })
  .refine((data) => data.email === data.confirm_email, {
    message: "Emails don't match",
    path: ['confirm_email'],
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

const resend = z.object({
  email: z.string().email(),
});

const verify = z.object({
  email: z.string().email(),
  code: z.string().max(32),
});

const login = z.object({
  username: z
    .string()
    .trim()
    .min(5)
    .max(30)
    .regex(/^[a-z0-9]+$/i, 'Invalid username'),
  password: z.string().trim().min(8).max(100),
  remember: z.boolean().optional(),
});

const forgot = z.object({
  email: z.string().email(),
});

const reset = z
  .object({
    email: z.string().email(),
    code: z.string().max(32),
    password: z.string().trim().min(8).max(100),
    confirm_password: z.string().trim().min(8).max(100),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

export type Register = z.infer<typeof register>;
export type Resend = z.infer<typeof resend>;
export type Verify = z.infer<typeof verify>;
export type Login = z.infer<typeof login>;
export type Forgot = z.infer<typeof forgot>;
export type Reset = z.infer<typeof reset>;

export default { register, resend, verify, login, forgot, reset };
