import { getCollection } from '@/lib/mongodb';

export async function POST(req) {
  const { message } = await req.json();
  const broadcasts = await getCollection('broadcasts');
  
  // Nonaktifkan broadcast lama
  await broadcasts.updateMany(
    { is_active: true },
    { $set: { is_active: false } }
  );
  
  // Tambah broadcast baru
  await broadcasts.insertOne({
    message,
    is_active: true,
    created_at: new Date(),
    shown_to: [] // Array buat nyimpan user yang udah liat
  });
  
  return Response.json({ success: true });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  
  const broadcasts = await getCollection('broadcasts');
  const active = await broadcasts.findOne({ is_active: true });
  
  if (!active || !active.message) {
    return Response.json({ message: null, active: false });
  }
  
  // Cek apakah user ini sudah pernah liat broadcast ini
  const alreadyShown = active.shown_to?.includes(username) || false;
  
  return Response.json({ 
    message: active.message, 
    active: true,
    alreadyShown,
    broadcastId: active._id.toString()
  });
}

export async function PUT(req) {
  const { broadcastId, username } = await req.json();
  const broadcasts = await getCollection('broadcasts');
  
  await broadcasts.updateOne(
    { _id: new ObjectId(broadcastId), is_active: true },
    { $addToSet: { shown_to: username } }
  );
  
  return Response.json({ success: true });
}
