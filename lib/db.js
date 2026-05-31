import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

// ============ USER OPERATIONS ============

export async function saveUser(username, email, passwordHash) {
  const users = await getCollection('users');
  
  const existingUser = await users.findOne({ 
    $or: [{ username }, { email }] 
  });
  
  if (existingUser) {
    throw new Error('Username atau email sudah terdaftar');
  }
  
  const result = await users.insertOne({
    username,
    email,
    password_hash: passwordHash,
    is_active: true,
    created_at: new Date(),
    last_login: null,
    total_images: 0
  });
  
  return result.insertedId;
}

export async function getUserByUsername(username) {
  const users = await getCollection('users');
  return await users.findOne({ username });
}

export async function getUserByEmail(email) {
  const users = await getCollection('users');
  return await users.findOne({ email });
}

export async function getUserById(id) {
  const users = await getCollection('users');
  return await users.findOne({ _id: new ObjectId(id) });
}

export async function updateLastLogin(username) {
  const users = await getCollection('users');
  await users.updateOne(
    { username },
    { $set: { last_login: new Date() } }
  );
}

export async function saveMedia(userId, username, fileId, messageId, mediaUrl, fileName, description, visibility, type) {
  const collection = type === 'video' ? 'videos' : 'images';
  const media = await getCollection(collection);
  
  const result = await media.insertOne({
    user_id: userId,
    username: username,
    file_id: fileId,
    telegram_message_id: messageId,
    [`${type}_url`]: mediaUrl,
    file_name: fileName,
    description: description,
    visibility: visibility,
    type: type,
    uploaded_at: new Date(),
    is_deleted: false
  });
  
  return result.insertedId;
}

export async function getUserMedia(username) {
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  const userImages = await images.find({ 
    username, 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  const userVideos = await videos.find({ 
    username, 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  return { images: userImages, videos: userVideos };
}

export async function deleteMedia(username, mediaId, type) {
  const collection = type === 'video' ? 'videos' : 'images';
  const media = await getCollection(collection);
  
  const result = await media.updateOne(
    { _id: new ObjectId(mediaId), username },
    { $set: { is_deleted: true } }
  );
  
  return result.modifiedCount > 0;
}

// ============ IMAGE OPERATIONS ============

export async function saveImage(userId, username, fileId, messageId, imageUrl, imageName) {
  const images = await getCollection('images');
  
  const result = await images.insertOne({
    user_id: userId,
    username: username,
    file_id: fileId,
    telegram_message_id: messageId,
    image_url: imageUrl,
    image_name: imageName,
    uploaded_at: new Date(),
    is_deleted: false
  });
  
  const users = await getCollection('users');
  await users.updateOne(
    { username },
    { $inc: { total_images: 1 } }
  );
  
  return result.insertedId;
}

export async function getUserImages(username) {
  const images = await getCollection('images');
  return await images.find({ 
    username, 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
}

export async function deleteImageFromDB(username, imageId) {
  const images = await getCollection('images');
  
  const image = await images.findOne({ 
    _id: new ObjectId(imageId), 
    username 
  });
  
  if (!image) return false;
  
  await images.updateOne(
    { _id: new ObjectId(imageId) },
    { $set: { is_deleted: true } }
  );
  
  const users = await getCollection('users');
  await users.updateOne(
    { username },
    { $inc: { total_images: -1 } }
  );
  
  return true;
}

// ============ MAINTENANCE & BROADCAST ============

export async function getMaintenanceStatus() {
  const settings = await getCollection('settings');
  const maintenance = await settings.findOne({ key: 'maintenance' });
  return { active: maintenance?.value === 'active', timestamp: maintenance?.updated_at };
}

export async function setMaintenanceStatus(active) {
  const settings = await getCollection('settings');
  await settings.updateOne(
    { key: 'maintenance' },
    { $set: { value: active ? 'active' : 'inactive', updated_at: new Date() } },
    { upsert: true }
  );
  return true;
}

export async function getActiveBroadcast() {
  const broadcasts = await getCollection('broadcasts');
  return await broadcasts.findOne({ is_active: true });
}

export async function saveBroadcast(message) {
  const broadcasts = await getCollection('broadcasts');
  
  await broadcasts.updateMany(
    { is_active: true },
    { $set: { is_active: false } }
  );
  
  await broadcasts.insertOne({
    message,
    is_active: true,
    created_at: new Date()
  });
  
  return true;
}

export async function getAllUsers() {
  const users = await getCollection('users');
  return await users.find({}).project({ password_hash: 0 }).toArray();
}
