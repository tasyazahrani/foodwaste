import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Import semua gambar lokal
import bgLeft from "../assets/image.png";
import bgRight from "../assets/image.png";
import peopleImg from "../assets/people.png";
import bawaImg from "../assets/bawah.png";
import lockImg from "../assets/lock.png";
import eyeImg from "../assets/eye.png";
import emailImg from "../assets/email.png";
import tokoImg from "../assets/toko.png";

// Icon SVG inline
const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    className="w-6 h-6 opacity-90 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.96 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 5.5 5.5l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const Register = () => {
  const navigate = useNavigate();
  const roleSelectId = useId();
  const namaLengkapId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const noTelpId = useId();
  const namaTokoId = useId();

  const [role, setRole] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [namaToko, setNamaToko] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = [
    { value: "pengguna", label: "Pengguna" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    
    // Validasi
    if (!role || !namaLengkap || !email || !password) {
      setErrorMessage("Semua field wajib diisi!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 🔥 HAPUS alamatToko dari sini
      const requestBody = {
        role,
        namaLengkap,
        email,
        password,
        noTelp: noTelp || null,
        namaToko: role === "admin" ? namaToko : null,
      };
      
      console.log("Mengirim data:", requestBody); // Debug log
      
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      console.log("Response:", data); // Debug log
      
      if (response.ok) {
        alert('Registrasi berhasil!');
        
        // Simpan token jika ada
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('userData', JSON.stringify(data.user));
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect sesuai role
        if (role === "admin") {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboarduser');
        }
      } else {
        setErrorMessage(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Tidak bisa konek ke server. Pastikan backend berjalan di http://localhost:3000');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (value) => {
    setRole(value);
    setDropdownOpen(false);
    setErrorMessage("");
  };

  const selectedLabel =
    roleOptions.find((o) => o.value === role)?.label || "Pilih Role";

  const isAdmin = role === "admin";

  const fieldClass =
    "relative w-full h-14 rounded-2xl flex items-center px-6 gap-4";
  const bgField = { backgroundColor: "rgba(99, 113, 78, 0.80)" };
  const inputClass =
    "flex-1 bg-transparent text-white placeholder-white text-sm outline-none font-poppins";

  return (
    <main className="relative w-screen h-screen bg-green-50 overflow-hidden flex items-center justify-center">
      <img
        className="absolute top-0 left-0 h-full w-auto object-cover pointer-events-none select-none opacity-80"
        alt=""
        src={bgLeft}
        aria-hidden="true"
      />
      <img
        className="absolute top-0 right-0 h-full w-auto object-cover pointer-events-none select-none opacity-60"
        alt=""
        src={bgRight}
        aria-hidden="true"
      />

      <section
        aria-labelledby="register-title"
        className="relative z-10 w-full max-w-lg mx-4 bg-white bg-opacity-75 rounded-3xl shadow-lg px-12 py-10 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <h1
          id="register-title"
          className="text-center text-4xl font-semibold text-green-800 leading-tight mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Daftar Akun
        </h1>
        <p
          className="text-center text-sm mb-8"
          style={{
            color: "rgba(66, 84, 37, 0.80)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Create your new Account
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Pilih Role */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full h-14 flex items-center gap-4 px-6 rounded-2xl text-white text-sm font-medium"
              style={bgField}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              disabled={isLoading}
            >
              <img
                src={peopleImg}
                alt=""
                aria-hidden="true"
                className="w-6 h-6 object-contain opacity-90"
              />
              <span id={roleSelectId} className="flex-1 text-left">
                {selectedLabel}
              </span>
              <img
                src={bawaImg}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 object-contain opacity-90"
              />
            </button>

            {dropdownOpen && !isLoading && (
              <ul
                role="listbox"
                className="absolute z-20 mt-1 w-full rounded-2xl shadow-lg overflow-hidden"
                style={{ backgroundColor: "#64714F" }}
              >
                {roleOptions.map((option) => (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={role === option.value}
                    onClick={() => handleRoleSelect(option.value)}
                    className="px-6 py-3 text-sm text-white cursor-pointer hover:bg-yellow-400 flex items-center gap-3 transition-colors"
                  >
                    <img
                      src={peopleImg}
                      alt=""
                      aria-hidden="true"
                      className="w-5 h-5 object-contain opacity-80"
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Nama Lengkap */}
          <div className={fieldClass} style={bgField}>
            <img
              src={peopleImg}
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain opacity-90"
            />
            <input
              id={namaLengkapId}
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Nama Lengkap"
              autoComplete="name"
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className={fieldClass} style={bgField}>
            <img
              src={emailImg}
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain opacity-90"
            />
            <input
              id={emailInputId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          {/* No. Telepon */}
          <div className={fieldClass} style={bgField}>
            <PhoneIcon />
            <input
              id={noTelpId}
              type="tel"
              value={noTelp}
              onChange={(e) => setNoTelp(e.target.value)}
              placeholder="No. Telepon"
              autoComplete="tel"
              inputMode="numeric"
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          {/* Kata Sandi */}
          <div className={fieldClass} style={bgField}>
            <img
              src={lockImg}
              alt=""
              aria-hidden="true"
              className="w-6 h-6 object-contain opacity-90"
            />
            <input
              id={passwordInputId}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              autoComplete="new-password"
              className={inputClass}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={isLoading}
            >
              <img
                src={eyeImg}
                alt=""
                aria-hidden="true"
                className="w-6 h-6 object-contain opacity-80"
              />
            </button>
          </div>

          {/* Field Admin - hanya Nama Toko, tanpa Alamat Toko */}
          {isAdmin && (
            <div className={fieldClass} style={bgField}>
              <img
                src={tokoImg}
                alt=""
                aria-hidden="true"
                className="w-6 h-6 object-contain opacity-90"
              />
              <input
                id={namaTokoId}
                type="text"
                value={namaToko}
                onChange={(e) => setNamaToko(e.target.value)}
                placeholder="Nama Toko"
                autoComplete="organization"
                className={inputClass}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-72 h-14 mx-auto mt-4 rounded-2xl text-white text-xl font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#F8BC22",
              fontFamily: "'Poppins', sans-serif",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p
          className="text-center text-xs text-gray-600 mt-12"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-gray-800 no-underline">
            Masuk
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;