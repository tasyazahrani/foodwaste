import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Store, Clock, Tag } from "lucide-react";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const MenuDetailModal = ({ menu, onClose }) => {
  const navigate = useNavigate();

  if (!menu) return null;

  const getStatus = () => {
    if (!menu.expired_date) return "Masih sangat layak konsumsi";
    return `Expired ${menu.expired_date}`;
  };

  const handlePesan = () => {
    onClose();
    navigate("/pesan", {
      state: {
        id_toko: menu.id_toko,
        nama_toko: menu.nama_toko,
        nama_produk: menu.nama_produk,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[28px] shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "popIn 0.25s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.92) translateY(12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <div className="relative h-44">
          <img
            src={`${BASE_URL}/uploads/${menu.image}`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 from-black/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-black text-white leading-tight">
              {menu.nama_produk}
            </h2>
            <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
              <Store size={11} /> {menu.nama_toko || "Toko Mitra"}
            </p>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-gray-400">Harga Rescue</p>
              <p className="text-xl font-black text-[#63714e]">
                Rp {Number(menu.harga).toLocaleString()}
              </p>
            </div>
            <span className="bg-[#f8bc22]/15 text-[#e8a800] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Tag size={11} /> Rescue Deal
            </span>
          </div>

          <div className="flex items-center gap-2 bg-red-50 rounded-2xl px-4 py-2.5 mb-4">
            <Clock size={13} className="text-red-400 shrink-0" />
            <p className="text-xs text-red-500 font-medium">{getStatus()}</p>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed mb-5">
            {menu.deskripsi ||
              "Produk berkualitas yang masih layak konsumsi dan siap menyelamatkan harimu sambil membantu mengurangi food waste bersama merchant kami."}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-[#63714e]/30 text-[#63714e] font-bold py-3 rounded-2xl text-sm"
            >
              Kembali
            </button>
            <button
              onClick={handlePesan}
              className="flex-1 bg-[#f8bc22] text-white font-bold py-3 rounded-2xl text-sm shadow-md"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailModal;
