# 💸 SakuMagang

Aplikasi web pencatat dan pengelola uang saku harian yang praktis, dirancang khusus untuk membantu teman-teman dan pejuang magang mengatur keuangan pribadi agar tidak boncos sebelum akhir bulan.

---

## ✨ Fitur Utama

- 📊 **Pelacakan Anggaran Real-time**: Pantau total uang saku, pengeluaran terpakai, dan sisa saldo harian/bulanan secara langsung.
- 🏷️ **Kategori Pengeluaran Dinamis**: Kelola pos anggaran per kategori (Makan, Transport, Kebutuhan Magang, Hiburan, dll) beserta batas maksimalnya.
- 📝 **Pencatatan Cepat & Riwayat**: Tambah transaksi harian dengan cepat, lengkap dengan catatan, tanggal, dan filter pencarian.
- 🪄 **Smart OCR / AI Input**: Kemudahan input pengeluaran pintar dengan bantuan Google Gemini API.
- 💾 **Local Storage Persistence**: Data tersimpan rapi dan aman di browser masing-masing tanpa perlu ribet login.
- 📱 **Mobile-First & Modern UI**: Tampilan bersih, intuitif, dan responsif dengan palet warna natural yang nyaman di mata.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Motion**: [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)

---

## 🚀 Cara Menjalankan Secara Lokal

Pastikan sudah menginstal **Node.js** (v18+ direkomendasikan).

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/moch-rizal/sakumagang.git
   cd sakumagang
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (Opsional untuk fitur AI):**
   Salin `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Lalu isi `GEMINI_API_KEY` dengan API Key dari [Google AI Studio](https://aistudio.google.com/).

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browsermu.

5. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Creator & Developer

Dibuat dengan ❤️ oleh **Arif (@moch-rizal)**  
- GitHub: [@moch-rizal](https://github.com/moch-rizal)  
- Status: Single 😁  
> *"Udah pinter ngatur duit, sekarang tinggal cari jodoh yang tepat biar masa depannya makin aman, hehe ✌️"*

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan personal & komunitas magang. Bebas digunakan dan dikembangkan kembali.
