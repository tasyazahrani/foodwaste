import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  Bell,
  ArrowLeft,
  HelpCircle,
  Store,
  MessageSquare,
  PackageCheck,
  Shield,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  ClipboardList,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const PengaturanAdmin = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      q: "Bagaimana cara menambahkan menu rescue food?",
      a: "Masuk ke halaman List Menu admin, lalu tekan tombol Add Menu. Isi nama produk, harga rescue, deskripsi, foto produk, dan tanggal expired sebelum menyimpan.",
    },
    {
      q: "Bagaimana merchant membalas pesan pelanggan?",
      a: "Masuk ke halaman Pesan Admin, pilih ruang chat pelanggan, lalu kirim balasan langsung untuk konfirmasi stok, harga, atau jadwal pengambilan.",
    },
    {
      q: "Apakah menu bisa diedit atau dihapus?",
      a: "Bisa. Merchant memiliki kontrol penuh untuk mengedit informasi produk maupun menghapus menu yang sudah tidak tersedia.",
    },
    {
      q: "Bagaimana cara menjaga kualitas rescue food?",
      a: "Merchant wajib memastikan makanan masih layak konsumsi, dikemas baik, dan memberikan informasi expired secara transparan kepada pelanggan.",
    },
    {
      q: "Bagaimana keamanan akun merchant?",
      a: "Merchant disarankan mengganti password secara berkala dan tidak membagikan akun dashboard kepada pihak lain demi keamanan data toko.",
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
        <SideBarAdmin activePage="profilAdmin" />

        <section className="flex-1 flex gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">
                  Pusat Bantuan Merchant
                </h2>
                <p className="text-xs text-[#63714e]/70">
                  FAQ dan panduan pengelolaan dashboard merchant
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/profil")}
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
              Panduan Merchant
            </h3>

            <InfoCard
              icon={<Store size={16} />}
              title="Kelola Toko"
              value="Atur profil dan status merchant."
            />
            <InfoCard
              icon={<ClipboardList size={16} />}
              title="Kelola Menu"
              value="Tambah, edit, hapus rescue food."
            />
            <InfoCard
              icon={<MessageSquare size={16} />}
              title="Chat Pelanggan"
              value="Balas pertanyaan dan konfirmasi order."
            />
            <InfoCard
              icon={<PackageCheck size={16} />}
              title="Kualitas Produk"
              value="Pastikan makanan layak rescue."
            />
            <InfoCard
              icon={<Shield size={16} />}
              title="Keamanan Dashboard"
              value="Lindungi akun merchant Anda."
            />

            <div className="mt-6 bg-[#63714e] text-white rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall size={15} />
                <span className="font-bold text-sm">Merchant Support</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Hubungi tim bantuan merchant:
                <br />
                merchant@foodwaste.id
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

export default PengaturanAdmin;
