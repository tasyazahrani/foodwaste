import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import SaveConfirmModal from "../../components/SaveConfirmModal";
import SaveSuccessModal from "../../components/SaveSuccessModal";
import { Bell, ArrowLeft, Save, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/people.png";

export const EditProfil = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(userProfil);
  const [userId, setUserId] = useState(null);

  // ✅ FIX 1: Tambah loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    no_telp: "",
    namaToko: "",
    alamat: "",
    bio: "",
  });

  useEffect(() => {
    // ✅ FIX 2: Gunakan async function di dalam useEffect dengan benar
    const fetchProfil = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          navigate("/login");
          return;
        }

        setUserId(user.id);

        // ✅ FIX 3: await fetch dengan benar
        const res = await fetch(`http://localhost:3000/api/profile/${user.id}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // ✅ FIX 4: Set formData dari response API dengan benar
        setFormData({
          namaLengkap: data.namaLengkap || "",
          email: data.email || "",
          no_telp: data.no_telp || "",
          namaToko: data.namaToko || "",
          alamat: data.alamat || "",
          bio: data.bio || "",
        });

        // ✅ FIX 5: Preview foto dari server
        if (data.foto) {
          setPreviewFoto(`http://localhost:3000/uploads/${data.foto}`);
        }
      } catch (err) {
        console.error("Gagal fetch profil:", err);
        setFetchError("Gagal memuat data profil. Coba refresh halaman.");
      } finally {
        // ✅ FIX 6: Matikan loading setelah fetch selesai (berhasil atau gagal)
        setIsLoading(false);
      }
    };

    fetchProfil();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const simpanProfil = async () => {
    setIsSaving(true);
    const kirimData = new FormData();
    Object.keys(formData).forEach((key) => {
      kirimData.append(key, formData[key]);
    });
    if (selectedFoto) kirimData.append("foto", selectedFoto);

    try {
      const response = await fetch(
        `http://localhost:3000/api/profile/${userId}`,
        { method: "PUT", body: kirimData }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // ✅ FIX 7: Update localStorage dengan data terbaru
      const oldUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...oldUser,
        namaLengkap: formData.namaLengkap,
        namaToko: formData.namaToko,
        foto: data.foto || oldUser.foto,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ FIX 8: Update previewFoto jika server kembalikan foto baru
      if (data.foto) {
        setPreviewFoto(`http://localhost:3000/uploads/${data.foto}`);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert("Gagal update profil. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ FIX 9: Tampilkan loading spinner saat data belum siap
  const LoadingScreen = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="text-[#63714e] animate-spin" />
        <p className="text-[#63714e] font-semibold text-sm">Memuat data profil...</p>
      </div>
    </div>
  );

  // ✅ FIX 10: Tampilkan error jika fetch gagal
  const ErrorScreen = () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-red-500 font-semibold">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 rounded-full bg-[#63714e] text-white text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 z-0 flex w-full h-full pointer-events-none">
        <img className="w-1/2 h-full object-cover opacity-80" src={bgUtama} alt="" />
        <img className="w-1/2 h-full object-cover opacity-60" src={bgUtama} alt="" />
      </div>

      {/* Header */}
      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      {/* Top Right */}
      <div className="absolute top-6 right-12 flex items-center gap-6 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg text-[#63714e]">
          <Bell size={24} strokeWidth={2.5} />
        </button>
        <img src={previewFoto} alt="" className="w-12 h-12 rounded-full object-cover" />
      </div>

      {/* Main Content */}
      <div className="absolute top-24 left-12 right-12 bottom-10 flex items-stretch gap-8 z-10">
        <div className="h-full">
          <SideBar activePage="profil" />
        </div>

        <section className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Title + Buttons */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">Edit Profil</h2>
                <p className="text-xs text-[#63714e]/70">Kelola informasi akun Anda</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/profil")}
                  className="px-5 py-2 rounded-full border border-[#63714e] text-[#63714e] text-sm flex items-center gap-2 hover:bg-[#63714e]/10 transition"
                >
                  <ArrowLeft size={15} />
                  Kembali
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isLoading || isSaving}
                  className="px-5 py-2 rounded-full bg-[#f8bc22] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-60 hover:bg-[#e0a81e] transition"
                >
                  {isSaving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>

            {/* Form Panel */}
            <div className="flex-1 bg-white/60 backdrop-blur-2xl rounded-[35px] shadow-2xl p-7 flex flex-col overflow-y-auto">
              {isLoading ? (
                <LoadingScreen />
              ) : fetchError ? (
                <ErrorScreen />
              ) : (
                <>
                  <h3 className="text-base font-bold text-[#63714e] mb-5">Informasi Akun</h3>

                  {/* Foto */}
                  <div className="flex items-center gap-5 mb-6">
                    <img
                      src={previewFoto}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover shadow-md"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#63714e]">Foto Profil</p>
                      <input type="file" accept="image/*" onChange={handleFoto} className="text-xs mt-2" />
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="flex flex-col gap-4">
                    <InputField
                      icon={<User size={16} />}
                      label="Nama Lengkap"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<Mail size={16} />}
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<Phone size={16} />}
                      label="No Telepon"
                      name="no_telp"
                      type="tel"
                      value={formData.no_telp}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<MapPin size={16} />}
                      label="Alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Panel — Preview Kartu */}
          <div className="w-72 bg-white/60 backdrop-blur-2xl rounded-[35px] shadow-2xl p-7 flex flex-col items-center">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 size={28} className="text-[#63714e] animate-spin" />
              </div>
            ) : (
              <>
                <img
                  src={previewFoto}
                  alt=""
                  className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
                />
                <h2 className="text-xl font-black text-[#63714e] text-center">
                  {formData.namaLengkap || "—"}
                </h2>
                <p className="text-xs text-[#63714e]/70 mt-1 text-center">
                  {formData.email || "—"}
                </p>
                <p className="text-xs text-[#63714e]/70 mt-1 text-center">
                  {formData.no_telp || "—"}
                </p>
                {formData.alamat && (
                  <p className="text-xs text-[#63714e]/60 mt-2 text-center leading-relaxed">
                    {formData.alamat}
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {showConfirm && (
        <SaveConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            simpanProfil();
          }}
        />
      )}

      {showSuccess && <SaveSuccessModal onDone={() => navigate("/profil")} />}
    </main>
  );
};

const InputField = ({ icon, label, name, value, onChange, type = "text" }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[#63714e]/70 px-1">{label}</label>
      <div className="bg-[#7d8767] rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#f8bc22] transition">
        <div className="text-white shrink-0">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/40"
        />
      </div>
    </div>
  );
};
