import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Import gambar
import bgLeft from "../assets/image.png";
import bgRight from "../assets/image.png";
import peopleImg from "../assets/people.png";
import bawaImg from "../assets/bawah.png";
import lockImg from "../assets/lock.png";
import eyeImg from "../assets/eye.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

export const Login = () => {
  const navigate = useNavigate();
  const emailInputId = useId();
  const passwordInputId = useId();
  const rememberMeId = useId();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "pengguna", label: "Pengguna" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!role) {
      setErrorMessage("Silakan pilih role terlebih dahulu!");
      return;
    }

    if (!email) {
      setErrorMessage("Email harus diisi!");
      return;
    }

    if (!password) {
      setErrorMessage("Password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data);

        // Simpan ke storage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.token);
        storage.setItem("userRole", data.user.role);
        storage.setItem("userData", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect
        if (data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/dashboarduser", { replace: true });
        }
      } else {
        setErrorMessage(
          data.message || "Login gagal! Periksa email dan password Anda.",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        "Tidak dapat terhubung ke server Railway. Pastikan server sedang berjalan dan coba lagi.",
      );
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

  return (
    <main className="relative w-screen h-screen bg-green-50 overflow-hidden flex items-center justify-center">
      <img
        className="absolute top-0 left-0 h-full w-auto max-w-none object-cover pointer-events-none select-none opacity-80"
        alt=""
        src={bgLeft}
      />
      <img
        className="absolute top-0 right-0 h-full w-auto max-w-none object-cover pointer-events-none select-none opacity-60"
        alt=""
        src={bgRight}
      />

      <section className="relative z-10 w-full max-w-lg mx-4 bg-white bg-opacity-75 rounded-3xl shadow-lg px-12 py-10">
        <h1 className="text-center text-4xl font-semibold text-green-800 mb-1">
          Selamat Datang
        </h1>
        <p className="text-center text-sm text-green-700 text-opacity-80 mb-8">
          Login to your Account
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dropdown Role */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-14 flex items-center gap-4 px-6 rounded-2xl text-white text-sm font-medium bg-[#63714ecc]"
              disabled={isLoading}
            >
              <img src={peopleImg} alt="" className="w-6 h-6 opacity-90" />
              <span className="flex-1 text-left">{selectedLabel}</span>
              <img src={bawaImg} alt="" className="w-5 h-5 opacity-90" />
            </button>

            {dropdownOpen && !isLoading && (
              <ul className="absolute z-20 mt-1 w-full bg-[#64714F] rounded-2xl shadow-lg overflow-hidden">
                {roleOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleRoleSelect(option.value)}
                    className="px-6 py-3 text-sm text-white cursor-pointer hover:bg-yellow-400 flex items-center gap-3"
                  >
                    <img
                      src={peopleImg}
                      alt=""
                      className="w-5 h-5 opacity-70"
                    />
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Email */}
          <div className="w-full h-14 bg-[#63714ecc] rounded-2xl flex items-center px-6 gap-4">
            <img src={peopleImg} alt="" className="w-6 h-6 opacity-90" />
            <input
              id={emailInputId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 bg-transparent text-white placeholder-white text-sm outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="w-full h-14 bg-[#63714ecc] rounded-2xl flex items-center px-6 gap-4">
            <img src={lockImg} alt="" className="w-6 h-6 opacity-90" />
            <input
              id={passwordInputId}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              className="flex-1 bg-transparent text-white placeholder-white text-sm outline-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <img src={eyeImg} alt="" className="w-6 h-6 opacity-80" />
            </button>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <input
                id={rememberMeId}
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-72 h-14 mx-auto mt-2 bg-yellow-400 rounded-2xl text-white text-xl font-medium shadow-md hover:bg-yellow-500 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-12">
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-gray-800">
            Daftar
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
