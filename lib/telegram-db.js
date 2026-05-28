import { CONSTANTS } from './constants';

// API TELEGRAM
const TG_API = `https://api.telegram.org/bot${CONSTANTS.BOT_TOKEN}`;

async function tgRequest(method, body = {}) {
  const response = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return response.json();
}

// ============ USER OPERATIONS ============

export async function saveUser(username, email, passwordHash) {
  const message = `USER:${username}|${email}|${passwordHash}|${Date.now()}|active`;
  
  await tgRequest('sendMessage', {
    chat_id: CONSTANTS.DB_GROUP_ID,
    text: message
  });
  
  await logActivity(`User baru terdaftar: ${username} (${email})`);
  return true;
}

export async function getUserByUsername(username) {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 500);
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith(`USER:${username}|`)) {
      const parts = msg.text.replace('USER:', '').split('|');
      return {
        username: parts[0],
        email: parts[1],
        passwordHash: parts[2],
        createdAt: parts[3],
        status: parts[4]
      };
    }
  }
  return null;
}

export async function getUserByEmail(email) {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 500);
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('USER:')) {
      const parts = msg.text.replace('USER:', '').split('|');
      if (parts[1] === email) {
        return {
          username: parts[0],
          email: parts[1],
          passwordHash: parts[2],
          createdAt: parts[3],
          status: parts[4]
        };
      }
    }
  }
  return null;
}

// ============ IMAGE OPERATIONS ============

export async function saveImage(userId, username, fileId, messageId, imageUrl, imageName) {
  const message = `IMG:${userId}|${username}|${fileId}|${messageId}|${imageUrl}|${imageName}|${Date.now()}`;
  
  await tgRequest('sendMessage', {
    chat_id: CONSTANTS.DB_GROUP_ID,
    text: message
  });
  
  await logActivity(`User ${username} upload foto: ${imageName}`);
  return true;
}

export async function getUserImages(userId) {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 1000);
  const images = [];
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith(`IMG:${userId}|`)) {
      const parts = msg.text.replace(`IMG:${userId}|`, '').split('|');
      images.push({
        id: msg.message_id,
        username: parts[0],
        fileId: parts[1],
        telegramMessageId: parts[2],
        imageUrl: parts[3],
        imageName: parts[4],
        uploadedAt: parts[5]
      });
    }
  }
  
  return images.sort((a, b) => parseInt(b.uploadedAt) - parseInt(a.uploadedAt));
}

export async function deleteImageFromDB(userId, imageId) {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 1000);
  
  for (const msg of messages) {
    if (msg.text && msg.text.includes(`IMG:${userId}|`) && msg.message_id == imageId) {
      await tgRequest('deleteMessage', {
        chat_id: CONSTANTS.DB_GROUP_ID,
        message_id: msg.message_id
      });
      
      // Ekstrak telegram message ID dari grup storage
      const parts = msg.text.split('|');
      const storageMessageId = parts[4]; // telegramMessageId posisi ke-4
      
      // Hapus dari grup storage
      await tgRequest('deleteMessage', {
        chat_id: CONSTANTS.STORAGE_GROUP_ID,
        message_id: parseInt(storageMessageId)
      });
      
      await logActivity(`User ${userId} hapus foto ID: ${imageId}`);
      return true;
    }
  }
  return false;
}

// ============ MAINTENANCE & BROADCAST ============

export async function getMaintenanceStatus() {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 100);
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('MAINTENANCE:')) {
      const parts = msg.text.replace('MAINTENANCE:', '').split('|');
      return { active: parts[0] === 'active', timestamp: parts[1] };
    }
  }
  return { active: false, timestamp: null };
}

export async function setMaintenanceStatus(active) {
  // Hapus maintenance message lama
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 100);
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('MAINTENANCE:')) {
      await tgRequest('deleteMessage', {
        chat_id: CONSTANTS.DB_GROUP_ID,
        message_id: msg.message_id
      });
    }
  }
  
  const message = `MAINTENANCE:${active ? 'active' : 'inactive'}|${Date.now()}`;
  await tgRequest('sendMessage', {
    chat_id: CONSTANTS.DB_GROUP_ID,
    text: message
  });
  
  await logActivity(`Maintenance mode: ${active ? 'AKTIF' : 'NONAKTIF'}`);
  return true;
}

export async function getActiveBroadcast() {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 200);
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('BC:')) {
      const parts = msg.text.replace('BC:', '').split('|');
      if (parts[2] === 'active') {
        return { message: parts[0], timestamp: parts[1], active: true };
      }
    }
  }
  return null;
}

export async function saveBroadcast(message) {
  // Nonaktifkan broadcast lama
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 200);
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('BC:') && msg.text.includes('|active')) {
      const newText = msg.text.replace('|active', '|inactive');
      // Edit message (telegram ga support edit, jadi delete + create baru)
      await tgRequest('deleteMessage', {
        chat_id: CONSTANTS.DB_GROUP_ID,
        message_id: msg.message_id
      });
    }
  }
  
  const broadcastMsg = `BC:${message}|${Date.now()}|active`;
  await tgRequest('sendMessage', {
    chat_id: CONSTANTS.DB_GROUP_ID,
    text: broadcastMsg
  });
  
  await logActivity(`Broadcast baru: ${message}`);
  return true;
}

export async function getAllUsers() {
  const messages = await getChatHistory(CONSTANTS.DB_GROUP_ID, 2000);
  const users = [];
  
  for (const msg of messages) {
    if (msg.text && msg.text.startsWith('USER:')) {
      const parts = msg.text.replace('USER:', '').split('|');
      users.push({
        username: parts[0],
        email: parts[1],
        createdAt: parts[3],
        status: parts[4]
      });
    }
  }
  
  return users;
}

// ============ HELPER ============

async function getChatHistory(chatId, limit = 500) {
  try {
    const result = await tgRequest('getChatHistory', {
      chat_id: chatId,
      limit: limit
    });
    return result.ok ? result.result : [];
  } catch (error) {
    console.error('Gagal ambil history:', error);
    return [];
  }
}

async function logActivity(message) {
  try {
    await tgRequest('sendMessage', {
      chat_id: CONSTANTS.LOG_GROUP_ID,
      text: `[${new Date().toISOString()}] ${message}`
    });
  } catch (error) {
    console.error('Log gagal:', error);
  }
  }
