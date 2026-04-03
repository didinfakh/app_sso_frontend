import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { fetchApi } from "../services/ApiService";
import { hasAccess } from "../services/Utils";
import { useToast } from "../context/ToastContext";
import InputText from "../components/ui/InputText";
import InputSelect from "../components/ui/InputSelect";

function ProgramKerjaPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { showToast, showConfirmToast } = useToast();

  const canAdd = hasAccess(currentPath, "add");
  const canEdit = hasAccess(currentPath, "edit");
  const canDelete = hasAccess(currentPath, "delete");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    id_user_leader: "", // Renamed
  });

  const getProgramKerja = async () => {
    setIsLoading(true);
    const response = await fetchApi.getApi("/program-kerja");
    if (response && response.data) {
      setData(response.data);
    }
    setIsLoading(false);
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetchApi.getApi("/sys-user");
      if (response && response.data) {
        setUsers(
          response.data.map((u) => ({
            value: u.id_sys_user || u.id,
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

  useEffect(() => {
    getProgramKerja();
    fetchUsers();
  }, []);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setErrors({});
    if (mode === "edit" && item) {
      setFormData({
        id: item.id,
        name: item.name || "",
        description: item.description || "",
        start_date: item.start_date || "",
        end_date: item.end_date || "",
        id_user_leader: item.id_user_leader || item.id_auth_user_leader || "",
      });
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        id_user_leader: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (modalMode === "add") {
        response = await fetchApi.postApi("/program-kerja", formData);
      } else {
        response = await fetchApi.putApi(
          `/program-kerja/${formData.id}`,
          formData,
        );
      }

      // Check if response is successful
      if (response && !response.errors) {
        showToast(
          modalMode === "add"
            ? "Program Kerja berhasil ditambahkan"
            : "Program Kerja berhasil diperbarui",
          "success",
        );
        closeModal();
        getProgramKerja();
      } else if (response && response.errors) {
        setErrors(response.errors);
        const errorMessages = Object.values(response.errors).flat().join(", ");
        showToast(errorMessages || "Terjadi kesalahan validasi", "error");
      } else {
        showToast(response?.message || "Terjadi kesalahan sistem", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleDelete = async (id) => {
    showConfirmToast(
      "Apakah Anda yakin ingin menghapus program kerja ini?",
      async () => {
        try {
          const response = await fetchApi.deleteApi(`/program-kerja/${id}`);
          if (response && response.status === "success") {
            showToast("Program Kerja berhasil dihapus", "success");
            getProgramKerja();
          } else {
            showToast(
              response?.message || "Gagal menghapus program kerja",
              "error",
            );
          }
        } catch (error) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      },
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Program Kerja
            </h1>
            <p className="text-sm text-gray-500">
              Daftar semua program kerja yang sedang berjalan.
            </p>
          </div>
          {canAdd && (
            <button
              onClick={() => openModal("add")}
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i> Tambah Program Kerja
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <i className="fas fa-spinner fa-spin text-3xl text-purple-600 mb-4"></i>
            <p className="text-gray-500">Memuat data program kerja...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clipboard-list text-gray-300 text-2xl"></i>
            </div>
            <p className="text-gray-500">
              Belum ada program kerja yang ditambahkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/program-kerja/${item.id}`)}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate pr-4">
                    {item.name}
                  </h3>
                  <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Aktif
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                  {item.description || "Tidak ada deskripsi."}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <i className="far fa-calendar-alt"></i>
                    <span>{item.start_date || "-"}</span>
                  </div>
                  <span>-</span>
                  <div className="flex items-center gap-1.5">
                    <i className="far fa-calendar-check"></i>
                    <span>{item.end_date || "-"}</span>
                  </div>
                </div>
                <div
                  className="pt-4 border-t border-gray-50 flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canEdit && (
                    <button
                      onClick={() => openModal("edit", item)}
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors flex items-center justify-center cursor-pointer"
                      title="Edit"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center cursor-pointer"
                      title="Hapus"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40"
            onClick={closeModal}
          ></div>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative z-10">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">
                {modalMode === "add"
                  ? "Tambah Program Kerja"
                  : "Edit Program Kerja"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <InputText
                  placeholder="Nama Program Kerja"
                  name="name"
                  value={formData.name}
                  onChange={(val) => setFormData({ ...formData, name: val })}
                  error={errors}
                  inputCol
                  disabled={false}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                  <div
                    className={`md:text-right font-semibold text-[#333] ${errors.description ? "text-red-500" : ""}`}
                  >
                    Deskripsi
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
                      className={`w-full border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-md focus:border-purple-400 focus:outline-none p-2 text-sm min-h-[100px]`}
                      placeholder="Masukkan deskripsi program kerja..."
                    ></textarea>
                    {errors.description && (
                      <small className="text-red-500 text-xs">
                        {errors.description}
                      </small>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputText
                    placeholder="Tanggal Mulai"
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
                    placeholder="Tanggal Selesai"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(val) =>
                      setFormData({ ...formData, end_date: val })
                    }
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
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <i className="fas fa-save text-sm"></i>
                  Simpan Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramKerjaPage;
