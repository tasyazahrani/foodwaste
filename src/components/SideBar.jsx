import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";

import userAvatar from "../assets/people.png";

const SideBar = ({ activePage }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // AMBIL USER LOGIN
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}",
  );

  // FOTO DINAMIS
  const profilePhoto = currentUser?.foto
    ? `http://localhost:3000/uploads/${currentUser.foto}`
    : userAvatar;

  // NAMA DINAMIS
  const profileName =
    currentUser?.nama_lengkap || "Pengguna";

  const menuItems = [
    { id: "home", icon: Home, label: "Dashboard", route: "/dashboarduser" },
    { id: "menu", icon: ShoppingBag, label: "List Menu", route: "/menu" },
    { id: "pesan", icon: MessageCircle, label: "Pesan", route: "/pesan" },
    { id: "profil", icon: User, label: "Profil", route: "/profil" },
  ];

  const userPhoto = currentUser?.foto
    ? `http://localhost:3000/uploads/${currentUser.foto}`
    : userAvatar;

  const displayName =
    currentUser?.namaLengkap ||
    currentUser?.namaToko ||
    "Pengguna";

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative h-full bg-[#63714e]/90 backdrop-blur-md rounded-[30px] flex flex-col z-50 shadow-2xl transition-all duration-300 ease-in-out border border-white/10 ${
        isHovered ? "w-52 px-3" : "w-16 px-0"
      }`}
    >
      {/* USER MINI */}
      <div
        className={`flex items-center mt-6 mb-8 transition-all duration-300 ${
          isHovered
            ? "bg-[#f8bc22] rounded-full py-2 px-3 mx-2"
            : "justify-center"
        }`}
      >
        <img
          src={userPhoto}
          alt="User"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
        />

        {isHovered && (
          <span className="ml-2 font-bold text-white text-xs whitespace-nowrap">
            {displayName}
          </span>
        )}
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.route)}
              className={`flex items-center h-14 transition-all duration-300 ${
                isHovered ? "px-3 rounded-full mx-1" : "justify-center"
              } ${
                isActive
                  ? "bg-[#f8bc22] shadow-lg scale-105"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-center w-8">
                <Icon
                  size={20}
                  className={isActive ? "text-[#63714e]" : "text-white"}
                  strokeWidth={2.5}
                />
              </div>

              {isHovered && (
                <span
                  className={`ml-2 font-bold text-xs ${
                    isActive ? "text-white" : "text-[#f8bc22]"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SideBar;