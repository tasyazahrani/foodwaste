import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  Bell,
  ChevronDown,
  User,
  Lock,
  Settings,
  LogOut,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/people.png";
import food1 from "../../assets/image.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const adminLogs = [
  {
    id: 1,
    aksi: "Kelola Menu",
    detail: "Monitoring produk toko",
    img: food1,
    waktu: "Hari ini",
  },
  {
    id: 2,
    aksi: "Balas Pesan",
    detail: "Melayani chat pelanggan",
    img: food1,
    waktu: "Hari ini",
  },
];

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {children}
    </div>
  );
}

function LogoutModal({ onClose, onLogout }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 mx-4 p-7 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f8bc22]/10 flex items-center justify-center">
          <LogOut size={28} className="text-[#f8bc22]" />
        </div>
        <h2 className="font-black text-[#63714e] text-lg">Keluar Akun?</h2>
        <p className="text-sm text-gray-500">
          Kamu akan keluar dari sesi admin.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border">
            Batal
          </button>
          <button
            onClick={onLogout}
            className="flex-1 py-2.5 rounded-xl bg-[#f8bc22] text-white"
          >
            Keluar
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export const ProfilAdmin = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [tokoStatus, setTokoStatus] = useState("buka");
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Edit Profil", route: "/admin/edit-profil" },
    { icon: Lock, label: "Ganti Password", route: "/admin/ganti-password" },
    { icon: Settings, label: "F.A.Q", route: "/admin/pengaturan" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => setAdminData(data))
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 flex w-full h-full pointer-events-none">
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
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center text-[#63714e]">
          <Bell size={24} />
        </button>
        <div className="p-0.5 bg-white rounded-full shadow-lg flex items-center gap-2 pr-3">
          <img
            src={
              adminData?.foto
                ? `${BASE_URL}/uploads/${adminData.foto}`
                : userProfil
            }
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-bold text-[#63714e]">Admin</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-4 flex items-stretch gap-4 z-10 overflow-hidden">
        <div className="h-full">
          <SideBarAdmin activePage="profilAdmin" />
        </div>

        <section className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="bg-white/60 backdrop-blur-2xl shadow-2xl px-8 py-5 flex items-center gap-6">
              <img
                src={
                  adminData?.foto
                    ? `${BASE_URL}/uploads/${adminData.foto}`
                    : userProfil
                }
                alt=""
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
              />

              <div className="flex-1">
                <h2 className="text-3xl font-black text-[#63714e]">
                  {adminData?.nama_lengkap || "Loading..."}
                </h2>
                <p className="text-sm text-[#63714e]/70">
                  {adminData?.email || "-"}
                </p>
                <p className="text-xs text-[#63714e]/70 mt-1">
                  {adminData?.nama_toko || "-"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2"></div>
            </div>

            <div className="flex-1 bg-white/55 backdrop-blur-2xl shadow-2xl px-8 py-6 flex flex-col justify-between">
              <div className="space-y-1">
                {menuItems.map(({ icon: Icon, label, route }, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(route)}
                    className="w-full flex items-center justify-between py-4 border-b"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={17} className="text-[#f8bc22]" />
                      <span className="font-semibold text-[#63714e] text-sm">
                        {label}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-[#f8bc22]" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowLogout(true)}
                className="w-full mt-4 bg-[#f8bc22] text-white font-black py-3 rounded-2xl flex items-center justify-center gap-3"
              >
                <LogOut size={17} />
                Keluar
              </button>
            </div>
          </div>

          <div className="w-72 bg-white/55 backdrop-blur-2xl shadow-2xl px-6 py-6">
            <div className="flex items-center gap-3 mb-5">
              <ClipboardList size={18} className="text-[#63714e]" />
              <h3 className="text-base font-black text-[#63714e]">
                Log Aktivitas
              </h3>
            </div>

            <div className="space-y-3">
              {adminLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white rounded-2xl p-3 flex items-center gap-3"
                >
                  <img
                    src={log.img}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-black text-[#63714e] text-xs">
                      {log.aksi}
                    </h4>
                    <p className="text-[10px] text-gray-500">{log.detail}</p>
                    <p className="text-[9px] text-[#63714e]/50">{log.waktu}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
          onLogout={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        />
      )}
    </main>
  );
};

export default ProfilAdmin;
