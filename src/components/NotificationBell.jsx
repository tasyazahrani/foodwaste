import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import NotifDropdown from "./NotifDropdown";

const NotificationBell = () => {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setShowNotif(!showNotif)}
        className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e]"
      >
        <Bell size={24} strokeWidth={2.5} />
      </button>
      {showNotif && <NotifDropdown />}
    </div>
  );
};

export default NotificationBell;