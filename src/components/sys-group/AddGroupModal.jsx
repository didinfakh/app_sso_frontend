import React, { useState, useEffect } from "react";
import { fetchApi } from "../../services/ApiService";
import { useToast } from "../../context/ToastContext";
import InputText from "../ui/InputText";

/**
 * AddGroupModal Component
 * Handles both Add and Edit modes for system groups.
 */
function AddGroupModal({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  group = null,
}) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id_sys_group: null,
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === "edit" && group) {
        setFormData({
          id_sys_group: group.id_sys_group || group.id,
          name: group.name || "",
          description: group.description || "",
        });
      } else {
        setFormData({
          id_sys_group: null,
          name: "",
          description: "",
        });
      }
    }
  }, [isOpen, mode, group]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      let response;
      const payload = { ...formData };

      if (mode === "add") {
        response = await fetchApi.postApi("/sys-groups", payload);
      } else {
        response = await fetchApi.putApi(
          `/sys-groups/${formData.id_sys_group}`,
          payload,
        );
      }

      if (response && (response.success || response.status === "success")) {
        showToast(
          mode === "add"
            ? "Grup berhasil ditambahkan"
            : "Grup berhasil diperbarui",
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200 text-[#333]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {mode === "add" ? "Tambah Grup Baru" : "Edit Grup"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <InputText
              label="Nama Grup"
              placeholder="Masukkan nama grup"
              name="name"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              error={errors}
              inputCol
              required
            />
            <div className="flex flex-col md:flex-row md:items-start gap-2">
              <label className="w-full md:w-1/3 text-sm font-semibold text-gray-700 mt-2">
                Deskripsi
              </label>
              <div className="w-full md:w-2/3">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Keterangan grup (opsional)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none min-h-[100px] ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}
              {mode === "add" ? "Simpan Grup" : "Perbarui Grup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGroupModal;
