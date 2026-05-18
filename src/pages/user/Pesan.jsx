import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { useLocation } from "react-router-dom";

import {
  Bell,
  Search,
  Send,
  MessageCircle,
  Store,
  ChevronDown,
} from "lucide-react";

import SideBar from "../../components/SideBar";
import NotifDropdown from "../../components/NotifDropdown";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";
import chat1 from "../../assets/chat1.png";

// ================= API =================
const API =
  import.meta.env.VITE_API_URL ||
  "https://foodwaste-production.up.railway.app/api";

// ================= GET USER =================
const getCurrentUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("userData")) ||
      {}
    );
  } catch {
    return {};
  }
};

export const PesanUser = () => {
  const location = useLocation();

  const messagesEndRef = useRef(null);
  const notifRef = useRef(null);

  // ================= STATE =================
  const [selectedChatId, setSelectedChatId] =
    useState(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [inputText, setInputText] = useState("");

  const [conversations, setConversations] =
    useState([]);

  const [messages, setMessages] = useState([]);

  const [showNotif, setShowNotif] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [userData, setUserData] =
    useState(null);

  // ================= USER =================
  const currentUser = getCurrentUser();

  const userId = currentUser.id || null;

  // ================= AUTO SCROLL =================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  };

  // ================= FETCH PROFILE =================
  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${API}/profile/${userId}`,
      );

      const data = await res.json();

      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  // ================= FETCH ROOMS =================
  const fetchRooms = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${API}/chat?user_id=${userId}`,
      );

      const data = await res.json();

      const formatted = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,

            user_id: item.user_id,

            toko_id: item.toko_id,

            name:
              item.nama_toko || "Toko",

            msg:
              item.last_message ||
              "Belum ada pesan",

            time: item.last_time
              ? new Date(
                  item.last_time,
                ).toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )
              : "",

            img: item.toko_foto
              ? `${
                  API.replace("/api", "")
                }/uploads/${
                  item.toko_foto
                }`
              : chat1,
          }))
        : [];

      setConversations(formatted);

      if (
        !selectedChatId &&
        formatted.length > 0
      ) {
        setSelectedChatId(formatted[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [userId, selectedChatId]);

  // ================= FETCH MESSAGE =================
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId || !userId) return;

    try {
      const res = await fetch(
        `${API}/chat/${selectedChatId}`,
      );

      const data = await res.json();

      const formatted = Array.isArray(data)
        ? data.map((m) => ({
            id: m.id,

            text: m.message,

            from:
              Number(m.sender_id) ===
              Number(userId)
                ? "me"
                : "them",

            time: m.created_at
              ? new Date(
                  m.created_at,
                ).toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )
              : "",
          }))
        : [];

      // supaya gak jedag jedug
      setMessages((prev) => {
        const oldData =
          JSON.stringify(prev);

        const newData =
          JSON.stringify(formatted);

        if (oldData !== newData) {
          return formatted;
        }

        return prev;
      });

      scrollBottom();
    } catch (err) {
      console.error(err);
    }
  }, [selectedChatId, userId]);

  // ================= CREATE ROOM =================
  useEffect(() => {
    if (
      !location.state?.id_toko ||
      !userId
    )
      return;

    const { id_toko, nama_produk } =
      location.state;

    const createRoom = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${API}/chat/get-or-create`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user_id: userId,
              toko_id: id_toko,
            }),
          },
        );

        const result = await res.json();

        await fetchRooms();

        setSelectedChatId(
          result.chat_id,
        );

        setInputText(
          `Halo, apakah menu "${nama_produk}" masih tersedia?`,
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    createRoom();
  }, [location.state, userId, fetchRooms]);

  // ================= SEND =================
  const sendMessage = async () => {
    const text = inputText.trim();

    if (
      !text ||
      !selectedChatId ||
      sending
    )
      return;

    try {
      setSending(true);

      setInputText("");

      // optimistic UI
      const optimistic = {
        id: Date.now(),
        text,
        from: "me",
      };

      setMessages((prev) => [
        ...prev,
        optimistic,
      ]);

      scrollBottom();

      await fetch(`${API}/chat`, {
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

      scrollToBottom();

    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchProfile();
    fetchRooms();

    const interval = setInterval(() => {
      fetchRooms();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchProfile, fetchRooms]);

  useEffect(() => {
    if (!selectedChatId) return;

    const loadChat = async () => {
      await fetchMessages(selectedChatId);

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };

    loadChat();

    const interval = setInterval(() => {
      fetchMessages(selectedChatId);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedChatId]);

  // ================= CLOSE NOTIF =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(
          e.target,
        )
      ) {
        setShowNotif(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  // ================= FILTER =================
  const filteredConversations =
    conversations.filter((c) =>
      c.name
        .toLowerCase()
        .includes(
          searchValue.toLowerCase(),
        ),
    );

  const activeChat =
    conversations.find(
      (c) => c.id === selectedChatId,
    );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#effae8] font-sans">
      {/* BACKGROUND */}
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

      {/* HEADER */}
      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-3xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food{" "}
            <span className="text-[#eb9f29]">
              Waste
            </span>
          </h1>
        </div>
      </header>

      {/* TOP RIGHT */}
      <div className="absolute top-6 right-12 flex items-center gap-5 z-30">
        {/* NOTIF */}
        <div
          className="relative"
          ref={notifRef}
        >
          <button
            onClick={() =>
              setShowNotif(!showNotif)
            }
            className="w-11 h-11 rounded-full bg-[#f8bc22] flex items-center justify-center shadow-lg"
          >
            <Bell
              size={20}
              className="text-[#63714e]"
            />
          </button>

          {showNotif && (
            <NotifDropdown />
          )}
        </div>

        {/* PROFILE */}
        <div className="bg-white rounded-full px-3 py-1 flex items-center gap-3 shadow-md">
          <img
            src={
              userData?.foto
                ? `${
                    API.replace(
                      "/api",
                      "",
                    )
                  }/uploads/${
                    userData.foto
                  }`
                : userProfil
            }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="leading-tight">
            <p className="text-sm font-bold text-[#63714e]">
              {userData?.nama_lengkap ||
                "User"}
            </p>

            <p className="text-[10px] text-[#63714e]/60">
              Customer
            </p>
          </div>

          <ChevronDown size={14} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4 z-10 overflow-hidden">
        {/* SIDEBAR */}
        <SideBar activePage="pesan" />

        {/* CHAT LIST */}
        <section className="w-80 bg-white/45 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5">
            <h2 className="text-lg font-black text-[#63714e] mb-4">
              Obrolan Toko
            </h2>

            <div className="bg-white rounded-full px-4 py-3 flex items-center gap-2 shadow">
              <Search
                size={16}
                className="text-gray-400"
              />

              <input
                type="text"
                value={searchValue}
                onChange={(e) =>
                  setSearchValue(
                    e.target.value,
                  )
                }
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

            {filteredConversations.map(
              (chat) => (
                <button
                  key={chat.id}
                  onClick={() =>
                    setSelectedChatId(
                      chat.id,
                    )
                  }
                  className={`w-full flex items-center gap-3 p-3 rounded-3xl transition-all ${
                    selectedChatId ===
                    chat.id
                      ? "bg-[#63714e] text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <img
                    src={chat.img}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-sm truncate">
                        {chat.name}
                      </h4>

                      <span className="text-[10px] opacity-70">
                        {chat.time}
                      </span>
                    </div>

                    <p className="text-xs truncate opacity-70">
                      {chat.msg}
                    </p>
                  </div>
                </button>
              ),
            )}
          </div>
        </section>

        {/* CHAT */}
        <section className="flex-1 bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              {/* HEADER CHAT */}
              <div className="px-7 py-5 border-b bg-white/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8bc22] flex items-center justify-center text-white">
                  <Store size={20} />
                </div>

                <div>
                  <h3 className="font-black text-[#63714e]">
                    {activeChat.name}
                  </h3>

                  <p className="text-xs text-green-600 font-bold">
                    Merchant aktif
                  </p>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.from === "me"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md px-5 py-3 rounded-3xl text-sm leading-relaxed shadow transition-all ${
                        msg.from === "me"
                          ? "bg-[#63714e] text-white rounded-br-md"
                          : "bg-white rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef}></div>
              </div>

              {/* INPUT */}
              <div className="p-5 border-t bg-white/50">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) =>
                      setInputText(
                        e.target.value,
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      sendMessage()
                    }
                    placeholder="Tulis pesan..."
                    className="flex-1 bg-white rounded-2xl px-5 py-3 outline-none shadow-sm"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={
                      !inputText.trim() ||
                      sending
                    }
                    className="w-14 h-14 rounded-2xl bg-[#63714e] hover:bg-[#556245] flex items-center justify-center text-white shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#63714e]/50">
              <MessageCircle size={50} />

              <p className="mt-3 text-sm">
                Pilih toko untuk mulai
                percakapan
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PesanUser;