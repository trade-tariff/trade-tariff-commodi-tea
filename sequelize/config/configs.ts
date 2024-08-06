import dotenv from 'dotenv';

dotenv.config({ path: `.env` });

export const {
  DB_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_HOST,
  POSTGRES_DB,
} = {...process.env } as { [key: string]: string };
