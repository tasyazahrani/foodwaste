import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Send, MessageCircle, Store, ChevronDown } from "lucide-react";

import SideBar from "../../components/SideBar";
import NotifDropdown from "../../components/NotifDropdown";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";
import chat1 from "../../assets/chat1.png";

// ================= API =================
const API = import.meta.env.VITE_API_URL || "https://foodwaste-production.up.railway.app/api";

// ================= USER =================
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) ||
           JSON.parse(localStorage.getItem("userData")) ||
           {};
  } catch {
    return {};
  }
};

export const PesanUser = () => {
  const location = useLocation();

  const messagesEndRef = useRef(null);
  const notifRef = useRef(null);

  // ================= STATE =================
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [userData, setUserData] = useState(null);

  const currentUser = getCurrentUser();
  const userId = currentUser.id;

  // ================= SCROLL =================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ================= PROFILE =================
  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API}/profile/${userId}`);
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  // ================= ROOMS =================
  const fetchRooms = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(`${API}/chat?user_id=${userId}`);
      const data = await res.json();

      const formatted = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            name: item.nama_toko || "Toko",
            msg: item.last_message || "Belum ada pesan",
            time: item.last_time
              ? new Date(item.last_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            img: item.toko_foto
              ? `${API.replace("/api", "")}/uploads/${item.toko_foto}`
              : chat1,
          }))
        : [];

      setConversations(formatted);

      if (!selectedChatId && formatted.length > 0) {
        setSelectedChatId(formatted[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId, selectedChatId]);

  // ================= MESSAGES =================
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !userId) return;

    try {
      const res = await fetch(`${API}/chat/${selectedChatId}`);
      const data = await res.json();

      const formatted = Array.isArray(data)
        ? data.map((m) => ({
            id: m.id,
            text: m.message,
            from: Number(m.sender_id) === Number(userId) ? "me" : "them",
            time: m.created_at
              ? new Date(m.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          }))
        : [];

      setMessages(formatted);
    } catch (err) {
      console.error(err);
    }
  }, [selectedChatId, userId]);

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || !selectedChatId || sending) return;

    try {
      setSending(true);

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text, from: "me" },
      ]);

      setInputText("");
      scrollToBottom();

      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: selectedChatId,
          sender_id: userId,
          message: text,
        }),
      });

      if (!res.ok) throw new Error("Gagal kirim pesan");

      await fetchMessages();
      await fetchRooms();

      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchProfile();
    fetchRooms();

    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, [fetchProfile, fetchRooms]);

  // ================= CHAT ACTIVE =================
  useEffect(() => {
    if (!selectedChatId) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    setTimeout(scrollToBottom, 200);

    return () => clearInterval(interval);
  }, [selectedChatId, fetchMessages]);

  // ================= CLOSE NOTIF =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const activeChat = conversations.find((c) => c.id === selectedChatId);

  return (
    <main className="w-screen h-screen bg-[#effae8] relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="fixed inset-0 flex">
        <img src={bgUtama} className="w-1/2 object-cover opacity-70" />
        <img src={bgUtama} className="w-1/2 object-cover opacity-50" />
      </div>

      {/* SIDEBAR */}
      <SideBar activePage="pesan" />

      {/* CHAT LIST */}
      <section className="absolute left-12 top-24 w-80 bg-white/60 rounded-3xl p-4 flex flex-col">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Cari toko..."
          className="p-2 rounded-xl mb-3"
        />

        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedChatId(c.id)}
            className={`p-3 rounded-xl mb-2 ${
              selectedChatId === c.id ? "bg-green-700 text-white" : "bg-white"
            }`}
          >
            <div className="font-bold">{c.name}</div>
            <div className="text-xs truncate">{c.msg}</div>
          </button>
        ))}
      </section>

      {/* CHAT BOX */}
      <section className="absolute left-[420px] right-12 top-24 bottom-4 bg-white/80 rounded-3xl flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b flex items-center gap-3">
          <Store />
          <div className="font-bold">
            {activeChat?.name || "Pilih chat"}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 flex ${
                m.from === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl max-w-xs ${
                  m.from === "me"
                    ? "bg-green-700 text-white"
                    : "bg-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 flex gap-2 border-t">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-3 rounded-xl"
            placeholder="Tulis pesan..."
          />

          <button
            onClick={sendMessage}
            className="bg-green-700 text-white px-4 rounded-xl"
          >
            <Send />
          </button>
        </div>
      </section>

    </main>
  );
};

export default PesanUser;