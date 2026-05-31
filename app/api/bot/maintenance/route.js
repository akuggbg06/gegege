import { getCollection } from '@/lib/mongodb';

export async function POST(req) {
  const { active } = await req.json();
  const settings = await getCollection('settings');
  
  await settings.updateOne(
    { key: 'maintenance' },
    { $set: { value: active ? 'active' : 'inactive', updated_at: new Date() } },
    { upsert: true }
  );
  
  return Response.json({ success: true, active });
}

export async function GET() {
  const settings = await getCollection('settings');
  const maintenance = await settings.findOne({ key: 'maintenance' });
  
  return Response.json({ active: maintenance?.value === 'active' });
}
