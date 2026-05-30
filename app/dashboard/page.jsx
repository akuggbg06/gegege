'use client';

import ImageCard from '@/components/ImageCard'
import FloatingUpload from '@/components/FloatingUpload'
import BroadcastBanner from '@/components/BroadcastBanner'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadImages();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/auth/me');
    if (!res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setUser(data.user);
    }
  };

  const loadImages = async () => {
    const res = await fetch('/api/images');
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      loadImages();
    }
  };

  const handleDelete = async (imageId) => {
    const res = await fetch(`/api/images/${imageId}`, { method: 'DELETE' });
    if (res.ok) {
      setImages(images.filter(img => img.id !== imageId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <BroadcastBanner />
      
      <div className="container mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Galeri Kontol Lu</h1>
          <p className="text-gray-400 mt-2">Total {images.length} foto</p>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-xl">
            <p className="text-gray-400">Belum ada foto, kontol! Tekan tombol + buat upload</p>
          </div>
        ) : (
          <div className="image-grid">
            {images.map((img) => (
              <ImageCard key={img.id} image={img} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
      
      <FloatingUpload onUpload={handleUpload} />
    </>
  );
}
