import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  Bell,
  ChevronDown,
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Store,
  MapPin,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

// ─── Modal Backdrop ───────────────────────────────────────────────────────────
function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {children}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ onClose, onConfirm }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <div className="w-14 h-14 bg-[#f8bc22]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Save size={24} className="text-[#f8bc22]" />
        </div>
        <h2 className="font-black text-[#63714e] text-lg mb-2">
          Simpan Perubahan?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Informasi admin akan diperbarui.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-[#f8bc22] text-white text-sm font-semibold hover:bg-[#e6ac10] transition"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ onDone }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <div className="w-14 h-14 bg-[#63714e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-[#63714e]" />
        </div>
        <h2 className="font-black text-[#63714e] text-lg mb-2">
          Profil Disimpan!
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Profil admin berhasil diperbarui.
        </p>
        <button
          onClick={onDone}
          className="w-full py-2 rounded-xl bg-[#63714e] text-white text-sm font-semibold hover:bg-[#4f5c3c] transition"
        >
          Selesai
        </button>
      </div>
    </Backdrop>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ icon, label, name, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#63714e]/70 uppercase tracking-wide">
        {label}
      </label>
      <div className="bg-[#7d8767] rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#f8bc22] transition">
        <div className="text-white shrink-0">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white text-sm placeholder-white/50"
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const EditProfilAdmin = () => {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedFoto, setSelectedFoto] = useState(null);
  const [avatar, setAvatar] = useState(userProfil);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_telp: "",
    nama_toko: "",
    alamat: "",
  });

  // ─── Load data dari localStorage (hasil register) ─────────────────────────
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    setUserId(user.id);

    // Isi form dari localStorage dulu (data register)
    setFormData({
      nama_lengkap: user.nama_lengkap || "",
      email:        user.email        || "",
      no_telp:      user.no_telp      || "",
      nama_toko:    user.nama_toko    || "",
      alamat:       user.alamat       || "",
    });

    if (user.foto) {
      setAvatar(`${BASE_URL}/uploads/${user.foto}`);
    }

    // Fetch API untuk data terbaru dari DB
    fetch(`${BASE_URL}/api/profile/${user.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch profil");
        return res.json();
      })
      .then((data) => {
        setFormData({
          nama_lengkap: data.nama_lengkap || user.nama_lengkap || "",
          email:        data.email        || user.email        || "",
          no_telp:      data.no_telp      || user.no_telp      || "",
          nama_toko:    data.nama_toko    || user.nama_toko    || "",
          alamat:       data.alamat       || user.alamat       || "",
        });

        if (data.foto) {
          setAvatar(`${BASE_URL}/uploads/${data.foto}`);
        }
      })
      .catch((err) => {
        // Gagal fetch API → tetap pakai data localStorage, tidak perlu alert
        console.warn("Fetch profil gagal, pakai data lokal:", err.message);
      });
  }, [navigate]);

  // ─── Handle input change ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── Handle ganti foto ────────────────────────────────────────────────────
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFoto(file);
    setAvatar(URL.createObjectURL(file));
  };

  // ─── Simpan profil ke API ─────────────────────────────────────────────────
  const simpanProfil = async () => {
    setIsLoading(true);
    setErrorMsg("");

    const kirimData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      kirimData.append(key, val);
    });
    if (selectedFoto) {
      kirimData.append("foto", selectedFoto);
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/profile/${userId}`,
        {
          method: "PUT",
          body: kirimData,
          // Tambahkan Authorization jika backend pakai JWT:
          // headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Update localStorage dengan data terbaru
      const oldUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...oldUser,
        nama_lengkap: formData.nama_lengkap,
        email:        formData.email,
        no_telp:      formData.no_telp,
        nama_toko:    formData.nama_toko,
        alamat:       formData.alamat,
        foto:         data.foto || oldUser.foto,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowSuccess(true); // ✅ tampilkan modal sukses — navigate di dalam modal
    } catch (error) {
      console.error("Gagal update profil:", error);
      setErrorMsg(error.message || "Gagal update profil, coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 flex w-full h-full">
        <img src={bgUtama} alt="" className="w-1/2 h-full object-cover opacity-80" />
        <img src={bgUtama} alt="" className="w-1/2 h-full object-cover opacity-60" />
      </div>

      {/* Header */}
      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      {/* Top Right */}
      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center text-[#63714e]">
          <Bell size={24} />
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full pr-3 pl-1 py-1">
          <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
          <span className="text-sm font-bold text-[#63714e]">
            {formData.nama_lengkap || "Admin"}
          </span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4">
        <SideBarAdmin activePage="profilAdmin" />

        <section className="flex-1 flex gap-4">
          {/* Form Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Page Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">Edit Profil Admin</h2>
                <p className="text-xs text-[#63714e]/70">Kelola informasi akun dan bisnis</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/admin/profil")}
                  className="px-5 py-2 rounded-full border border-[#63714e]/30 flex items-center gap-2 text-sm text-[#63714e] hover:bg-white/50 transition"
                >
                  <ArrowLeft size={15} />
                  Kembali
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-full bg-[#f8bc22] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#e6ac10] transition disabled:opacity-50"
                >
                  <Save size={15} />
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl px-4 py-3 flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            {/* Form Card */}
            <div className="flex-1 overflow-y-auto">
              <div className="bg-white/60 backdrop-blur-2xl p-7 rounded-[28px]">
                {/* Avatar Upload */}
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow"
                    />
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#f8bc22] rounded-full flex items-center justify-center cursor-pointer shadow hover:bg-[#e6ac10] transition">
                      <Camera size={14} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#63714e]">Foto Profil</p>
                    <p className="text-xs text-[#63714e]/60">Klik ikon kamera untuk ganti foto</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    icon={<User size={15} />}
                    label="Nama Lengkap"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Mail size={15} />}
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                  />
                  <InputField
                    icon={<Phone size={15} />}
                    label="No. Telepon"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleChange}
                    type="tel"
                  />
                  <InputField
                    icon={<Store size={15} />}
                    label="Nama Toko"
                    name="nama_toko"
                    value={formData.nama_toko}
                    onChange={handleChange}
                  />
                  {/* Alamat full width */}
                  <div className="col-span-2">
                    <InputField
                      icon={<MapPin size={15} />}
                      label="Alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="w-64 bg-white/55 backdrop-blur-2xl p-6 rounded-[28px] flex flex-col items-center">
            <img
              src={avatar}
              alt=""
              className="w-24 h-24 rounded-full object-cover mb-3 ring-4 ring-white shadow"
            />
            <h4 className="text-base font-black text-[#63714e] text-center">
              {formData.nama_lengkap || "—"}
            </h4>
            <p className="text-[11px] text-center text-[#63714e]/70 mt-1">
              {formData.email || "—"}
            </p>
            <p className="text-[11px] text-center text-[#63714e]/70">
              {formData.nama_toko || "—"}
            </p>
            <p className="text-[11px] text-center text-[#63714e]/60 mt-1 px-2 leading-relaxed">
              {formData.alamat || "—"}
            </p>
            <p className="text-[11px] text-center text-[#63714e]/60 mt-1">
              {formData.no_telp || "—"}
            </p>
          </div>
        </section>
      </div>

      {/* Modals */}
      {showConfirm && (
        <ConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            simpanProfil();
          }}
        />
      )}

      {showSuccess && (
        <SuccessModal onDone={() => navigate("/admin/profil")} />
      )}
    </main>
  );
};

export default EditProfilAdmin;
