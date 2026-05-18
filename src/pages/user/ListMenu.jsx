import React, { useState, useEffect, useRef, useMemo } from "react";
import { Bell, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import SideBar from "../../components/SideBar";
import MenuDetailModal from "../../components/MenuDetailModal";
import NotifDropdown from "../../components/NotifDropdown";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

const API = "https://foodwaste-production.up.railway.app";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const ListMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getUser();
  const focusToko = location.state?.focus_toko || null;

  // ================= FETCH MENU =================
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/produk`);
        const data = await res.json();
        setMenus(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // ================= OUTSIDE CLICK NOTIF =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= STATUS =================
  const getStatus = (expiredDate) => {
    if (!expiredDate) return "Fresh Rescue";

    const diff = Math.ceil(
      (new Date(expiredDate) - new Date()) / (1000 * 60 * 60 * 24)
    );

    if (diff <= 1) return "Urgent Rescue";
    if (diff <= 3) return "Soon Expired";
    return "Fresh Rescue";
  };

  // ================= HANDLE PESAN =================
  const handlePesan = (item) => {
    if (!user?.id) {
      alert("Silakan login terlebih dahulu");
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

  // ================= FILTER DATA =================
  const filteredMenus = useMemo(() => {
    const base = focusToko
      ? menus.filter((m) => m.id_toko === focusToko)
      : menus;

    return base.filter((m) =>
      (m.nama_produk || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [menus, search, focusToko]);

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">

      {/* BACKGROUND */}
      <div className="fixed inset-0 flex pointer-events-none">
        <img src={bgUtama} className="w-1/2 object-cover opacity-80" />
        <img src={bgUtama} className="w-1/2 object-cover opacity-60" />
      </div>

      {/* HEADER */}
      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-3xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      {/* TOP RIGHT */}
      <div className="absolute top-6 right-12 flex items-center gap-6 z-30">

        {/* NOTIF */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg"
          >
            <Bell size={22} />
          </button>

          {showNotif && <NotifDropdown />}
        </div>

        {/* PROFILE */}
        <img
          src={userProfil}
          className="w-12 h-12 rounded-full object-cover shadow-md"
          alt="profile"
        />
      </div>

      {/* CONTENT */}
      <div className="absolute top-24 left-12 right-12 bottom-5 flex gap-4">

        <SideBar activePage="menu" />

        <section className="flex-1 flex flex-col gap-4 overflow-hidden">

          {/* SEARCH */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-full px-6 py-4 flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                focusToko
                  ? "Cari menu dari merchant ini..."
                  : "Cari makanan penyelamat..."
              }
              className="flex-1 bg-transparent outline-none text-[#63714e]"
            />
            <Search size={18} />
          </div>

          {/* LIST */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-[35px] shadow-2xl p-6 flex-1 overflow-y-auto">

            <h2 className="text-2xl font-black text-[#63714e] mb-6">
              {focusToko ? "Menu Merchant" : "Penyelamat Makanan"}
            </h2>

            {loading && (
              <p className="text-sm text-gray-500">Loading menu...</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {filteredMenus.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow-md p-3 hover:shadow-xl transition"
                >

                  {/* IMAGE */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setSelectedMenu(item)}
                  >
                    <img
                      src={
                        item.image
                          ? `${API}/uploads/${item.image}`
                          : "https://via.placeholder.com/300"
                      }
                      className="h-28 w-full object-cover rounded-2xl"
                      alt={item.nama_produk}
                    />

                    <span className="absolute top-2 right-2 text-[10px] bg-[#63714e] text-white px-2 py-1 rounded-full">
                      {getStatus(item.expired_date)}
                    </span>
                  </div>

                  {/* INFO */}
                  <h3 className="font-bold text-sm text-[#63714e] truncate mt-2">
                    {item.nama_produk}
                  </h3>

                  <p className="font-bold text-sm">
                    Rp {Number(item.harga || 0).toLocaleString()}
                  </p>

                  <p className="text-[11px] text-gray-500 italic truncate">
                    {item.nama_toko}
                  </p>

                  {/* BUTTON */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedMenu(item)}
                      className="flex-1 bg-[#63714e] text-white rounded-full py-2 text-[11px]"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() => handlePesan(item)}
                      className="flex-1 bg-[#f8bc22] text-white rounded-full py-2 text-[11px]"
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

      {/* MODAL */}
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