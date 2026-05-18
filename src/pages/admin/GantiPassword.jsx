import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  Bell,
  ChevronDown,
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  BadgeCheck,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const BASE_URL = "https://foodwaste-production.up.railway.app"; 
const API = "https://foodwaste-production.up.railway.app/api";

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {children}
    </div>
  );
}

function ConfirmModal({ onClose, onConfirm }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <h2 className="font-black text-[#63714e] text-lg mb-3">
          Ubah Password?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Password admin akan diperbarui.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-[#f8bc22] text-white"
          >
            Ya, Ubah
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

function SuccessModal({ onDone }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <h2 className="font-black text-[#63714e] text-lg mb-3">
          Password Berhasil!
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Password akun admin berhasil diganti.
        </p>
        <button
          onClick={onDone}
          className="w-full py-2 rounded-xl bg-[#63714e] text-white"
        >
          Selesai
        </button>
      </div>
    </Backdrop>
  );
}

function PasswordField({ label, name, value, onChange, show }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#63714e]/70">{label}</label>
      <div className="bg-[#7d8767] rounded-2xl px-4 py-3 flex items-center gap-3">
        <LockKeyhole size={15} className="text-white" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white text-sm"
        />
      </div>
    </div>
  );
}

function SecurityItem({ icon, title, text }) {
  return (
    <div className="bg-[#f7f8ef] rounded-2xl p-3 mb-3">
      <div className="flex items-center gap-2 font-bold text-[#63714e] text-sm mb-1">
        {icon}
        {title}
      </div>
      <p className="text-[11px] text-[#63714e]/70">{text}</p>
    </div>
  );
}

export const GantiPasswordAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({
    lama: "",
    baru: "",
    konfirmasi: "",
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const simpanPassword = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(
        `${API}/profile/${user.id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.log(err);
      alert("Gagal ganti password");
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 flex w-full h-full">
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-80"
        />
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-60"
        />
      </div>

      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center text-[#63714e]">
          <Bell size={24} />
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full pr-3">
          <img
            src={userProfil}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-bold text-[#63714e]">Admin</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4">
        <SideBarAdmin activePage="profilAdmin" />

        <section className="flex-1 flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">
                  Ganti Password Admin
                </h2>
                <p className="text-xs text-[#63714e]/70">
                  Perbarui keamanan akun admin
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/profil")}
                className="px-5 py-2 rounded-full border flex items-center gap-2"
              >
                <ArrowLeft size={15} />
                Kembali
              </button>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[28px] p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <PasswordField
                  label="Password Lama"
                  name="lama"
                  value={passwordData.lama}
                  onChange={handleChange}
                  show={showPassword}
                />
                <PasswordField
                  label="Password Baru"
                  name="baru"
                  value={passwordData.baru}
                  onChange={handleChange}
                  show={showPassword}
                />
                <PasswordField
                  label="Konfirmasi Password"
                  name="konfirmasi"
                  value={passwordData.konfirmasi}
                  onChange={handleChange}
                  show={showPassword}
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#63714e] flex items-center gap-2"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                </button>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-[#f8bc22] text-white font-black py-3 rounded-2xl"
              >
                Simpan Password Baru
              </button>
            </div>
          </div>

          <div className="w-64 bg-white/55 backdrop-blur-2xl rounded-[28px] p-5">
            <h3 className="font-black text-[#63714e] mb-4">Tips Keamanan</h3>

            <SecurityItem
              icon={<ShieldCheck size={15} />}
              title="Gunakan Password Kuat"
              text="Gabungkan huruf besar, kecil, angka, dan simbol."
            />
            <SecurityItem
              icon={<KeyRound size={15} />}
              title="Minimal 8 Karakter"
              text="Password panjang lebih sulit ditebak."
            />
            <SecurityItem
              icon={<BadgeCheck size={15} />}
              title="Jangan Gunakan Info Toko"
              text="Hindari nama toko atau email sebagai password."
            />
          </div>
        </section>
      </div>

      {showConfirm && (
        <ConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            simpanPassword();
          }}
        />
      )}

      {showSuccess && <SuccessModal onDone={() => navigate("/admin/profil")} />}
    </main>
  );
};

export default GantiPasswordAdmin;
