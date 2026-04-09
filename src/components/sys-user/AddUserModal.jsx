import React, { useState, useEffect } from "react";
import { fetchApi } from "../../services/ApiService";
import { useToast } from "../../context/ToastContext";
import InputText from "../ui/InputText";
import InputSelect from "../ui/InputSelect";

/**
 * AddUserModal Component
 * Handles both Add and Edit modes for system users.
 */
function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  user = null,
  groups = [],
}) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id_user: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    telegram_number: "",
    id_sys_group: "",
  });

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === "edit" && user) {
        setFormData({
          id_user: user.id_user || user.id,
          name: user.name || "",
          email: user.email || "",
          password: "", // Leave blank on edit
          password_confirmation: "",
          telegram_number: user.telegram_number || "",
          id_sys_group: String(
            user.id_sys_group ||
              user.id_group ||
              user.group_id ||
              (user.groups && user.groups.length > 0
                ? user.groups[0].id_sys_group || user.groups[0].id_group
                : "") ||
              user.sys_group?.id_sys_group ||
              user.group?.id_sys_group ||
              user.group?.id ||
              "",
          ),
        });
      } else {
        setFormData({
          id_user: null,
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          telegram_number: "",
          id_sys_group: "",
        });
      }
    }
  }, [isOpen, mode, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      let response;
      const payload = { ...formData };

      // Remove password if empty on edit
      if (mode === "edit" && !payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      if (mode === "add") {
        response = await fetchApi.postApi("/sys-users", payload);
      } else {
        response = await fetchApi.putApi(
          `/sys-users/${formData.id_user}`,
          payload,
        );
      }

      if (response && (response.success || response.status === "success")) {
        showToast(
          mode === "add"
            ? "User berhasil ditambahkan"
            : "User berhasil diperbarui",
          "success",
        );
        onSuccess && onSuccess();
        onClose();
      } else if (response && response.errors) {
        setErrors(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Terjadi kesalahan validasi", "error");
      } else {
        showToast(response?.message || "Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Tambah User Baru" : "Edit User"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <InputText
              label="Nama User"
              placeholder="Masukkan nama lengkap"
              name="name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              error={errors}
              inputCol
            />
            <InputText
              label="Email"
              placeholder="name@example.com"
              name="email"
              type="email"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              error={errors}
              inputCol
            />
            <InputSelect
              label="Grup / Role"
              name="id_sys_group"
              data={groups}
              value={formData.id_sys_group}
              onChange={(val) =>
                setFormData({ ...formData, id_sys_group: val })
              }
              error={errors}
              inputCol
              placeholder="Pilih Grup..."
            />
            <InputText
              label={
                mode === "edit"
                  ? "Password (Kosongkan jika tidak diubah)"
                  : "Password"
              }
              placeholder="••••••••"
              name="password"
              type="password"
              value={formData.password}
              onChange={(val) => setFormData({ ...formData, password: val })}
              error={errors}
              inputCol
            />
            <InputText
              label="Konfirmasi Password"
              placeholder="••••••••"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={(val) =>
                setFormData({ ...formData, password_confirmation: val })
              }
              error={errors}
              inputCol
            />
            <InputText
              label="Nomor Telegram"
              placeholder="081234..."
              name="telegram_number"
              value={formData.telegram_number}
              onChange={(val) =>
                setFormData({ ...formData, telegram_number: val })
              }
              error={errors}
              inputCol
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}
              {mode === "add" ? "Simpan User" : "Perbarui User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
