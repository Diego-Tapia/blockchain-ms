import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().required(),
  DB_ENGINE: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  BLOCKCHAIN_HOST: Joi.string().required(),
  BLOCKCHAIN_CONTRACT_ADDRESS: Joi.string().required(),
  ENCRYPT_PASS: Joi.string().min(256).required(),
  AWS_SECRET_ACCESS_KEY:Joi.string().required(),
  AWS_ACCESS_KEY_ID:Joi.string().required(),
  SQS_T_URL: Joi.string().required(),
  SQS_N_URL: Joi.string().required(),
  AWS_REGION: Joi.string().required()
});
