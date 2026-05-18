const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Menjadikan folder 'uploads' bisa diakses publik (untuk gambar produk)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. IMPORT ROUTES 
const authRoutes = require("./routes/auth");
const produkRoutes = require("./routes/produk");
const chatRoutes = require("./routes/chat");
const profileRoutes = require("./routes/profile");
const notificationRoutes = require("./routes/notification");

// 3. DAFTARKAN ROUTES (Menggunakan path yang rapi)
// Sekarang semua URL akan seragam dan tidak bertabrakan
app.use("/api/auth", authRoutes); // Contoh: /api/auth/login
app.use("/api", authRoutes); // Alias: /api/login dan /api/register
app.use("/api/produk", produkRoutes); // Contoh: /api/produk/ (untuk ambil data)
app.use("/api/chat", chatRoutes); // Contoh: /api/chat/ (untuk pesan)
app.use("/api/profile", profileRoutes);
app.use("/api/notifikasi", notificationRoutes);

app.get("/api/profile/test", (req, res) => {
  res.json({ message: "Profile route aktif (server.js)" });
});

// 4. TEST KONEKSI API & DATABASE
app.get("/", (req, res) => {
  res.send("API Food Waste berjalan 🚀");
});

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek ke database MySQL:", err);
  } else {
    console.log("✅ Berhasil konek ke MySQL (Database: foodwaste)");
  }
});

// 5. ERROR HANDLER (Jika ada kesalahan di server)
app.use((err, req, res, next) => {
  console.error("🔥 ERROR SERVER:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan di server" });
});

// 6. ROUTE TIDAK DITEMUKAN
app.use((req, res) => {
  res.status(404).json({ message: "Alamat API tidak ditemukan" });
});

// 7. JALANKAN SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server jalan di http://localhost:${PORT}`);
  console.log(`📝 Cek Produk: GET http://localhost:${PORT}/api/produk`);
});
