import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import NotifDropdown from "../../components/NotifDropdown";
import { Bell, Search, Send, Plus, MessageCircle, Store } from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";
import chat1 from "../../assets/chat1.png";

const BASE_URL = "https://foodwaste-production.up.railway.app";

const getCurrentUserId = () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("userData")) ||
      {};
    return user.id || null;
  } catch {
    return null;
  }
};

export const PesanUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const notifRef = useRef(null);

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const userId = getCurrentUserId();

  const fetchRooms = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${BASE_URL}/api/chat?user_id=${userId}`);
      const data = await res.json();

      const rooms = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            user_id: item.user_id,
            toko_id: item.toko_id,
            name: item.nama_toko || "Toko",
            msg: item.last_message || "Belum ada pesan",
            time: item.last_time
              ? new Date(item.last_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            img: item.toko_foto
              ? `${BASE_URL}/uploads/${item.toko_foto}`
              : chat1,
          }))
        : [];

      setConversations(rooms);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 2500);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchMessages = async (chatId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/chat/${chatId}`);
      const data = await res.json();

      const mapped = Array.isArray(data)
        ? data.map((m) => ({
            from: m.sender_id === userId ? "me" : "them",
            text: m.message,
            time: m.created_at
              ? new Date(m.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          }))
        : [];

      setMessages(mapped);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedChatId) return;

    fetchMessages(selectedChatId);
    const interval = setInterval(() => fetchMessages(selectedChatId), 1500);
    return () => clearInterval(interval);
  }, [selectedChatId]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`${BASE_URL}/api/profile/${userId}`);
        const data = await res.json();

        setUserProfile(data);
      } catch (err) {
        console.error("Gagal fetch profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!location.state?.id_toko || !userId) return;

    const { id_toko, nama_produk } = location.state;

    const createRoom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/chat/get-or-create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            toko_id: id_toko,
          }),
        });

        const result = await res.json();
        await fetchRooms();
        setSelectedChatId(result.chat_id);
        setInputText(`Halo, apakah menu \"${nama_produk}\" masih tersedia?`);
        fetchMessages(result.chat_id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    createRoom();
  }, [location.state, userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !selectedChatId || sending) return;

    setSending(true);
    setInputText("");

    try {
      await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: selectedChatId,
          sender_id: userId,
          message: text,
        }),
      });

      fetchMessages(selectedChatId);
      fetchRooms();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const activeChat = conversations.find((c) => c.id === selectedChatId);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 flex pointer-events-none">
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-75"
        />
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-55"
        />
      </div>

      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-3xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-5 z-30">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e]"
          >
            <Bell size={22} />
          </button>
          {showNotif && <NotifDropdown />}
        </div>
        <img
          src={
            userProfile?.foto
              ? `${BASE_URL}/uploads/${userProfile.foto}`
              : userProfil
          }
          alt="profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
          onError={(e) => {
            e.target.src = userProfil;
          }}
        />
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-8 flex gap-4 z-10">
        <SideBar activePage="pesan" />

        <section className="w-80 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-5">
            <h2 className="text-lg font-black text-[#63714e] mb-3">
              Obrolan Toko
            </h2>
            <div className="flex items-center bg-white rounded-full px-4 py-3 gap-2">
              <Search size={15} className="text-gray-400" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari toko..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {loading && (
              <p className="text-center text-xs text-gray-400 py-6">
                Menghubungkan ke toko...
              </p>
            )}
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChatId(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-3xl ${selectedChatId === c.id ? "bg-white border-2 border-[#f8bc22]" : "bg-white/40 hover:bg-white"}`}
              >
                <img src={c.img} alt="" className="w-11 h-11 rounded-full" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between">
                    <h4 className="font-black text-sm text-[#63714e] truncate">
                      {c.name}
                    </h4>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.msg}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 bg-white/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              <div className="px-8 py-5 border-b bg-white/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8bc22] flex items-center justify-center text-white">
                  <Store size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#63714e]">
                    {activeChat.name}
                  </h3>
                  <p className="text-xs text-green-600 font-bold">
                    Merchant sedang aktif
                  </p>
                </div>
              </div>

              <div className="flex-1 px-8 py-6 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-5 py-3 rounded-3xl max-w-md text-sm shadow ${msg.from === "me" ? "bg-[#63714e] text-white" : "bg-white"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="p-5 border-t bg-white/50">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3">
                  <Plus size={18} className="text-gray-400" />
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Tulis pesan..."
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputText.trim() || sending}
                    className="bg-[#63714e] text-white p-2.5 rounded-xl"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
              <MessageCircle size={40} />
              <p>Pilih toko untuk mulai percakapan</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PesanUser;
