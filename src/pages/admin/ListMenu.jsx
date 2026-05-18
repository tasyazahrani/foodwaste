import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  Upload,
  Calendar,
  X,
  AlertTriangle,
} from "lucide-react";
import SideBarAdmin from "../../components/SideBarAdmin";
import bgUtama from "../../assets/image.png";
import userProfil from "../../assets/Rectangle.png";
import donatGula from "../../assets/donat gula.jpg";
import croissant from "../../assets/croissant.jpg";
import bolu from "../../assets/bolu.jpg";
import brownies from "../../assets/brownies.jpg";
import cake from "../../assets/cake.jpg";
import cheescake from "../../assets/cheescake.jpg";

const API_URL = "https://foodwaste-production.up.railway.app/api";
const BASE_URL = "https://foodwaste-production.up.railway.app";

const statusStyles = {
  Expired: "bg-red-500 text-white",
  Available: "bg-green-500 text-white",
  "Almost Expired": "bg-yellow-400 text-yellow-900",
};

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#63714e] outline-none";

const emptyForm = {
  name: "",
  description: "",
  productionDate: "",
  expiredDate: "",
  price: "",
  discountPrice: "",
  image: null,
};

const getStatus = (expiredDate) => {
  if (!expiredDate) return "Available";
  const today = new Date();
  const exp = new Date(expiredDate);
  const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff <= 2) return "Almost Expired";
  return "Available";
};

const getExpiryText = (expiredDate) => {
  if (!expiredDate) return "Tidak ada batas";
  const today = new Date();
  const exp = new Date(expiredDate);
  const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  return `Exp. ${diff} hari lagi`;
};

const menuImages = {
  "donat gula": donatGula,
  croissant,
  bolu,
  brownies,
  cake,
  cheescake,
};

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-[#63714e]/70">{label}</span>
      {children}
    </label>
  );
}

