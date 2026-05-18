import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Clock,
  MessageCircle,
  Trash2,
  Store,
  AlertTriangle,
} from "lucide-react";
import SideBarAdmin from "../../components/SideBarAdmin";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

// Import gambar menu — sama persis dengan ListMenuAdmin
import donatGula from "../../assets/donat gula.jpg";
import croissant from "../../assets/croissant.jpg";
import bolu from "../../assets/bolu.jpg";
import brownies from "../../assets/brownies.jpg";
import cake from "../../assets/cake.jpg";
import cheescake from "../../assets/cheescake.jpg";
import NotificationBell from "../../components/NotificationBell";

const menuImages = {
  "donat gula": donatGula,
  croissant: croissant,
  bolu: bolu,
  brownies: brownies,
  cake: cake,
  cheescake: cheescake,
};

/* ─── Data menu (sama dengan ListMenuAdmin) ─────────────────── */
const menuItems = [
  {
    id: 1,
    name: "Donat Gula",
    store: "BakeryPPL",
    oldPrice: "Rp. 10.000",
    newPrice: "Rp. 7.000",
    status: "Available",
    image: "donat gula",
  },
  {
    id: 2,
    name: "Croissant",
    store: "BakeryPPL",
    oldPrice: "Rp. 15.000",
    newPrice: "Rp. 10.000",
    status: "Almost Expired",
    image: "croissant",
  },
  {
    id: 3,
    name: "Bolu",
    store: "BakeryPPL",
    oldPrice: "Rp. 25.000",
    newPrice: "Rp. 12.000",
    status: "Expired",
    image: "bolu",
  },
  {
    id: 4,
    name: "Brownies",
    store: "BakeryPPL",
    oldPrice: "Rp. 40.000",
    newPrice: "Rp. 20.000",
    status: "Almost Expired",
    image: "brownies",
  },
  {
    id: 5,
    name: "Cake",
    store: "BakeryPPL",
    oldPrice: "Rp. 55.000",
    newPrice: "Rp. 35.000",
    status: "Available",
    image: "cake",
  },
  {
    id: 6,
    name: "Cheesecake",
    store: "BakeryPPL",
    oldPrice: "Rp. 65.000",
    newPrice: "Rp. 40.000",
    status: "Expired",
    image: "cheescake",
  },
];

/* ─── Recent Activity ───────────────────────────────────────── */
const activities = [
  { id: 1, title: "Deleted Menu", time: "Admin 1 mnt ago", tone: "danger" },
  {
    id: 2,
    title: "Message Received",
    time: "Admin 1 mnt ago",
    tone: "warning",
  },
  {
    id: 3,
    title: "New Store Registered",
    time: "Admin 1 mnt ago",
    tone: "success",
  },
];

/* ─── Helpers ───────────────────────────────────────────────── */
const statusColor = {
  Expired: "bg-red-500",
  Available: "bg-green-500",
  "Almost Expired": "bg-yellow-400",
};

const activityBg = {
  danger: "bg-red-100 text-red-500",
  warning: "bg-yellow-100 text-yellow-500",
  success: "bg-green-100 text-green-600",
};

const ActivityIcon = ({ tone }) => {
  if (tone === "danger") return <Trash2 size={14} />;
  if (tone === "success") return <Store size={14} />;
  return <MessageCircle size={14} />;
};

