export const CONSTANTS = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  STORAGE_GROUP_ID: process.env.STORAGE_GROUP_ID || '',
  DB_GROUP_ID: process.env.DB_GROUP_ID || '',
  LOG_GROUP_ID: process.env.LOG_GROUP_ID || '',
  OWNER_ID: parseInt(process.env.OWNER_ID || '0'),
  JWT_SECRET: process.env.JWT_SECRET || 'rahasia_kontol'
};
