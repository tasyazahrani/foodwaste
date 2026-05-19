const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// upload folder
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// GET ALL
router.get("/", (req, res) => {
  db.query(
    `SELECT p.*, u.nama_toko
     FROM produk p
     LEFT JOIN users u ON p.id_toko = u.id
     ORDER BY p.id_produk DESC`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// GET BY TOKO
router.get("/toko/:id", (req, res) => {
  db.query(
    `SELECT p.*, u.nama_toko
     FROM produk p
     LEFT JOIN users u ON p.id_toko = u.id
     WHERE p.id_toko = ?
     ORDER BY p.id_produk DESC`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ADD
router.post("/", upload.single("image"), (req, res) => {
  const {
    nama_produk,
    harga,
    deskripsi,
    id_toko,
    expired_date,
    harga_diskon,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  db.query(
    `INSERT INTO produk
    (nama_produk, harga, deskripsi, id_toko, image, expired_date, harga_diskon)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nama_produk,
      harga,
      deskripsi,
      id_toko,
      image,
      expired_date,
      harga_diskon,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Gagal tambah produk" });
      }
      res.json({ message: "Produk berhasil ditambah" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM produk WHERE id_produk=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

// UPDATE
router.put("/:id", upload.single("image"), (req, res) => {
  const {
    nama_produk,
    harga,
    deskripsi,
    expired_date,
    harga_diskon,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  let sql = `
    UPDATE produk SET
    nama_produk=?,
    harga=?,
    deskripsi=?,
    expired_date=?,
    harga_diskon=?
  `;

  const params = [
    nama_produk,
    harga,
    deskripsi,
    expired_date,
    harga_diskon,
  ];

  if (image) {
    sql += ", image=?";
    params.push(image);
  }

  sql += " WHERE id_produk=?";
  params.push(req.params.id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated" });
  });
});

module.exports = router;