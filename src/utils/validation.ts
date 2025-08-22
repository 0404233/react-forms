import { z } from 'zod'

export const passwordStrengthChecks = {
  hasNumber: /\d/,
  hasUpper: /[A-Z]/,
  hasLower: /[a-z]/,
  hasSpecial: /[^A-Za-z0-9]/
}

export function passwordIsStrong(pw: string) {
  return (
    passwordStrengthChecks.hasNumber.test(pw) &&
    passwordStrengthChecks.hasUpper.test(pw) &&
    passwordStrengthChecks.hasLower.test(pw) &&
    passwordStrengthChecks.hasSpecial.test(pw)
  )
}

export const baseSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Z][A-Za-z\s'-]*$/, 'First letter must be uppercase'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine(v => /^\d+$/.test(v), 'Age must be a number')
    .transform(v => Number(v))
    .refine(v => v >= 0, 'Age cannot be negative'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(passwordIsStrong, 'Password must include number, upper, lower, special'),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select gender' })
  }),
  acceptedTC: z.literal(true, { errorMap: () => ({ message: 'You must accept T&C' }) }),
  pictureFile: z.instanceof(File).optional(),
  country: z.string().min(1, 'Country is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
})

export type BaseSchema = z.infer<typeof baseSchema>