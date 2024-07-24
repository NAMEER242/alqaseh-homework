import * as Joi from 'joi';

export const discountCreateValidation = Joi.object({
  expiredAt: Joi.date().greater('now').required(),
  totalPriceLimit: Joi.number().positive().required(),
  value: Joi.number().positive().required(),
});

export const discountUpdateValidation = Joi.object({
  expiredAt: Joi.date().greater('now').required(),
  totalPriceLimit: Joi.number().positive().required(),
  value: Joi.number().positive().required(),
});

export const discountFilterValidation = Joi.object({
  limit: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});