function DateInput({ value, onChange }) {
  return (
    <div className="relative flex items-center">
      <Calendar size={14} className="absolute left-3 text-[#63714e]/50" />
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pl-9`}
      />
    </div>
  );
}

function Backdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      {children}
    </div>
  );
}

function MenuCard({ item, onDelete, onEdit }) {
  return (
    <article className="bg-white rounded-[22px] shadow-md overflow-hidden hover:shadow-xl transition-all">
      <div className="relative">
        <img
          src={
            item.image
              ? `${BASE_URL}/uploads/${item.image}`
              : menuImages[item.name.toLowerCase()] || "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt=""
          className="w-full h-36 object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-[10px] font-black px-2 py-1 rounded-full ${statusStyles[item.status]}`}
        >
          {item.status}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-black text-[#63714e] text-sm">{item.name}</h3>
        <p className="text-[11px] text-gray-500">{item.store}</p>

        <div className="mt-1">
          {item.salePrice ? (
            <>
              <p className="text-[10px] line-through text-gray-400">
                {item.price}
              </p>
              <p className="text-sm font-black text-[#f8bc22]">
                {item.salePrice}
              </p>
            </>
          ) : (
            <p className="text-sm font-black text-[#f8bc22]">{item.price}</p>
          )}
        </div>

        <p className="text-[11px] text-[#63714e]/70 mt-1">{item.expiry}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 bg-[#63714e] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
          >
            <Trash2 size={12} /> Hapus
          </button>
        </div>
      </div>
    </article>
  );
}

const ListMenuAdmin = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [menuCards, setMenuCards] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [editImagePreview, setEditImagePreview] = useState("");
  const [adminData, setAdminData] = useState(null);

  const currentUser =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("userData")) ||
    {};
  const currentUserId = currentUser.id;

  const loadAdminProducts = async () => {
    if (!currentUserId) return;
    try {
      const data = await fetch(`${BASE_URL}/api/produk/toko/${currentUserId}`).then(
        (res) => res.json(),
      );
      const mapped = data.map((item) => ({
        id_produk: item.id_produk,
        name: item.nama_produk,
        price: "Rp. " + item.harga,
        salePrice: item.harga_diskon ? "Rp. " + item.harga_diskon : null,
        description: item.deskripsi,
        productionDate: item.created_at || "",
        expiredDate: item.expired_date || "",
        store: item.nama_toko || "Toko Saya",
        image: item.image,
        status: getStatus(item.expired_date),
        expiry: getExpiryText(item.expired_date),
      }));
      setMenuCards(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserId) return;
      try {
        const res = await fetch(`${API_URL}/profile/${currentUserId}`);
        const data = await res.json();
        setAdminData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
    loadAdminProducts();
  }, [currentUserId]);

  const handleFormChange = (field, value) => {
    if (field === "image") {
      setForm((prev) => ({ ...prev, image: value }));
      setImagePreview(value ? URL.createObjectURL(value) : "");
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditFormChange = (field, value) => {
    if (field === "image") {
      setEditForm((prev) => ({ ...prev, image: value }));
      setEditImagePreview(
        value ? URL.createObjectURL(value) : editImagePreview,
      );
      return;
    }
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setForm(emptyForm);
    setImagePreview("");
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditForm(emptyForm);
    setEditImagePreview("");
  };

  const openEdit = (item) => {
    setEditTarget(item);
    setEditForm({
      name: item.name,
      description: item.description,
      productionDate: item.productionDate,
      expiredDate: item.expiredDate,
      price: item.price.replace(/\D/g, ""),
      discountPrice: item.salePrice ? item.salePrice.replace(/\D/g, "") : "",
      image: null,
    });
    setEditImagePreview(
      item.image ? `${BASE_URL}/uploads/${item.image}` : bgUtama,
    );
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_produk", form.name);
    formData.append("harga", parseInt(form.price) || 0);
    formData.append("harga_diskon", parseInt(form.discountPrice) || null);
    formData.append("deskripsi", form.description);
    formData.append("expired_date", form.expiredDate);
    formData.append("production_date", form.productionDate);
    formData.append("id_toko", currentUserId);
    if (form.image) formData.append("image", form.image);

    await fetch(`${API_URL}/produk`, { method: "POST", body: formData });
    await loadAdminProducts();
    closeAdd();
  };

  const handleDeleteMenu = async (id) => {
    await fetch(`${API_URL}/produk/${id}`, { method: "DELETE" });
    await loadAdminProducts();
    setDeleteTarget(null);
  };

  const handleEditMenu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_produk", editForm.name);
    formData.append("harga", parseInt(editForm.price) || 0);
    formData.append("harga_diskon", parseInt(editForm.discountPrice) || null);
    formData.append("deskripsi", editForm.description);
    formData.append("expired_date", editForm.expiredDate);
    formData.append("production_date", editForm.productionDate);
    if (editForm.image) formData.append("image", editForm.image);

    await fetch(`${API_URL}/produk/${editTarget.id_produk}`, {
      method: "PUT",
      body: formData,
    });
    await loadAdminProducts();
    closeEdit();
  };

  const filteredMenus = useMemo(() => {
    const q = search.toLowerCase();
    return menuCards.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(q) ||
        item.store.toLowerCase().includes(q);
      const matchStatus = status === "All" || item.status === status;
      return matchSearch && matchStatus;
    });
  }, [search, status, menuCards]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#effae8] font-sans">
      <div className="fixed inset-0 z-0 flex">
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
        <div className="px-7 py-3 bg-[#63714ed1] rounded-3xl shadow-xl">
          <h1 className="text-2xl font-black italic text-white">
            Food <span className="text-[#eb9f29]">Waste</span>
          </h1>
        </div>
      </header>

      <div className="absolute top-6 right-12 flex items-center gap-4 z-30">
        <button className="w-11 h-11 bg-[#f8bc22] rounded-full flex items-center justify-center shadow-lg">
          <Bell size={20} className="text-[#63714e]" />
        </button>
        <div className="bg-white rounded-full px-3 py-1 flex items-center gap-3 shadow-md">
          <img
            src={
              adminData?.foto
                ? `${BASE_URL}/uploads/${adminData.foto}`
                : userProfil
            }
            alt="Profil"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#63714e]">
              {adminData?.nama_toko || adminData?.nama_lengkap || "Admin"}
            </span>
            <span className="text-[10px] text-[#63714e]/60">Admin</span>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="absolute top-24 left-12 right-12 bottom-4 flex gap-4 z-10 overflow-hidden">
        <SideBarAdmin activePage="menuAdmin" />

        <section className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white/75 rounded-[28px] shadow-xl px-8 py-5 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-[#63714e]">List Menu</h1>
              <p className="text-sm text-[#63714e]/60">
                Kelola menu toko milik akun ini.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none text-sm text-[#63714e]"
                />
                <Search size={16} />
              </div>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-full text-sm font-bold text-[#63714e]"
              >
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Almost Expired">Almost Expired</option>
                <option value="Expired">Expired</option>
              </select>

              <button
                onClick={() => setIsAddOpen(true)}
                className="bg-[#f8bc22] text-white px-5 py-2.5 rounded-full font-black flex items-center gap-2"
              >
                <Plus size={16} /> Add Menu
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4 pb-6">
            {filteredMenus.map((item) => (
              <MenuCard
                key={item.id_produk}
                item={item}
                onDelete={setDeleteTarget}
                onEdit={openEdit}
              />
            ))}
          </div>
        </section>
      </div>

      {isAddOpen && (
        <Backdrop>
          <form
            onSubmit={handleAddMenu}
            className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-black text-xl text-[#63714e]">Tambah Menu</h2>
              <button type="button" onClick={closeAdd}>
                <X />
              </button>
            </div>
            <Field label="Nama Produk">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal Produksi">
                <DateInput
                  value={form.productionDate}
                  onChange={(val) => handleFormChange("productionDate", val)}
                />
              </Field>
              <Field label="Tanggal Expired">
                <DateInput
                  value={form.expiredDate}
                  onChange={(val) => handleFormChange("expiredDate", val)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga Normal">
                <input
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => handleFormChange("price", e.target.value)}
                />
              </Field>
              <Field label="Harga Diskon">
                <input
                  className={inputClass}
                  value={form.discountPrice}
                  onChange={(e) =>
                    handleFormChange("discountPrice", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Upload Gambar">
              <input
                type="file"
                onChange={(e) => handleFormChange("image", e.target.files[0])}
              />
            </Field>
            {imagePreview && (
              <img
                src={imagePreview}
                alt=""
                className="w-full h-32 object-cover rounded-2xl"
              />
            )}
            <button className="w-full bg-[#f8bc22] text-white py-3 rounded-2xl font-black">
              Simpan Menu
            </button>
          </form>
        </Backdrop>
      )}

      {editTarget && (
        <Backdrop>
          <form
            onSubmit={handleEditMenu}
            className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-black text-xl text-[#63714e]">Edit Menu</h2>
              <button type="button" onClick={closeEdit}>
                <X />
              </button>
            </div>
            <Field label="Nama Produk">
              <input
                className={inputClass}
                value={editForm.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                className={inputClass}
                value={editForm.description}
                onChange={(e) =>
                  handleEditFormChange("description", e.target.value)
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal Produksi">
                <DateInput
                  value={editForm.productionDate}
                  onChange={(val) =>
                    handleEditFormChange("productionDate", val)
                  }
                />
              </Field>
              <Field label="Tanggal Expired">
                <DateInput
                  value={editForm.expiredDate}
                  onChange={(val) => handleEditFormChange("expiredDate", val)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Harga Normal">
                <input
                  className={inputClass}
                  value={editForm.price}
                  onChange={(e) =>
                    handleEditFormChange("price", e.target.value)
                  }
                />
              </Field>
              <Field label="Harga Diskon">
                <input
                  className={inputClass}
                  value={editForm.discountPrice}
                  onChange={(e) =>
                    handleEditFormChange("discountPrice", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Ganti Gambar">
              <input
                type="file"
                onChange={(e) =>
                  handleEditFormChange("image", e.target.files[0])
                }
              />
            </Field>
            {editImagePreview && (
              <img
                src={editImagePreview}
                alt=""
                className="w-full h-32 object-cover rounded-2xl"
              />
            )}
            <button className="w-full bg-[#63714e] text-white py-3 rounded-2xl font-black">
              Update Menu
            </button>
          </form>
        </Backdrop>
      )}

      {deleteTarget && (
        <Backdrop>
          <div className="bg-white rounded-3xl p-6 text-center shadow-2xl">
            <AlertTriangle size={38} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-black text-lg text-[#63714e]">Hapus Menu?</h3>
            <p className="text-sm text-gray-500 mt-1 mb-5">
              {deleteTarget.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border py-2 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteMenu(deleteTarget.id_produk)}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl"
              >
                Hapus
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </main>
  );
};

export default ListMenuAdmin;
