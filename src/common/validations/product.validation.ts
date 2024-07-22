import * as Joi from 'joi';
import { ProductCategory } from '@qaseh/enums';

export const productCreateValidation = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  category: Joi.string()
    .valid(...Object.values(ProductCategory))
    .required(),
});

export const productUpdateValidation = Joi.object({
  name: Joi.string(),
  price: Joi.number().positive(),
  quantity: Joi.number().positive(),
  category: Joi.string().valid(...Object.values(ProductCategory)),
});

export const productFilterValidation = Joi.object({
  query: Joi.string(),
  limit: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});
