export async function POST() {
  try {
    // Hapus cookie dengan set tanggal expired
    const response = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Terjadi kesalahan, Bos!' }, { status: 500 });
  }
}
