const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// static folder (UPLOADS)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const produkRoutes = require("./routes/produk");
const chatRoutes = require("./routes/chat");
const profileRoutes = require("./routes/profile");
const notificationRoutes = require("./routes/notification");

app.use("/api/auth", authRoutes);
app.use("/api", authRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifikasi", notificationRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Food Waste berjalan 🚀");
});

// ================= DATABASE CONNECT =================
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Error:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR SERVER:", err.stack);
  res.status(500).json({ message: "Terjadi kesalahan di server" });
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ message: "Alamat API tidak ditemukan" });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server jalan di port ${PORT}`);
  console.log(`📝 Cek Produk: /api/produk`);
});