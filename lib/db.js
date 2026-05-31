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
    total_images: 0,
    total_videos: 0
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

// ============ MEDIA OPERATIONS ============

export async function saveMedia(userId, username, fileId, messageId, mediaUrl, fileName, description, visibility, type, chatId) {
  const collection = type === 'video' ? 'videos' : 'images';
  const media = await getCollection(collection);
  
  const result = await media.insertOne({
    user_id: userId,
    username: username,
    file_id: fileId,
    telegram_message_id: messageId,
    telegram_chat_id: chatId,
    media_url: mediaUrl,
    file_name: fileName,
    description: description,
    visibility: visibility,
    type: type,
    uploaded_at: new Date(),
    is_deleted: false
  });
  
  // Update total count di user
  const users = await getCollection('users');
  const updateField = type === 'video' ? 'total_videos' : 'total_images';
  await users.updateOne(
    { username },
    { $inc: { [updateField]: 1 } }
  );
  
  return result.insertedId;
}

export async function getUserMedia(username) {
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  // Ambil semua media user (public, private, owner) yang belum dihapus
  const userImages = await images.find({ 
    username, 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  const userVideos = await videos.find({ 
    username, 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  // Format response
  const formattedImages = userImages.map(img => ({
    _id: img._id,
    id: img._id,
    username: img.username,
    media_url: img.media_url || img.image_url,
    description: img.description,
    visibility: img.visibility,
    type: 'image',
    uploaded_at: img.uploaded_at,
    file_name: img.file_name
  }));
  
  const formattedVideos = userVideos.map(vid => ({
    _id: vid._id,
    id: vid._id,
    username: vid.username,
    media_url: vid.media_url || vid.video_url,
    description: vid.description,
    visibility: vid.visibility,
    type: 'video',
    uploaded_at: vid.uploaded_at,
    file_name: vid.file_name
  }));
  
  return { images: formattedImages, videos: formattedVideos };
}

export async function getAllMedia() {
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  // Ambil semua media publik (bisa dilihat semua user)
  const publicImages = await images.find({ 
    visibility: 'public', 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  const publicVideos = await videos.find({ 
    visibility: 'public', 
    is_deleted: false 
  }).sort({ uploaded_at: -1 }).toArray();
  
  const formattedImages = publicImages.map(img => ({
    _id: img._id,
    id: img._id,
    username: img.username,
    media_url: img.media_url || img.image_url,
    description: img.description,
    visibility: img.visibility,
    type: 'image',
    uploaded_at: img.uploaded_at
  }));
  
  const formattedVideos = publicVideos.map(vid => ({
    _id: vid._id,
    id: vid._id,
    username: vid.username,
    media_url: vid.media_url || vid.video_url,
    description: vid.description,
    visibility: vid.visibility,
    type: 'video',
    uploaded_at: vid.uploaded_at
  }));
  
  return { images: formattedImages, videos: formattedVideos };
}

export async function deleteMedia(username, mediaId, type) {
  const collection = type === 'video' ? 'videos' : 'images';
  const media = await getCollection(collection);
  
  const mediaData = await media.findOne({ 
    _id: new ObjectId(mediaId), 
    username 
  });
  
  if (!mediaData) return false;
  
  // Hapus dari Telegram (grup storage atau grup private)
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
  
  try {
    await fetch(`${TG_API}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: mediaData.telegram_chat_id,
        message_id: parseInt(mediaData.telegram_message_id)
      })
    });
    console.log('Berhasil hapus dari Telegram');
  } catch (err) {
    console.error('Gagal hapus dari Telegram:', err);
  }
  
  // Soft delete dari database
  const result = await media.updateOne(
    { _id: new ObjectId(mediaId), username },
    { $set: { is_deleted: true } }
  );
  
  if (result.modifiedCount > 0) {
    const users = await getCollection('users');
    const updateField = type === 'video' ? 'total_videos' : 'total_images';
    await users.updateOne(
      { username },
      { $inc: { [updateField]: -1 } }
    );
  }
  
  return result.modifiedCount > 0;
}

export async function getMediaStats(username) {
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  const totalImages = await images.countDocuments({ 
    username, 
    is_deleted: false 
  });
  
  const totalVideos = await videos.countDocuments({ 
    username, 
    is_deleted: false 
  });
  
  const totalPublic = await images.countDocuments({ 
    username, 
    visibility: 'public', 
    is_deleted: false 
  }) + await videos.countDocuments({ 
    username, 
    visibility: 'public', 
    is_deleted: false 
  });
  
  const totalPrivate = await images.countDocuments({ 
    username, 
    visibility: 'private', 
    is_deleted: false 
  }) + await videos.countDocuments({ 
    username, 
    visibility: 'private', 
    is_deleted: false 
  });
  
  const totalOwner = await images.countDocuments({ 
    visibility: 'owner', 
    is_deleted: false 
  }) + await videos.countDocuments({ 
    visibility: 'owner', 
    is_deleted: false 
  });
  
  return {
    totalImages,
    totalVideos,
    totalPublic,
    totalPrivate,
    totalOwner
  };
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
    created_at: new Date(),
    shown_to: []
  });
  
  return true;
}

export async function markBroadcastShown(broadcastId, username) {
  const broadcasts = await getCollection('broadcasts');
  await broadcasts.updateOne(
    { _id: new ObjectId(broadcastId), is_active: true },
    { $addToSet: { shown_to: username } }
  );
  return true;
}

export async function getAllUsers() {
  const users = await getCollection('users');
  return await users.find({}).project({ password_hash: 0 }).toArray();
}

export async function getUserStats() {
  const users = await getCollection('users');
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  const totalUsers = await users.countDocuments();
  const totalImages = await images.countDocuments({ is_deleted: false });
  const totalVideos = await videos.countDocuments({ is_deleted: false });
  
  return { totalUsers, totalImages, totalVideos };
}
