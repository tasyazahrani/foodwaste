import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import {
  Bell,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  ShoppingBag,
  Shield,
  CreditCard,
  ChevronDown,
  ChevronUp,
  PhoneCall,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

export const Pengaturan = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      q: "Bagaimana cara memesan makanan rescue?",
      a: "Masuk ke halaman menu, pilih produk yang tersedia, lalu tekan tombol Pesan Sekarang untuk memulai chat dengan merchant dan melakukan konfirmasi pembelian.",
    },
    {
      q: "Apakah saya bisa chat langsung dengan merchant?",
      a: "Bisa. Setiap produk memiliki akses langsung ke fitur pesan sehingga Anda dapat menanyakan stok, jam pickup, atau detail makanan sebelum membeli.",
    },
    {
      q: "Bagaimana sistem pembayaran dilakukan?",
      a: "Pembayaran dilakukan secara transfer atau COD sesuai kesepakatan dengan merchant melalui ruang chat yang tersedia.",
    },
    {
      q: "Apakah pesanan bisa dibatalkan?",
      a: "Pesanan dapat dibatalkan selama merchant belum memproses reservasi makanan. Pembatalan dilakukan melalui percakapan chat.",
    },
    {
      q: "Bagaimana keamanan akun saya?",
      a: "Food Waste menjaga data akun pengguna dan menyarankan untuk rutin mengganti password demi keamanan akses aplikasi.",
    },
  ];

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
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-6 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center text-[#63714e] shadow-lg">
          <Bell size={24} />
        </button>
        <img
          src={
            currentUser?.foto
              ? `${BASE_URL}/uploads/${currentUser.foto}`
              : userProfil
          }
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-10 flex gap-8">
        <SideBar activePage="profil" />

        <section className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">
                  Pusat Bantuan Pengguna
                </h2>
                <p className="text-xs text-[#63714e]/70">
                  FAQ dan informasi penggunaan aplikasi Food Waste
                </p>
              </div>
              <button
                onClick={() => navigate("/profil")}
                className="px-5 py-2 rounded-full border border-[#63714e] text-[#63714e] text-sm flex items-center gap-2"
              >
                <ArrowLeft size={15} />
                Kembali
              </button>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[35px] shadow-2xl p-6 overflow-y-auto space-y-3">
              {faqData.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#f7f8ef] rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full px-5 py-4 flex justify-between items-center text-left"
                  >
                    <div className="flex items-center gap-3 text-[#63714e] font-bold text-sm">
                      <HelpCircle size={16} className="text-[#f8bc22]" />
                      {item.q}
                    </div>
                    {openIndex === i ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {openIndex === i && (
                    <div className="px-5 pb-4 text-xs text-[#63714e]/75 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-72 bg-white/60 backdrop-blur-2xl rounded-[35px] shadow-2xl p-6">
            <h3 className="text-base font-bold text-[#63714e] mb-5">
              Layanan Bantuan
            </h3>

            <InfoCard
              icon={<ShoppingBag size={16} />}
              title="Pemesanan"
              value="Panduan pembelian rescue food."
            />
            <InfoCard
              icon={<MessageCircle size={16} />}
              title="Live Chat Merchant"
              value="Hubungi merchant langsung."
            />
            <InfoCard
              icon={<CreditCard size={16} />}
              title="Pembayaran"
              value="Transfer / COD sesuai kesepakatan."
            />
            <InfoCard
              icon={<Shield size={16} />}
              title="Keamanan Akun"
              value="Lindungi data akun pengguna."
            />

            <div className="mt-6 bg-[#63714e] text-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall size={15} />
                <span className="font-bold text-sm">Butuh Bantuan?</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Hubungi admin support melalui email:
                <br />
                support@foodwaste.id
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="bg-[#f7f8ef] rounded-2xl p-3 shadow-sm mb-3">
    <div className="flex items-center gap-2 text-[#63714e] font-bold text-sm mb-1">
      {icon}
      {title}
    </div>
    <p className="text-xs text-[#63714e]/70">{value}</p>
  </div>
);
