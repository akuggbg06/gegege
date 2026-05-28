# Zexzo Storage - Telegram-Based Image Hosting

## Setup Cepat

### 1. Environment Variables (di Vercel)
- `BOT_TOKEN`: Token bot Telegram lu
- `STORAGE_GROUP_ID`: ID grup buat nyimpen foto
- `DB_GROUP_ID`: ID grup private buat database
- `LOG_GROUP_ID`: ID grup buat log
- `OWNER_ID`: ID Telegram lu
- `JWT_SECRET`: Secret key (bikin random 64 karakter)

### 2. Deploy ke Vercel
```bash
git push origin main
# Nanti otomatis ke detect sama Vercel
# Di terminal lokal Anda
git commit --allow-empty -m "fix: trigger clean build without cache"
git push origin main
