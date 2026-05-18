const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "ballast.proxy.rlwy.net",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "cCmfPJBPpfUlbewEtlPzcVjILRLDTBaw",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 16135
});

db.connect((err) => {
  if (err) {
    console.error("❌ Koneksi gagal:", err.message);
    return;
  }
  console.log("✅ Connected ke Railway MySQL");
});

db.on("error", (err) => {
  console.error("DB ERROR:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    db.connect();
  }
});

module.exports = db;