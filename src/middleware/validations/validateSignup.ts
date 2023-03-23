import Joi from 'joi';
import { NextFunction, Request, Response } from 'express'

const schema = Joi.object().keys({
  userName: Joi.string()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string()
    .email(),
  password: Joi.string()
 .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirmPassword: Joi.ref('password'),
});

export const validateSignUp = async (req: Request, res: Response, next: NextFunction) => {
    await schema.validateAsync(req.body);
    next()
  
};
export default validateSignUp;
