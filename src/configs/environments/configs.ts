import { registerAs } from '@nestjs/config';

export default registerAs('configs', () => ({
  app: {
    port: process.env.PORT,
  },
  database: {
    engine: process.env.DB_ENGINE,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    port: process.env.DB_PORT
  },
  blockchain: {
    host: process.env.BLOCKCHAIN_HOST,
    contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    encryptPass: process.env.ENCRYPT_PASS,
  },
  sqs: {
    url_t: process.env.SQS_T_URL,
    url_n: process.env.SQS_N_URL,
    accesKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sqs_endpoint_url: process.env.SQS_ENDPOINT_URL,
  },
}));
