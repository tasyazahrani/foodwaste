import React from "react";
import { MapPin, Clock3, Star, Store, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import food2 from "../assets/chat2.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const StoreDetailModal = ({ store, onClose }) => {
  const navigate = useNavigate();

  if (!store) return null;

  const handleVisitMenu = () => {
    onClose();
    navigate("/menu", {
      state: {
        focus_toko: store.id_toko,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[35px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-md p-1.5 rounded-full text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="relative h-40">
          <img
            src={
              store.image
                ? `${BASE_URL}/uploads/${store.image}`
                : food2
            }
            alt="store"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 from-black/60 to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f8bc22] flex items-center justify-center text-[#63714e] shadow-sm shrink-0">
              <Store size={22} strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#63714e] leading-tight uppercase">
                {store.nama_toko || "Merchant Food Waste"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Food Waste Partner Merchant
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-[#63714e] mb-5 border-y border-gray-100 py-4">
            <p className="flex items-center gap-2 font-medium">
              <MapPin size={14} className="text-[#f8bc22]" /> Banda Aceh
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Clock3 size={14} className="text-[#f8bc22]" /> Buka setiap hari •
              08.00 - 22.00
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Star size={14} className="text-[#f8bc22] fill-[#f8bc22]" />{" "}
              Rating 4.8 (Merchant Aktif)
            </p>
          </div>

          <div className="bg-[#f7f8ef] rounded-2xl p-4 mb-6">
            <h4 className="font-bold text-[#63714e] mb-1 text-sm uppercase tracking-wider">
              Tentang Merchant
            </h4>
            <p className="text-xs text-[#63714e]/80 leading-relaxed italic">
              Merchant penyelamat makanan yang menyediakan berbagai produk
              rescue berkualitas dengan harga hemat untuk membantu mengurangi
              food waste setiap harinya.
            </p>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleVisitMenu}
              className="flex-1 bg-[#f8bc22] hover:bg-[#e8ae17] text-white py-3 rounded-2xl font-bold text-sm shadow-lg"
            >
              Kunjungi Menu
            </button>

            <button
              onClick={onClose}
              className="flex-1 border-2 border-[#63714e] text-[#63714e] py-3 rounded-2xl font-bold text-sm hover:bg-[#63714e] hover:text-white transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailModal;
