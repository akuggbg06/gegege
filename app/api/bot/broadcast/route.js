import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  
  try {
    const broadcasts = await getCollection('broadcasts');
    const active = await broadcasts.findOne({ is_active: true });
    
    if (!active || !active.message) {
      return Response.json({ message: null, active: false, alreadyShown: false });
    }
    
    let alreadyShown = false;
    if (username && active.shown_to && active.shown_to.includes(username)) {
      alreadyShown = true;
    }
    
    return Response.json({ 
      message: active.message, 
      active: true,
      alreadyShown,
      broadcastId: active._id.toString()
    });
  } catch (error) {
    console.error('Broadcast GET error:', error);
    return Response.json({ message: null, active: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const { message } = await req.json();
  
  if (!message) {
    return Response.json({ success: false, error: 'Message is required' }, { status: 400 });
  }
  
  try {
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
      shown_to: []
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Broadcast POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const { broadcastId, username } = await req.json();
  
  if (!broadcastId || !username) {
    return Response.json({ success: false, error: 'Missing broadcastId or username' }, { status: 400 });
  }
  
  try {
    const broadcasts = await getCollection('broadcasts');
    
    const result = await broadcasts.updateOne(
      { _id: new ObjectId(broadcastId), is_active: true },
      { $addToSet: { shown_to: username } }
    );
    
    return Response.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    console.error('Broadcast PUT error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
