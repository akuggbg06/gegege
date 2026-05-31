import { getCollection } from '@/lib/mongodb';

export async function POST(req) {
  const { message } = await req.json();
  const broadcasts = await getCollection('broadcasts');
  
  await broadcasts.insertOne({
    message,
    is_active: true,
    created_at: new Date()
  });
  
  return Response.json({ success: true });
}
