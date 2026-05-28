import { CONSTANTS } from '@/lib/constants';

export async function POST(req) {
  const body = await req.json();
  
  // Handle webhook dari bot (opsional)
  console.log('Webhook received:', body);
  
  return Response.json({ ok: true });
}
