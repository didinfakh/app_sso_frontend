import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { fetchApi } from "../../services/ApiService";
import { useToast } from "../../context/ToastContext";
import InputText from "../ui/InputText";
import InputSelect from "../ui/InputSelect";

const AddProgramModal = ({
  isOpen,
  onClose,
  onSuccess,
  modalMode = "add",
  item = null,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    id_user_leader: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (modalMode === "edit" && item) {
        setFormData({
          id: item.id || item.id_program,
          name: item.name || "",
          description: item.description || "",
          start_date: item.start_date || "",
          end_date: item.end_date || "",
          id_user_leader: String(
            item.id_user_leader || item.id_auth_user_leader || "",
          ),
        });
      } else {
        setFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          id_user_leader: "",
        });
      }
    }
  }, [isOpen, modalMode, item]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetchApi.getApi("/sys-users?pagesize=1000");
      if (response && response.data) {
        setUsers(
          response.data.map((u) => ({
            value: String(u.id_sys_user || u.id_user || u.id),
            label: u.name || u.username,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      let response;
      // Ensure we send the data the backend expects.
      // Based on previous code, we'll try sending id_user_leader.
      const payload = {
        ...formData,
        id_user_leader: formData.id_user_leader,
      };

      if (modalMode === "add") {
        response = await fetchApi.postApi("/program-kerja", payload);
      } else {
        const id = formData.id || item?.id || item?.id_program;
        response = await fetchApi.putApi(`/program-kerja/${id}`, payload);
      }

      if (response && (response.success || response.status === "success")) {
        showToast(
          modalMode === "add"
            ? "Program Kerja berhasil ditambahkan"
            : "Program Kerja berhasil diperbarui",
          "success",
        );
        onSuccess && onSuccess();
        if (modalMode === "add") {
          setFormData({
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            id_user_leader: "",
          });
        }
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

  // Use Portal to render outside the sidebar in the DOM
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {modalMode === "add"
              ? "Tambah Program Kerja"
              : "Edit Program Kerja"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 text-left">
            <InputText
              placeholder="Nama Program Kerja"
              name="name"
              label="Nama Program"
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
              error={errors}
              inputCol
              disabled={false}
            />

            <div className="grid grid-cols-1 gap-x-8">
              <div
                className={`font-semibold text-sm ${errors.description ? "text-red-500" : "text-[#333]"}`}
              >
                Deskripsiiiii
              </div>
              <div className="col-span-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md focus:border-purple-400 focus:outline-none p-2 text-sm min-h-[80px]`}
                  placeholder="Deskripsi..."
                ></textarea>
                {errors.description && (
                  <small className="text-red-500 text-[10px]">
                    {Array.isArray(errors.description)
                      ? errors.description[0]
                      : errors.description}
                  </small>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                placeholder="Mulai"
                label="Tanggal Mulai"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={(val) =>
                  setFormData({ ...formData, start_date: val })
                }
                error={errors}
                inputCol
                disabled={false}
              />
              <InputText
                placeholder="Selesai"
                label="Tanggal Selesai"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={(val) => setFormData({ ...formData, end_date: val })}
                error={errors}
                inputCol
                disabled={false}
              />
            </div>

            <InputSelect
              name="Leader (User)"
              data={users}
              value={formData.id_user_leader}
              onChange={(val) =>
                setFormData({ ...formData, id_user_leader: val })
              }
              error={errors}
              inputCol
              placeholder={
                isLoadingUsers ? "Memuat users..." : "Pilih Leader..."
              }
              disabled={isLoadingUsers}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default AddProgramModal;
