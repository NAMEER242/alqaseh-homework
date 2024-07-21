import * as Joi from 'joi';
import {
  changeUserInfoValidation,
  changeUserPasswordValidation,
  createUserValidation,
  resetUserPasswordValidation,
} from '@qaseh/validations';
import { CustomerSortBy, CustomerSortDir } from '@qaseh/enums';

export const createCustomerValidation = Joi.object({
  fullName: Joi.string().required(),
  imageUrl: Joi.string(),
}).concat(createUserValidation);

export const filterCustomerValidation = Joi.object({
  query: Joi.string(),
  sortBy: Joi.string()
    .valid(...Object.values(Object.values(CustomerSortBy)))
    .default(CustomerSortBy.CreatedAt),
  sortDir: Joi.string()
    .valid(...Object.values(Object.values(CustomerSortDir)))
    .default(CustomerSortDir.DESC),
  take: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});

export const changeCustomerInfoValidation = Joi.object({
  fullName: Joi.string(),
  imageUrl: Joi.string(),
}).concat(changeUserInfoValidation);

export const changeCustomerPasswordValidation = changeUserPasswordValidation;

export const resetCustomerPasswordValidation = resetUserPasswordValidation;
