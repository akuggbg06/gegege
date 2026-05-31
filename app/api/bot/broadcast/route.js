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
    created_at: new Date()
  });
  
  return Response.json({ success: true });
}

export async function GET() {
  const broadcasts = await getCollection('broadcasts');
  const active = await broadcasts.findOne({ is_active: true });
  
  return Response.json({ message: active?.message || null, active: !!active });
}
