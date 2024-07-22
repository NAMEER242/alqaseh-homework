import * as Joi from 'joi';
import { PaymentMethod } from '@qaseh/enums';

export const orderCreateValidation = Joi.object({
  orderPrice: Joi.number().positive().required(),
  discount: Joi.number().positive().required(),
  paymentMethod: Joi.string()
    .valid(...Object.values(PaymentMethod))
    .required(),
});

export const orderUpdateValidation = Joi.object({
  orderPrice: Joi.number().positive(),
  discount: Joi.number().positive(),
  paymentMethod: Joi.string().valid(...Object.values(PaymentMethod)),
});

export const orderFilterValidation = Joi.object({
  limit: Joi.number().positive().default(10),
  page: Joi.number().positive().default(1),
});
