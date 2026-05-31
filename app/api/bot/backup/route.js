import { getCollection } from '@/lib/mongodb';

export async function GET() {
  const users = await getCollection('users');
  const images = await getCollection('images');
  const videos = await getCollection('videos');
  
  const backup = {
    users: await users.find({}).project({ password_hash: 0 }).toArray(),
    images: await images.find({}).toArray(),
    videos: await videos.find({}).toArray(),
    timestamp: new Date()
  };
  
  return Response.json(backup);
}
