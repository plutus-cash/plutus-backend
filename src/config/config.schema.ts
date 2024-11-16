import * as Joi from 'joi';

export type ConfigSchema = {
  BOT_TOKEN: string;
  WEBHOOK_DOMAIN: string;
  WEBHOOK_PATH: string;
  DATABASE_URL: string;
};

export const configValidationSchema = Joi.object<ConfigSchema>({
  BOT_TOKEN: Joi.string().required(),
  WEBHOOK_DOMAIN: Joi.string().uri().required(),
  WEBHOOK_PATH: Joi.string().required(),
  DATABASE_URL: Joi.string().uri().required(),
});
