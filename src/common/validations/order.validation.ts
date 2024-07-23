import * as Joi from 'joi';
import { PaymentMethod } from '@qaseh/enums';

export const orderUpdateValidation = Joi.object({
  orderPrice: Joi.number().positive(),
  discount: Joi.number().positive(),
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)),
  productIds: Joi.array().items(Joi.number().positive()),
});

export const customerOrderCreateValidation = Joi.object({
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
  productIds: Joi.array().items(Joi.number().positive()).required(),
});

export const customerOrderUpdateValidation = Joi.object({
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)),
  productIds: Joi.array().items(Joi.number().positive()),
});

export const orderFilterValidation = Joi.object({
  limit: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});
