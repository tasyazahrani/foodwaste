import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import axios from "axios";

import {
  Search,
  Send,
  Bell,
  ChevronDown,
  MessageCircle,
} from "lucide-react";

import SideBarAdmin from "../../components/SideBarAdmin";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";
import chat1 from "../../assets/chat1.png";

// ================= API =================
const BASE_URL =
  "https://foodwaste-production.up.railway.app";

const API = `${BASE_URL}/api`;

export const PesanAdmin = () => {
  // ================= STATE =================
  const [selectedId, setSelectedId] =
    useState(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [inputText, setInputText] =
    useState("");

  const [allConversations, setAllConversations] =
    useState([]);

  const [messages, setMessages] = useState(
    [],
  );

  const [adminData, setAdminData] =
    useState(null);

  const bottomRef = useRef(null);

  // ================= USER =================
  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(
      localStorage.getItem("userData"),
    ) ||
    {};

  const currentUserId =
    currentUser.id || null;

  // ================= SCROLL =================
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "auto",
    });
  };

  // ================= PROFILE =================
  const fetchProfile = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const res = await axios.get(
        `${API}/profile/${currentUserId}`,
      );

      setAdminData(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [currentUserId]);

  // ================= FETCH ROOMS =================
  const fetchAdminRooms = useCallback(
    async () => {
      if (!currentUserId) return;

      try {
        const res = await axios.get(
          `${API}/chat?toko_id=${currentUserId}`,
        );

        const formatted = Array.isArray(
          res.data,
        )
          ? res.data.map((item) => ({
              id: item.id,

              user_id: item.user_id,

              toko_id: item.toko_id,

              name:
                item.nama_pengguna ||
                "Pengguna",

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

              img: item.user_foto
                ? `${BASE_URL}/uploads/${item.user_foto}`
                : chat1,
            }))
          : [];

        setAllConversations((prev) => {
          const oldData =
            JSON.stringify(prev);

          const newData =
            JSON.stringify(formatted);

          if (oldData !== newData) {
            return formatted;
          }

          return prev;
        });

        // auto pilih chat pertama
        if (
          !selectedId &&
          formatted.length > 0
        ) {
          setSelectedId(
            formatted[0].id,
          );
        }
      } catch (err) {
        console.error(err);
      }
    },
    [currentUserId, selectedId],
  );

  // ================= FETCH MESSAGE =================
  const fetchMessages = useCallback(
    async () => {
      if (
        !selectedId ||
        !currentUserId
      )
        return;

      try {
        const res = await axios.get(
          `${API}/chat/${selectedId}`,
        );

        const formatted = Array.isArray(
          res.data,
        )
          ? res.data.map((msg) => ({
              id: msg.id,

              text: msg.message,

              from:
                Number(
                  msg.sender_id,
                ) ===
                Number(currentUserId)
                  ? "me"
                  : "them",

              created_at:
                msg.created_at,
            }))
          : [];

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
      } catch (err) {
        console.error(err);
      }
    },
    [selectedId, currentUserId],
  );

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    if (!selectedId) return;

    try {
      const text = inputText;

      setInputText("");

      // optimistic UI
      const optimisticMessage = {
        id: Date.now(),

        text,

        from: "me",
      };

      setMessages((prev) => [
        ...prev,
        optimisticMessage,
      ]);

      setTimeout(() => {
        scrollToBottom();
      }, 100);

      await axios.post(`${API}/chat`, {
        chat_id: selectedId,

        sender_id: currentUserId,

        message: text,
      });

      fetchMessages();

      fetchAdminRooms();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchProfile();

    fetchAdminRooms();
  }, [fetchProfile, fetchAdminRooms]);

  // polling room
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAdminRooms();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAdminRooms]);

  // polling message
  useEffect(() => {
    if (!selectedId) return;

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedId, fetchMessages]);

  // scroll saat buka room
  useEffect(() => {
    if (!selectedId) return;

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [selectedId]);

  // ================= FILTER =================
  const filtered =
    allConversations.filter((c) =>
      c.name
        .toLowerCase()
        .includes(
          searchValue.toLowerCase(),
        ),
    );

  const activeChat =
    allConversations.find(
      (c) => c.id === selectedId,
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
      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 rounded-full bg-[#f8bc22] flex items-center justify-center shadow-lg">
          <Bell
            size={20}
            className="text-[#63714e]"
          />
        </button>

        <div className="bg-white rounded-full px-3 py-1 flex items-center gap-3 shadow-md">
          <img
            src={
              adminData?.foto
                ? `${BASE_URL}/uploads/${adminData.foto}`
                : userProfil
            }
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="leading-tight">
            <p className="text-sm font-bold text-[#63714e]">
              {adminData?.nama_toko ||
                adminData?.nama_lengkap ||
                "Admin"}
            </p>

            <p className="text-[10px] text-[#63714e]/60">
              Admin
            </p>
          </div>

          <ChevronDown size={14} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4 z-10 overflow-hidden">
        {/* SIDEBAR */}
        <SideBarAdmin activePage="pesanAdmin" />

        {/* LEFT */}
        <section className="w-80 bg-white/45 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5">
            <h2 className="text-lg font-black text-[#63714e] mb-4">
              Pesan Masuk
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
                placeholder="Cari pembeli..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
            {filtered.map((chat) => (
              <button
                key={chat.id}
                onClick={() =>
                  setSelectedId(chat.id)
                }
                className={`w-full flex items-center gap-3 p-3 rounded-3xl transition-all ${
                  selectedId === chat.id
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
            ))}
          </div>
        </section>

        {/* RIGHT CHAT */}
        <section className="flex-1 bg-white/75 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {activeChat ? (
            <>
              {/* HEADER CHAT */}
              <div className="px-7 py-5 border-b bg-white/60 flex items-center gap-3">
                <img
                  src={activeChat.img}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-black text-[#63714e]">
                    {activeChat.name}
                  </h3>

                  <p className="text-xs text-[#63714e]/60">
                    Sedang aktif
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
                      className={`max-w-md px-5 py-3 rounded-3xl text-sm ${
                        msg.from === "me"
                          ? "bg-[#63714e] text-white rounded-br-md"
                          : "bg-white shadow rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                <div ref={bottomRef}></div>
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
                    placeholder="Tulis balasan..."
                    className="flex-1 bg-white rounded-2xl px-5 py-3 outline-none shadow-sm"
                  />

                  <button
                    onClick={sendMessage}
                    className="w-14 h-14 rounded-2xl bg-[#f8bc22] hover:bg-[#e4aa16] flex items-center justify-center text-white shadow-lg"
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
                Pilih percakapan terlebih
                dahulu
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default PesanAdmin;