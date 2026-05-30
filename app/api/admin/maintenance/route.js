import { getSessionFromRequest } from '../../../../lib/auth'
import { getMaintenanceStatus, setMaintenanceStatus } from '../../../../lib/telegram-db'
const OWNER_ID = parseInt(process.env.OWNER_ID || '0');

export async function GET(req) {
  const session = getSessionFromRequest(req);
  
  if (!session || session.username !== CONSTANTS.OWNER_ID.toString()) {
    return Response.json({ error: 'Bukan owner, kontol!' }, { status: 403 });
  }
  
  const status = await getMaintenanceStatus();
  return Response.json(status);
}

export async function POST(req) {
  const session = getSessionFromRequest(req);
  
  if (!session || session.username !== CONSTANTS.OWNER_ID.toString()) {
    return Response.json({ error: 'Bukan owner, kontol!' }, { status: 403 });
  }
  
  const { active } = await req.json();
  await setMaintenanceStatus(active);
  
  return Response.json({ success: true, active });
}
