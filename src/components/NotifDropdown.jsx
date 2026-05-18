import React, { useState, useEffect } from "react";
import { BellRing, MessageSquare, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotifDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getCurrentUser = () => {
    try {
      const user =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(localStorage.getItem("userData")) ||
        {};
      return user;
    } catch {
      return {};
    }
  };

  const currentUser = getCurrentUser();
  const userId = currentUser.id || null;
  const userRole = currentUser.role || localStorage.getItem("userRole") || "pengguna";

  useEffect(() => {
    if (!userId) return;

    const fetchNotif = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/notifikasi/${userId}`);
        setNotifications(res.data);
        const unread = res.data.filter(n => n.is_read === 0 || n.is_read === false).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotif();
    const interval = setInterval(fetchNotif, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = async () => {
    if (!userId || unreadCount === 0) return;
    try {
      await axios.put(`http://localhost:3000/api/notifikasi/read/${userId}`);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (error) { }
  };

  const handleNotifClick = (item) => {
    // Navigasi berdasarkan tipe notifikasi dan role
    const isPesan = item.title.toLowerCase().includes("pesan") || item.title.toLowerCase().includes("balasan");
    const isStock = item.title.toLowerCase().includes("expired") || item.title.toLowerCase().includes("kadaluarsa") || item.type === "stock";

    if (isPesan) {
      if (userRole === "admin") navigate("/admin/pesan");
      else navigate("/pesan");
    } else if (isStock) {
      navigate("/admin/list-menu");
    }
  };

  return (
    <div
      className="absolute top-16 right-0 w-80 bg-white rounded-[28px] shadow-2xl p-5 border border-gray-100 z-50 animate-fadeIn"
      onClick={markAsRead}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellRing className="text-[#63714e]" size={18} />
          <h3 className="font-black text-[#63714e]">Pemberitahuan</h3>
        </div>

        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
            {unreadCount} Baru
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <p className="text-center text-xs text-gray-400">Belum ada pemberitahuan</p>
        ) : (
          notifications.map((item, index) => {
            const isStock = item.title.toLowerCase().includes("expired") || item.title.toLowerCase().includes("kadaluarsa");
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotifClick(item);
                  markAsRead();
                }}
                className={`rounded-2xl p-3 shadow-sm transition-all duration-300 cursor-pointer ${item.is_read ? 'bg-[#f7f8ef] hover:bg-[#eef1e2]' : 'bg-[#eef1e2] border-l-2 border-[#f8bc22]'}`}
              >
                <div className={`flex items-center gap-2 font-bold text-sm mb-1 ${isStock ? 'text-red-500' : 'text-[#63714e]'}`}>
                  {isStock ? <AlertTriangle size={16} /> : <MessageSquare size={16} />}
                  {item.title}
                </div>

                <p className="text-xs text-[#63714e]/70">{item.message}</p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>

  )
}

export default NotifDropdown;