// backend/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { role, namaLengkap, email, password, noTelp, namaToko } = req.body;

  console.log('📝 Register request:', { role, namaLengkap, email, noTelp, namaToko });

  if (!role || !namaLengkap || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  // Validasi role
  if (!['admin', 'pengguna'].includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid!' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Gagal memproses password' });

   User.createUser(
      [role, namaLengkap, email, hashedPassword, noTelp || null, namaToko || null],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
          }
          return res.status(500).json({ message: 'Gagal register' });
        }

        const token = jwt.sign(
          { id: result.insertId, email, role },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'Register berhasil',
          token,
          user: {
            id: result.insertId,
            namaLengkap: namaLengkap,   // ← pakai variable langsung
            email,
            role,
            noTelp: noTelp || null,
            namaToko: namaToko || null,
            foto: null                   // ← user baru belum punya foto
          }
        });
      }
    );
  });
};

const login = (req, res) => {
  const { email, password, role } = req.body;

  console.log('🔐 Login attempt:', { email, role });

  if (!email || !password || !role) {
    return res.status(400).json({ 
      message: 'Email, password, dan role harus diisi' 
    });
  }

  User.findUserByEmailAndRole(email, role, (err, users) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan server' });
    }

    console.log('Users found:', users.length);

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Email atau password salah!' 
      });
    }

    const user = users[0];

    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.error('Bcrypt error:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server' });
      }

      if (!isValid) {
        return res.status(401).json({ 
          message: 'Email atau password salah!' 
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login berhasil',
        token: token,
        user: {
          id: user.id,
          namaLengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
          noTelp: user.no_telp,
          namaToko: user.nama_toko,
          foto: user.foto || null
        }
      });
    });
  });
};

module.exports = { register, login };