import React, { useState, useEffect, useRef } from "react";
import { Bell, Search, BadgePercent, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../../components/SideBar";
import MenuDetailModal from "../../components/MenuDetailModal";
import NotifDropdown from "../../components/NotifDropdown";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const ListMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  const [search, setSearch] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [menus, setMenus] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const focusToko = location.state?.focus_toko || null;

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/produk`);
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

  const handlePesanKlik = (item) => {
    if (!currentUser?.id) {
      alert("Silakan login terlebih dahulu untuk mengirim pesan.");
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

  const getStatus = (expiredDate) => {
    if (!expiredDate) return "Fresh Rescue";
    const now = new Date();
    const exp = new Date(expiredDate);
    const diff = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    if (diff <= 1) return "Urgent Rescue";
    if (diff <= 3) return "Soon Expired";
    return "Fresh Rescue";
  };

  const baseMenus = focusToko
    ? menus.filter((item) => item.id_toko === focusToko)
    : menus;

  const filteredMenus = baseMenus.filter((item) =>
    item.nama_produk?.toLowerCase().includes(search.toLowerCase()),
  );

  const uniqueStores = [
    ...new Map(baseMenus.map((item) => [item.id_toko, item])).values(),
  ];

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
            className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e] hover:scale-110 transition-all"
          >
            <Bell size={24} />
          </button>
          {showNotif && <NotifDropdown />}
        </div>

        <img
          src={userProfil}
          alt="Profil"
          className="w-12 h-12 rounded-full object-cover shadow-md border border-white"
        />
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-5 flex gap-4 z-10 overflow-hidden">
        <SideBar activePage="menu" />

        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-xl px-6 py-4 flex items-center gap-4">
            <input
              type="text"
              placeholder={
                focusToko
                  ? "Cari menu dari merchant ini..."
                  : "Cari Makanan Penyelamat..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full text-[#63714e] font-medium"
            />
            <Search className="text-[#63714e]" size={20} />
          </div>

          <div className="grid grid-cols-3 gap-4"></div>

          <div className="bg-white/55 backdrop-blur-2xl rounded-[35px] shadow-2xl p-8 flex-1 overflow-y-auto no-scrollbar">
            <h3 className="text-2xl font-black text-[#63714e] mb-6">
              {focusToko
                ? "Menu Merchant Pilihan"
                : "Penyelamat Makanan Hari Ini"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
              {filteredMenus.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-md p-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div
                    className="relative overflow-hidden rounded-2xl mb-3 cursor-pointer"
                    onClick={() => setSelectedMenu(item)}
                  >
                    <img
                      src={
                        item.image
                          ? `https://foodwaste-production.up.railway.app/uploads/${item.image}`
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={item.nama_produk}
                      className="w-full h-28 object-cover rounded-2xl"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-[#63714e] shadow-sm">
                      {getStatus(item.expired_date)}
                    </div>
                  </div>

                  <h4 className="font-bold text-[#63714e] text-sm truncate">
                    {item.nama_produk}
                  </h4>
                  <p className="text-sm font-bold text-gray-800">
                    Rp {Number(item.harga).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-red-500 font-bold uppercase">
                    {item.expired_date || "Segera Habis"}
                  </p>
                  <p className="text-[11px] text-gray-500 italic truncate">
                    {item.nama_toko || "Toko Mitra"}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedMenu(item)}
                      className="flex-1 bg-[#63714e] text-white py-2 rounded-full text-[11px] font-bold"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handlePesanKlik(item)}
                      className="flex-1 bg-[#f8bc22] text-white py-2 rounded-full text-[11px] font-bold"
                    >
                      Pesan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          onClose={() => setSelectedMenu(null)}
        />
      )}
    </main>
  );
};

export default ListMenu;
