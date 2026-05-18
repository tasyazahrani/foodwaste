import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  MapPin,
  Clock3,
  Store,
  BadgePercent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import SideBar from "../../components/SideBar";
import NotifDropdown from "../../components/NotifDropdown";
import StoreDetailModal from "../../components/StoreDetailModal";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/people.png"; // Foto default
import kiri from "../../assets/kiri.png";
import kanan from "../../assets/kanan.png";
import food2 from "../../assets/chat2.png";

export const DashboardUser = () => {
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [menus, setMenus] = useState([]);
  

  // Ambil data user dari localStorage
  const storedUser =
    localStorage.getItem("user") ||
    localStorage.getItem("userData");

  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Logika untuk menentukan sumber foto profil
  const userPhoto = currentUser?.foto
    ? `http://localhost:3000/uploads/${currentUser.foto}`
    : userProfil;

  const handlePesanKlik = (item) => {
    if (!currentUser?.id) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    navigate("/pesan", {
      state: {
        id_toko: item.id_toko,
        nama_toko: item.nama_toko,
        nama_produk: item.nama_produk,
      },
    });
  };

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/produk");
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProduk();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatus = (expiredDate) => {
    if (!expiredDate) return "Fresh Rescue";
    const now = new Date();
    const exp = new Date(expiredDate);
    const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (diff <= 1) return "Urgent Rescue";
    if (diff <= 3) return "Soon Expired";
    return "Fresh Rescue";
  };

  const filteredMenus = menus.filter((item) =>
    item.nama_produk?.toLowerCase().includes(search.toLowerCase()),
  );

  const uniqueStores = [
    ...new Map(menus.map((item) => [item.id_toko, item])).values(),
  ];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#effae8] font-sans">
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
        <div className="px-7 py-3 bg-[#63714ed1] rounded-3xl shadow-xl border border-white/20">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-6 z-30">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e]"
          >
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>
          {showNotif && <NotifDropdown />}
        </div>

        {/* FOTO PROFIL DINAMIS */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-[#63714e]">
              {currentUser?.namaLengkap ?? "User"}
            </p>

            <p className="text-xs text-[#63714e]/70 capitalize">
              {currentUser?.role ?? "pengguna"}
            </p>
          </div>

          <img
            src={userPhoto}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
          />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4 z-10 overflow-hidden">
        <SideBar activePage="home" />

        <section className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
          <div className="bg-white/80 rounded-full px-5 py-3 shadow-lg backdrop-blur-xl flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari makanan favoritmu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-[#63714e] text-sm"
            />
            <Search className="text-[#63714e]" size={18} />
          </div>

          <div className="relative bg-white/70 rounded-3xl shadow-2xl overflow-hidden px-10 py-6 text-center">
            <img
              src={kiri}
              alt=""
              className="absolute left-0 top-0 h-full w-32 object-cover"
            />
            <img
              src={kanan}
              alt=""
              className="absolute right-0 top-0 h-full w-32 object-cover"
            />
            <h2 className="relative z-10 text-3xl font-black text-[#63714e]">
              Jadilah Pahlawan Makanan!
            </h2>
            <p className="relative z-10 text-[#63714e]/70 mt-1 text-sm">
              Selamatkan hidangan lezat dan bantu kurangi limbah makanan hari
              ini.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="relative z-10 mt-4 bg-[#f8bc22] text-white font-bold px-8 py-2 rounded-full"
            >
              Mulai Menjelajah Menu
            </button>
          </div>

          <div className="grid grid-cols-[3fr_1fr] gap-4">
            <div className="bg-white/70 rounded-3xl shadow-2xl p-5">
              <h3 className="text-lg font-black text-[#63714e] mb-4">
                Penyelamat Makanan Hari Ini
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {filteredMenus.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all p-2.5"
                  >
                    <img
                      src={`http://localhost:3000/uploads/${item.image}`}
                      alt={item.nama_produk}
                      className="w-full h-28 object-cover rounded-2xl"
                    />
                    <h4 className="mt-2 font-bold text-[#63714e] text-sm truncate">
                      {item.nama_produk}
                    </h4>
                    <p className="text-xs font-semibold">
                      Rp {Number(item.harga).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-red-500 font-bold uppercase">
                      {getStatus(item.expired_date)}
                    </p>
                    <p className="text-[10px] text-gray-500 italic">
                      {item.nama_toko || "Toko Mitra"}
                    </p>
                    <button
                      onClick={() => handlePesanKlik(item)}
                      className="mt-2 w-full bg-[#f8bc22] text-white py-1.5 rounded-full text-xs font-bold"
                    >
                      Pesan Menu
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/75 shadow-xl p-4 rounded-3xl">
                <h3 className="text-base font-black text-[#63714e] mb-3">
                  Cari Toko Sekitar
                </h3>
                {uniqueStores.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex gap-2 mb-3">
                    <img
                      src={food2}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xs text-[#63714e] uppercase">
                        {item.nama_toko}
                      </p>
                      <p className="text-[10px] flex items-center gap-1">
                        <MapPin size={9} /> Banda Aceh
                      </p>
                      <button
                        onClick={() => {
                          setSelectedStore(item);
                          setShowStore(true);
                        }}
                        className="mt-1 bg-[#f8bc22] text-white px-2.5 py-0.5 rounded-full text-[9px]"
                      >
                        lihat toko
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {showStore &&
        ReactDOM.createPortal(
          <StoreDetailModal
            store={selectedStore}
            onClose={() => setShowStore(false)}
          />,
          document.body,
        )}
    </main>
  );
};

export default DashboardUser;