/* ─── Main Component ────────────────────────────────────────── */
export function DashboardAdmin() {
  const [search, setSearch] = useState("");
    const [produk, setProduk] = useState([]);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      console.log("User tidak valid:", user);
      return;
    }

    fetch(`http://localhost:3000/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => setAdminData(data))
      .catch((err) => console.error(err));

    fetch(`http://localhost:3000/api/produk/toko/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProduk(data))
      .catch((err) => console.error(err));
  }, []);

  
  const filteredMenu = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return produk;

    return produk.filter((item) =>
      [item.nama_produk, item.deskripsi, item.status, item.nama_toko]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search, produk]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#effae8] font-sans">
      {/* BACKGROUND */}
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

      {/* LOGO */}
      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl border border-white/20">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      {/* SEARCH */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-96">
        <div className="bg-white/80 rounded-full px-5 py-2.5 shadow-lg backdrop-blur-xl flex items-center gap-3">
          <input
            type="text"
            placeholder="Search menu, store, reports"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-[#63714e] text-sm"
          />
          <Search className="text-[#63714e]" size={18} />
        </div>
      </div>

      {/* TOP RIGHT */}
      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <NotificationBell />
        <div className="p-0.5 bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden flex items-center gap-2 pr-3">
          <img
            src={
              adminData?.foto
                ? `http://localhost:3000/uploads/${adminData.foto}`
                : userProfil
            }
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-bold text-[#63714e]">
            {adminData?.nama_toko || adminData?.nama_lengkap || "Admin"}
          </span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="absolute top-24 left-12 right-12 bottom-4 flex items-stretch gap-4 z-10 overflow-hidden">
        {/* SIDEBAR */}
        <div className="h-full">
          <SideBarAdmin />
        </div>

        {/* CONTENT */}
        <section className="flex-1 overflow-y-auto pr-1 space-y-3">
          {/* WELCOME */}
          <div className="bg-white/70 rounded-[28px] shadow-xl px-8 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-[#63714e]">
                Welcome,{" "}
                {adminData?.nama_toko || adminData?.nama_lengkap || "Admin"}!
              </h1>
              <p className="text-sm text-[#63714e]/70 mt-0.5">
                Monitor and reduce food waste today.
              </p>
            </div>
            <Link
              to="/admin/list-menu"
              className="bg-[#f8bc22] hover:bg-[#e4aa16] text-white font-bold px-6 py-2 rounded-full text-sm transition-all"
            >
              View Expiring Menu
            </Link>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/75 rounded-[22px] shadow-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8bc22] flex items-center justify-center text-white">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-xs text-[#63714e]/70">Expiring Soon</p>
                <h4 className="font-black text-[#63714e] text-xl">122 Items</h4>
              </div>
            </div>
            <div className="bg-white/75 rounded-[22px] shadow-lg p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8bc22] flex items-center justify-center text-white">
                <MessageCircle size={22} />
              </div>
              <div>
                <p className="text-xs text-[#63714e]/70">New Messages</p>
                <h4 className="font-black text-[#63714e] text-xl">
                  144 Messages
                </h4>
              </div>
            </div>
          </div>

          {/* GRID BAWAH */}
          <div className="grid grid-cols-[3fr_1fr] gap-4">
            {/* MENU LIST */}
            <div className="bg-white/70 rounded-[28px] shadow-2xl p-5">
              <h3 className="text-lg font-black text-[#63714e] mb-4">
                Expiring Menu List
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id_produk}
                    className="bg-white rounded-[20px] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all p-2.5"
                  >
                    <img
                      src={
                        menuImages[item.nama_produk.toLowerCase()] ??
                        menuImages["donat gula"]
                      }
                      alt={item.nama_produk}
                      className="w-full h-24 object-cover rounded-xl"
                    />

                    <div className="mt-2 flex items-center justify-between">
                      <h4 className="font-bold text-[#63714e] text-sm">
                        {item.nama_produk}
                      </h4>

                      <span
                        className={`text-[9px] text-white font-bold px-2 py-0.5 rounded-full ${
                          item.status === "expired"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {item.status === "expired" ? "Expired" : "Available"}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500">
                      {item.deskripsi}
                    </p>

                    <p className="text-xs text-[#63714e] mt-1 font-bold">
                      Rp. {item.harga}
                    </p>
                  </div>
                ))}
                {filteredMenu.length === 0 && (
                  <div className="col-span-3 text-center text-[#63714e]/50 py-8 text-sm">
                    Menu tidak ditemukan.
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-3">
              {/* NEED ATTENTION */}
              <div className="bg-white/75 shadow-xl p-4 rounded-[22px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-black text-[#63714e]">
                    Need Attention
                  </h3>
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <button className="w-full bg-[#f8bc22] hover:bg-[#e4aa16] text-white font-bold py-2 rounded-xl text-sm transition-all">
                  Manage Now
                </button>
              </div>

              {/* RECENT ACTIVITY */}
              <div className="bg-white/75 shadow-xl p-4 rounded-[22px]">
                <h3 className="text-base font-black text-[#63714e] mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 bg-[#f7f8ef] rounded-xl p-2.5"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${activityBg[act.tone]}`}
                      >
                        <ActivityIcon tone={act.tone} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#63714e]">
                          {act.title}
                        </p>
                        <p className="text-[10px] text-gray-400">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardAdmin;