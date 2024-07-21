import * as Joi from 'joi';

// Regular expression pattern to match all characters without space.
const passwordPattern = /^\S+$/;

// Validation schema for email addresses.
const emailSchema = Joi.string().email().required();

// Validation schemas for passwords.
const passwordSchema = Joi.string().required();
const createPasswordSchema = passwordSchema.min(8).pattern(passwordPattern);

export const createUserValidation = Joi.object({
  email: emailSchema,
  password: createPasswordSchema,
});

export const loginUserValidation = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const resetUserPasswordValidation = Joi.object({
  newPassword: createPasswordSchema,
});

export const changeUserPasswordValidation = Joi.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema.invalid(Joi.ref('oldPassword')),
});

export const changeUserInfoValidation = Joi.object({
  email: emailSchema,
});
