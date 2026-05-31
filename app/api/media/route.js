import { verifyToken } from '@/lib/auth';
import { getCollection } from '@/lib/mongodb';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const images = await getCollection('images');
    const videos = await getCollection('videos');
    
    // Ambil semua media user (yang belum dihapus)
    const userImages = await images.find({ 
      username: decoded.username,
      is_deleted: { $ne: true }
    }).sort({ uploaded_at: -1 }).toArray();
    
    const userVideos = await videos.find({ 
      username: decoded.username,
      is_deleted: { $ne: true }
    }).sort({ uploaded_at: -1 }).toArray();
    
    // Format response
    const formattedImages = userImages.map(img => ({
      _id: img._id,
      id: img._id,
      type: 'image',
      media_url: img.image_url || img.media_url,
      description: img.description,
      visibility: img.visibility || 'public',
      username: img.username,
      uploaded_at: img.uploaded_at
    }));
    
    const formattedVideos = userVideos.map(vid => ({
      _id: vid._id,
      id: vid._id,
      type: 'video',
      media_url: vid.video_url || vid.media_url,
      description: vid.description,
      visibility: vid.visibility || 'public',
      username: vid.username,
      uploaded_at: vid.uploaded_at
    }));
    
    return Response.json({ 
      images: formattedImages, 
      videos: formattedVideos 
    });
  } catch (error) {
    console.error('Media API error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
