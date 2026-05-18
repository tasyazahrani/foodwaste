const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

/* =========================
   UPLOAD FOTO
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + cleanName);
  },
});

const upload = multer({ storage });

/* =========================
   TEST ROUTE
========================= */
router.get("/test", (req, res) => {
  res.json({ message: "Profile route aktif" });
});

/* =========================
   GET PROFILE
========================= */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT id, role, nama_lengkap, email, no_telp, nama_toko, foto, alamat
    FROM users WHERE id = ?`,
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal ambil profil" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.json(result[0]);
    },
  );
});

/* =========================
   UPDATE PROFILE (EDIT PROFIL)
========================= */
router.put("/:id", upload.single("foto"), (req, res) => {
  const { id } = req.params;

  const { nama_lengkap, email, no_telp, nama_toko, alamat } = req.body;

  const foto = req.file ? req.file.filename : null;

  let sql = `
    UPDATE users
    SET nama_lengkap = ?, email = ?, no_telp = ?, nama_toko = ?, alamat = ?
  `;

  const params = [
    nama_lengkap,
    email,
    no_telp || null,
    nama_toko || null,
    alamat || null,
  ];

  if (foto) {
    sql += ", foto = ?";
    params.push(foto);
  }

  sql += " WHERE id = ?";
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal update profil" });
    }

    res.json({
      message: "Profil berhasil diupdate",
      foto: foto,
    });
  });
});

/* =========================
   GANTI PASSWORD
========================= */
router.put("/password/:id", (req, res) => {
  const { id } = req.params;
  const { lama, baru, konfirmasi } = req.body;

  if (!lama || !baru || !konfirmasi) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  if (baru !== konfirmasi) {
    return res.status(400).json({ message: "Password tidak cocok" });
  }

  db.query("SELECT password FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error server" });

    if (result.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = result[0];

    bcrypt.compare(lama, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Error server" });

      if (!isMatch) {
        return res.status(400).json({ message: "Password lama salah" });
      }

      bcrypt.hash(baru, 10, (err, hashedPassword) => {
        if (err)
          return res.status(500).json({ message: "Gagal hash password" });

        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, id],
          (err) => {
            if (err)
              return res.status(500).json({ message: "Gagal update password" });

            res.json({ message: "Password berhasil diubah" });
          },
        );
      });
    });
  });
});

module.exports = router;
