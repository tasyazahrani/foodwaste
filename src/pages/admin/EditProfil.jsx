import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  Bell,
  ChevronDown,
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Store,
  MapPin,
  FileText,
  Camera,
} from "lucide-react";

import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {children}
    </div>
  );
}

function ConfirmModal({ onClose, onConfirm }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <h2 className="font-black text-[#63714e] text-lg mb-3">
          Simpan Perubahan?
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Informasi admin akan diperbarui.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border">
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-xl bg-[#f8bc22] text-white"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

function SuccessModal({ onDone }) {
  return (
    <Backdrop>
      <div className="bg-white rounded-[28px] shadow-2xl w-80 p-7 text-center">
        <h2 className="font-black text-[#63714e] text-lg mb-3">
          Profil Disimpan!
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Profil admin berhasil diperbarui.
        </p>
        <button
          onClick={onDone}
          className="w-full py-2 rounded-xl bg-[#63714e] text-white"
        >
          Selesai
        </button>
      </div>
    </Backdrop>
  );
}

function InputField({ icon, label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#63714e]/70">{label}</label>
      <div className="bg-[#7d8767] rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="text-white">{icon}</div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white text-sm"
        />
      </div>
    </div>
  );
}

function TextareaField({ icon, label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#63714e]/70">{label}</label>
      <div className="bg-[#7d8767] rounded-2xl px-4 py-3 flex items-start gap-3">
        <div className="text-white mt-1">{icon}</div>
        <textarea
          rows={3}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-white text-sm resize-none"
        />
      </div>
    </div>
  );
}

export const EditProfilAdmin = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [avatar, setAvatar] = useState(userProfil);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    email: "",
    no_telp: "",
    namaToko: "",
    alamat: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    setUserId(user.id);

    fetch(`http://localhost:3000/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          namaLengkap: data.namaLengkap || "",
          email: data.email || "",
          no_telp: data.no_telp || "",
          namaToko: data.namaToko || "",
          alamat: data.alamat || "",
          bio: data.bio || "",
        });

        if (data.foto) {
          setAvatar(`http://localhost:3000/uploads/${data.foto}`);
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFoto(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const simpanProfil = async () => {
    const kirimData = new FormData();

    Object.keys(formData).forEach((key) => {
      kirimData.append(key, formData[key]);
    });

    if (selectedFoto) {
      kirimData.append("foto", selectedFoto);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/profile/${userId}`,
        {
          method: "PUT",
          body: kirimData,
        },
      );

      const data = await response.json();

      const oldUser = JSON.parse(localStorage.getItem("user")) || {};

      console.log(formData);

      const updatedUser = {
        ...oldUser,
        namaLengkap: formData.namaLengkap,   
        namaToko: formData.namaToko,         
        foto: data.foto || oldUser.foto,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowSuccess(true);

      window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Gagal update profil");
      }
  };

  return (
    <main className="relative w-screen h-screen bg-[#effae8] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 flex w-full h-full">
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-80"
        />
        <img
          src={bgUtama}
          alt=""
          className="w-1/2 h-full object-cover opacity-60"
        />
      </div>

      <header className="absolute top-6 left-12 z-30">
        <div className="px-7 py-3 bg-[#63714ed1] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center text-[#63714e]">
          <Bell size={24} />
        </button>
        <div className="flex items-center gap-2 bg-white rounded-full pr-3">
          <img
            src={avatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-bold text-[#63714e]">Admin</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4">
        <SideBarAdmin activePage="profilAdmin" />

        <section className="flex-1 flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#63714e]">
                  Edit Profil Admin
                </h2>
                <p className="text-xs text-[#63714e]/70">
                  Kelola informasi akun dan bisnis
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/admin/profil")}
                  className="px-5 py-2 rounded-full border flex items-center gap-2"
                >
                  <ArrowLeft size={15} />
                  Kembali
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-5 py-2 rounded-full bg-[#f8bc22] text-white flex items-center gap-2"
                >
                  <Save size={15} />
                  Simpan
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="bg-white/60 backdrop-blur-2xl p-7 rounded-[28px]">
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt=""
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#f8bc22] rounded-full flex items-center justify-center cursor-pointer">
                      <Camera size={14} className="text-white" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    icon={<User size={15} />}
                    label="Nama Admin"
                    name="namaLengkap"
                    value={formData.namaLengkap || ""}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Mail size={15} />}
                    label="Email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Phone size={15} />}
                    label="No Telepon"
                    name="no_telp"
                    value={formData.no_telp || ""}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<Store size={15} />}
                    label="Nama Toko"
                    name="namaToko"
                    value={formData.namaToko || ""}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<MapPin size={15} />}
                    label="Alamat"
                    name="alamat"
                    value={formData.alamat|| ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-64 bg-white/55 backdrop-blur-2xl p-6 rounded-[28px]">
            <img
              src={avatar}
              alt=""
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
            <h4 className="text-base font-black text-[#63714e] text-center">
              {formData.namaLengkap}
            </h4>
            <p className="text-[10px] text-center text-[#63714e]/70">
              {formData.email}
            </p>
            <p className="text-[10px] text-center text-[#63714e]/70">
              {formData.namaToko}
            </p>
          </div>
        </section>
      </div>

      {showConfirm && (
        <ConfirmModal
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            setShowConfirm(false);
            simpanProfil();
          }}
        />
      )}

      {showSuccess && <SuccessModal onDone={() => navigate("/admin/profil")} />}
    </main>
  );
};

export default EditProfilAdmin;
