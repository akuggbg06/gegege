import { CONSTANTS } from './constants';

const TG_API = `https://api.telegram.org/bot${CONSTANTS.BOT_TOKEN}`;

async function tgRequest(method, body = {}) {
  try {
    const response = await fetch(`${TG_API}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    return { ok: false };
  }
}

export async function getUserByUsername(username) {
  // Implementasi sederhana dulu
  return null;
}

export async function getUserImages(userId) {
  return [];
}

export async function saveUser(username, email, passwordHash) {
  return true;
}

export async function saveImage(userId, username, fileId, messageId, imageUrl, imageName) {
  return true;
}

export async function deleteImageFromDB(userId, imageId) {
  return true;
}

export async function getActiveBroadcast() {
  return null;
}

export async function saveBroadcast(message) {
  return true;
}

export async function getMaintenanceStatus() {
  return { active: false };
}

export async function setMaintenanceStatus(active) {
  return true;
}
