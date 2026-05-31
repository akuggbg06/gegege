import { getCollection } from '@/lib/mongodb';

export async function GET() {
  const users = await getCollection('users');
  const allUsers = await users.find({}).project({ password_hash: 0 }).toArray();
  return Response.json(allUsers);
}
