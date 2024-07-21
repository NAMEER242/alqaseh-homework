import * as Joi from 'joi';
import {
  changeUserInfoValidation,
  changeUserPasswordValidation,
  createUserValidation,
  resetUserPasswordValidation,
} from '@qaseh/validations';
import { AdminSortBy, AdminSortDir } from '@qaseh/enums';

export const createAdminValidation = Joi.object({
  fullName: Joi.string().required(),
  imageUrl: Joi.string(),
}).concat(createUserValidation);

export const filterAdminValidation = Joi.object({
  query: Joi.string(),
  sortBy: Joi.string()
    .valid(...Object.values(Object.values(AdminSortBy)))
    .default(AdminSortBy.CreatedAt),
  sortDir: Joi.string()
    .valid(...Object.values(Object.values(AdminSortDir)))
    .default(AdminSortDir.DESC),
  take: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});

export const changeAdminInfoValidation = Joi.object({
  fullName: Joi.string(),
  imageUrl: Joi.string(),
}).concat(changeUserInfoValidation);

export const changeAdminPasswordValidation = changeUserPasswordValidation;

export const resetAdminPasswordValidation = resetUserPasswordValidation;
