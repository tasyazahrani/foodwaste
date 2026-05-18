const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "ballast.proxy.rlwy.net",
  user: "root",
  password: "cCmfPJBPpfUlbewEtlPzcVjILRLDTBaw",
  database: "railway",
  port: 16135
});

db.connect((err) => {
  if (err) {
    console.log("❌ Koneksi gagal:", err);
  } else {
    console.log("✅ Connected ke Railway MySQL");
  }
});

module.exports = db;