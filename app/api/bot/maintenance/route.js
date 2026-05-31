import { getCollection } from '@/lib/mongodb';

export async function POST(req) {
  const { active } = await req.json();
  const settings = await getCollection('settings');
  await settings.updateOne(
    { key: 'maintenance' },
    { $set: { value: active ? 'active' : 'inactive', updated_at: new Date() } },
    { upsert: true }
  );
  return Response.json({ success: true });
}
