// KONFIGURASI - GANTI PAKE PUNYA LU, KONTOL!
export const CONSTANTS = {
  // ID GRUP TELEGRAM
  STORAGE_GROUP_ID: process.env.STORAGE_GROUP_ID || '-1003741716449', // Grup buat nyimpen foto
  DB_GROUP_ID: process.env.DB_GROUP_ID || '-1003978678024', // Grup private buat database user
  LOG_GROUP_ID: process.env.LOG_GROUP_ID || '-1003995082275', // Grup buat log
  
  // BOT
  BOT_TOKEN: process.env.BOT_TOKEN || '8611646600:AAHpaN1PCkb7fORdJ_tAUBwC7RTSGarSPYA',
  
  // AUTH
  JWT_SECRET: process.env.JWT_SECRET || 'rahasia_kontol_64_character_ubah_ini_kontol',
  
  // OWNER
  OWNER_ID: parseInt(process.env.OWNER_ID || '8436494440'),
  
  // APP
  APP_NAME: 'Zexzo Storage',
  APP_VERSION: '2.0'
};
