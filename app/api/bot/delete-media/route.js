import { getCollection } from '@/lib/mongodb';

export async function POST(req) {
  const { messageId, link } = await req.json();
  const images = await getCollection('images');
  
  const result = await images.deleteOne({ telegram_message_id: String(messageId) });
  return Response.json({ success: result.deletedCount > 0 });
}
