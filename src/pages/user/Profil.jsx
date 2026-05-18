import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import LogoutModal from "../../components/LogoutModal";
import {
  Bell,
  User,
  Lock,
  Settings,
  LogOut,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/people.png";
import food1 from "../../assets/chat1.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

export const ProfilUser = () => {
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const riwayatPesanan = [
    {
      id: 1,
      nama: "Donat Gula",
      toko: "PASTELERIA d'Acacia",
      img: food1,
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => console.log(err));
  }, [navigate]);

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 flex w-full h-full pointer-events-none">
        <img
          className="w-1/2 h-full object-cover opacity-80"
          src={bgUtama}
          alt=""
        />
        <img
          className="w-1/2 h-full object-cover opacity-60"
          src={bgUtama}
          alt=""
        />
      </div>

      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl border border-white/20">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-6 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e]">
          <Bell size={24} strokeWidth={2.5} />
        </button>
        <div className="p-0.5 bg-white rounded-full shadow-lg overflow-hidden">
          <img
            src={
              userData?.foto
                ? `${BASE_URL}/uploads/${userData.foto}`
                : userProfil
            }
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-10 flex items-stretch gap-8 z-10">
        <div className="h-full">
          <SideBar activePage="profil" />
        </div>

        <section className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[38px] shadow-2xl border border-white/40 px-8 py-5 flex items-center gap-6">
              <img
                src={
                  userData?.foto
                    ? `${BASE_URL}/uploads/${userData.foto}`
                    : userProfil
                }
                alt=""
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-3xl font-black text-[#63714e] leading-none">
                  {userData?.nama_lengkap || "Loading..."}
                </h2>
                <p className="text-base text-[#63714e]/75 font-medium mt-1">
                  {userData?.email || "-"}
                </p>
                <p className="text-sm text-[#63714e]/70 mt-1">
                  {userData?.no_telp || "-"}
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white/55 backdrop-blur-2xl rounded-[38px] shadow-2xl border border-white/40 px-8 py-6 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/editprofil")}
                  className="w-full flex items-center justify-between border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <User size={18} className="text-[#f8bc22]" />
                    <span className="font-semibold text-[#63714e] text-base">
                      Edit Profil
                    </span>
                  </div>
                  <ChevronRight className="text-[#f8bc22]" size={17} />
                </button>

                <button
                  onClick={() => navigate("/gantipassword")}
                  className="w-full flex items-center justify-between border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <Lock size={18} className="text-[#f8bc22]" />
                    <span className="font-semibold text-[#63714e] text-base">
                      Ganti Password
                    </span>
                  </div>
                  <ChevronRight className="text-[#f8bc22]" size={17} />
                </button>

                <button
                  onClick={() => navigate("/pengaturan")}
                  className="w-full flex items-center justify-between border-b border-gray-200 pb-4"
                >
                  <div className="flex items-center gap-4">
                    <Settings size={18} className="text-[#f8bc22]" />
                    <span className="font-semibold text-[#63714e] text-base">
                      F.A.Q
                    </span>
                  </div>
                  <ChevronRight className="text-[#f8bc22]" size={17} />
                </button>
              </div>

              <button
                onClick={() => setShowLogout(true)}
                className="w-full bg-[#f8bc22] text-white font-bold py-3 rounded-2xl shadow-lg flex items-center justify-center gap-3"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          </div>

          <div className="w-72 bg-white/55 backdrop-blur-2xl rounded-[38px] shadow-2xl border border-white/40 px-6 py-6 overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <ClipboardList className="text-[#63714e]" size={19} />
              <h3 className="text-lg font-black text-[#63714e]">
                Riwayat Pesananmu
              </h3>
            </div>

            {riwayatPesanan.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 rounded-3xl p-3 flex items-center gap-3 shadow-md mb-4"
              >
                <img
                  src={item.img}
                  alt=""
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#63714e] text-sm">
                    {item.nama}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.toko}</p>
                </div>
              </div>
            ))}
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
