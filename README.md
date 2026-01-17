# MyBooTime

PWA Task Reminder dengan notifikasi text-to-speech.

## Fitur

- ✅ CRUD Task (Create, Read, Update, Delete)
- 🔔 Notifikasi otomatis dengan text-to-speech
- 💾 Penyimpanan lokal (localStorage)
- 📱 Progressive Web App (PWA)
- 🎨 Design minimalis dengan gradient pink-blue
- 🌐 Offline support

## Cara Menjalankan

1. Install dependencies:
```bash
bun install
```

2. Jalankan development server:
```bash
bun run dev
```

3. Buka browser di `http://localhost:3000`

## Build untuk Production

```bash
bun run build
bun start
```

## Cara Menggunakan

1. Klik "Tambah Task Baru"
2. Isi judul task, deskripsi (opsional), dan waktu reminder
3. Task akan memberi notifikasi suara saat waktunya tiba
4. Centang task yang sudah selesai
5. Edit atau hapus task sesuai kebutuhan

## Teknologi

- Next.js 14
- TypeScript
- Tailwind CSS
- PWA (next-pwa)
- Web Speech API
- LocalStorage API
